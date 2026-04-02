import { prisma } from "./prismaClient";
import { cacheGet, cacheSet } from "./redisClient";
import type { ReadingStatus } from "../../generated/prisma/enums";

// ─── Constants ──────────────────────────────────────────────────────────

const USER_AGENT = "BlaBlaBook/1.0 (contact@blablabook.fr)";
const TTL_RECO = 60 * 30; // 30 min — recommandations personnalisées
const MIN_LIBRARY_SIZE = 3;

const FALLBACK_GENRES = [
  "novel", "fantasy", "science fiction", "mystery", "romance",
  "thriller", "historical fiction", "adventure", "biography", "poetry",
];

// ─── Types ──────────────────────────────────────────────────────────────

interface UserProfile {
  genreWeights: Map<string, number>;
  authorWeights: Map<string, number>;
  eraPreference: number | null;
  libraryBookIds: Set<string>; // openLibraryIds déjà en biblio
}

interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  author_key?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
  isbn?: string[];
}

interface RecommendedBook {
  id: string;
  title: string;
  author: string | null;
  authorId: string | null;
  isbn: string | null;
  coverThumbnail: string | null;
}

// ─── Phase 1 : Profil utilisateur pondéré ───────────────────────────────

const STATUS_WEIGHTS: Record<ReadingStatus, number> = {
  READING: 1.5,
  READ: 1.0,
  TO_READ: 0.5,
};

async function buildUserProfile(userId: string): Promise<UserProfile | null> {
  const items = await prisma.library_item.findMany({
    where: { userId },
    include: { book: true },
  });

  if (items.length < MIN_LIBRARY_SIZE) return null;

  const genreWeights = new Map<string, number>();
  const authorWeights = new Map<string, number>();
  const libraryBookIds = new Set<string>();
  let eraSum = 0;
  let eraCount = 0;

  for (const item of items) {
    const baseWeight = STATUS_WEIGHTS[item.status];
    const ratingMultiplier = item.rating ? item.rating / 5 : 0.8;
    const weight = baseWeight * ratingMultiplier;

    // Genre
    if (item.book.genre) {
      const genre = item.book.genre.toLowerCase();
      genreWeights.set(genre, (genreWeights.get(genre) ?? 0) + weight);
    }

    // Auteur
    if (item.book.author) {
      const author = item.book.author.toLowerCase();
      authorWeights.set(author, (authorWeights.get(author) ?? 0) + weight);
    }

    // Époque
    if (item.book.publishedYear) {
      eraSum += item.book.publishedYear * weight;
      eraCount += weight;
    }

    // Exclusion
    if (item.book.openLibraryId) {
      libraryBookIds.add(item.book.openLibraryId);
    }
  }

  return {
    genreWeights,
    authorWeights,
    eraPreference: eraCount > 0 ? Math.round(eraSum / eraCount) : null,
    libraryBookIds,
  };
}

// ─── Phase 2 : Génération des requêtes ciblées ──────────────────────────

function sortedEntries(map: Map<string, number>): [string, number][] {
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

interface TaggedQuery {
  query: string;
  tag: "genre" | "author" | "serendipity";
}

function generateSearchQueries(profile: UserProfile): TaggedQuery[] {
  const queries: TaggedQuery[] = [];

  // Top 2 genres
  const topGenres = sortedEntries(profile.genreWeights).slice(0, 2);
  for (const [genre] of topGenres) {
    queries.push({ query: genre, tag: "genre" });
  }

  // Top 1 auteur
  const topAuthors = sortedEntries(profile.authorWeights).slice(0, 1);
  for (const [author] of topAuthors) {
    queries.push({ query: `author:${author}`, tag: "author" });
  }

  // Sérendipité : genre hors des préférences
  const userGenres = new Set(profile.genreWeights.keys());
  const serendipityPool = FALLBACK_GENRES.filter((g) => !userGenres.has(g));
  const serendipityGenre =
    serendipityPool.length > 0
      ? serendipityPool[Math.floor(Math.random() * serendipityPool.length)]
      : FALLBACK_GENRES[Math.floor(Math.random() * FALLBACK_GENRES.length)];
  queries.push({ query: serendipityGenre, tag: "serendipity" });

  // Compléter si < 4 requêtes (peu de genres/auteurs en biblio)
  while (queries.length < 4) {
    const filler = FALLBACK_GENRES[Math.floor(Math.random() * FALLBACK_GENRES.length)];
    queries.push({ query: filler, tag: "serendipity" });
  }

  return queries;
}

// ─── Phase 3 : Scoring multi-critères (0-100) ──────────────────────────

function scoreBook(
  doc: OpenLibraryDoc,
  profile: UserProfile,
  tag: "genre" | "author" | "serendipity",
  resultIndex: number,
): number {
  let score = 0;

  // Genre match (0-35)
  if (doc.subject) {
    const docSubjects = doc.subject.slice(0, 5).map((s) => s.toLowerCase());
    const genreEntries = sortedEntries(profile.genreWeights);
    for (let i = 0; i < genreEntries.length && i < 5; i++) {
      const [genre] = genreEntries[i];
      if (docSubjects.some((s) => s.includes(genre) || genre.includes(s))) {
        score += 35 - i * 5; // Top genre: 35pts, 2nd: 30pts, etc.
        break;
      }
    }
  }

  // Author match (0-25)
  if (doc.author_name?.[0]) {
    const docAuthor = doc.author_name[0].toLowerCase();
    const authorEntries = sortedEntries(profile.authorWeights);
    for (let i = 0; i < authorEntries.length && i < 3; i++) {
      const [author] = authorEntries[i];
      if (docAuthor.includes(author) || author.includes(docAuthor)) {
        score += 25 - i * 5; // Top author: 25pts, 2nd: 20pts, etc.
        break;
      }
    }
  }

  // Era match (0-15)
  if (profile.eraPreference && doc.first_publish_year) {
    const distance = Math.abs(doc.first_publish_year - profile.eraPreference);
    if (distance <= 10) score += 15;
    else if (distance <= 30) score += 10;
    else if (distance <= 60) score += 5;
  }

  // Novelty — pas déjà en bibliothèque (0-10)
  const olId = doc.key?.split("/").pop();
  if (olId && !profile.libraryBookIds.has(olId)) {
    score += 10;
  }

  // Cover bonus (0-5)
  if (doc.cover_i && doc.cover_i > 0) {
    score += 5;
  }

  // Popularity — position dans les résultats OL (0-5)
  score += Math.max(0, 5 - resultIndex);

  // Serendipity bonus (0-5)
  if (tag === "serendipity") {
    score += 5;
  }

  return score;
}

// ─── Phase 4 & 5 : Orchestration + cache ────────────────────────────────

async function fetchOpenLibrary(query: string, limit: number): Promise<OpenLibraryDoc[]> {
  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=key,title,author_name,author_key,cover_i,first_publish_year,subject,isbn`;
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs ?? [];
  } catch {
    return [];
  }
}

function formatBook(doc: OpenLibraryDoc): RecommendedBook {
  return {
    id: doc.key,
    title: doc.title,
    author: doc.author_name?.[0] ?? null,
    authorId: doc.author_key?.[0] ?? null,
    isbn: doc.isbn?.[0] ?? null,
    coverThumbnail: doc.cover_i && doc.cover_i > 0
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,
  };
}

export async function getPersonalizedBooks(userId: string): Promise<RecommendedBook[] | null> {
  // Cache par bucket de 30 min
  const bucket = Math.floor(Date.now() / (TTL_RECO * 1000));
  const cacheKey = `reco:${userId}:${bucket}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return JSON.parse(cached);

  // Phase 1 : profil
  const profile = await buildUserProfile(userId);
  if (!profile) return null; // < 3 livres → fallback random

  // Phase 2 : requêtes ciblées
  const queries = generateSearchQueries(profile);

  // Phase 3 : fetch parallèle + scoring
  const fetches = queries.map(async ({ query, tag }) => {
    const docs = await fetchOpenLibrary(query, 8);
    return docs.map((doc, i) => ({
      doc,
      score: scoreBook(doc, profile, tag, i),
    }));
  });

  const results = (await Promise.all(fetches)).flat();

  // Phase 4 : filtrage + déduplication + sélection
  const seen = new Set<string>();
  const filtered = results
    .filter(({ doc }) => {
      const olId = doc.key?.split("/").pop();
      // Exclure livres déjà en bibliothèque
      if (olId && profile.libraryBookIds.has(olId)) return false;
      // Exclure sans cover (meilleur rendu homepage)
      if (!doc.cover_i || doc.cover_i <= 0) return false;
      // Dédupliquer par key
      if (seen.has(doc.key)) return false;
      seen.add(doc.key);
      return true;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ doc }) => formatBook(doc));

  // Phase 5 : cache
  if (filtered.length > 0) {
    await cacheSet(cacheKey, JSON.stringify(filtered), TTL_RECO);
  }

  return filtered.length > 0 ? filtered : null;
}
