import type { Request, Response } from "express";
import type { OpenLibraryResponse } from "../@types/index";
import { BadRequestError, NotFoundError } from "@/errors";
import { cacheGet, cacheSet } from "../utils/redisClient";
import { getPersonalizedBooks } from "../utils/recommendation";

const RANDOM_GENRES = [
  "novel",
  "fantasy",
  "science fiction",
  "mystery",
  "romance",
  "thriller",
  "historical fiction",
  "adventure",
  "biography",
  "poetry",
  "philosophy",
  "history",
  "cooking",
  "travel",
  "science",
  "psychology",
  "art",
  "music",
  "humor",
  "self-help",
];
const USER_AGENT = "BlaBlaBook/1.0 (contact@blablabook.fr)";

/**
 * Extrait un genre lisible depuis les sujets Open Library.
 * Filtre les valeurs inutiles (series:*, noms propres, sujets trop courts).
 */
function pickCategory(subjects?: string[]): string | null {
  if (!subjects?.length) return null;
  const skip = /^(series:|nyt:|place:|time:|person:|the |a |an )/i;
  const isGenre = (s: string) =>
    s.length >= 4 &&
    s.length <= 40 &&
    !skip.test(s) &&
    /[a-z]/i.test(s) &&
    // Exclure les mots isolés en minuscule (noms communs trop vagues : "orphans", "wizards")
    (s.includes(" ") || /^[A-Z]/.test(s));
  return subjects.find(isGenre) ?? null;
}

// Constantes de temps pour le cache (TTL = Time To Live en secondes)
const TTL_SEARCH = 60 * 60; // 1h — résultats de recherche
const TTL_BOOK = 60 * 60 * 24; // 24h — détail d'un livre (données stables)
const TTL_RANDOM = 60 * 10; // 10min — sélection homepage

export async function getRandomBooks(req: Request, res: Response) {
  const { authorId } = req.query as { authorId?: string };

  if (authorId) {
    const cacheKey = `random:author:${authorId}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.send(JSON.parse(cached));

    const authorRes = await fetch(
      `https://openlibrary.org/authors/${encodeURIComponent(authorId)}.json`,
      { headers: { "User-Agent": USER_AGENT } },
    );
    if (!authorRes.ok) return res.send([]);

    const authorData = await authorRes.json();
    const authorName = authorData.name;

    if (!authorName) return res.send([]);

    const result = await fetch(
      `https://openlibrary.org/search.json?author=${encodeURIComponent(
        authorName,
      )}&limit=10&fields=key,title,author_name,author_key,cover_i,first_publish_year,isbn`,
    );

    if (!result.ok) return res.send([]);

    const data: OpenLibraryResponse = await result.json();
    const { docs } = data;

    const selectedDatas = docs.map((doc) => ({
      author: doc.author_name?.[0] ?? null,
      authorId: doc.author_key?.[0] ?? null,
      title: doc.title,
      id: doc.key,
      isbn: doc.isbn?.[0] ?? null,
      coverThumbnail: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : null,
    }));

    await cacheSet(cacheKey, JSON.stringify(selectedDatas), TTL_RANDOM);
    return res.send(selectedDatas);
  }

  // Recommandations personnalisées si utilisateur authentifié
  if (req.user?.id) {
    try {
      const personalized = await getPersonalizedBooks(req.user.id);
      if (personalized) return res.send(personalized);
    } catch {
      // Fallback silencieux vers la sélection aléatoire
    }
  }

  const genre = RANDOM_GENRES[Math.floor(Math.random() * RANDOM_GENRES.length)];
  const page = Math.floor(Math.random() * 50);
  const limit = 4;

  const cacheKey = `random:${genre}:${page}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.send(JSON.parse(cached));

  const result = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(genre)}&page=${page}&limit=${limit}&fields=key,title,author_name,author_key,cover_i,first_publish_year,isbn`,
    { headers: { "User-Agent": USER_AGENT } },
  );

  const data: OpenLibraryResponse = await result.json();
  const { docs } = data;

  const selectedDatas = docs.map((doc) => ({
    author: doc.author_name?.[0] ?? null,
    authorId: doc.author_key?.[0] ?? null,
    title: doc.title,
    id: doc.key,
    isbn: doc.isbn?.[0] ?? null,
    coverThumbnail: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,
  }));

  await cacheSet(cacheKey, JSON.stringify(selectedDatas), TTL_RANDOM);
  return res.send(selectedDatas);
}

export async function searchBooks(req: Request, res: Response) {
  const query = req.query.q as string;

  if (!query) throw new BadRequestError("Search query is required");

  const page = Math.min(
    Math.max(1, parseInt(req.query.page as string, 10) || 1),
    100,
  );
  const limit = 16;

  const cacheKey = `search:${query}:${page}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.send(JSON.parse(cached));

  const result = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&fields=key,title,author_name,author_key,cover_i,first_publish_year,subject,isbn`,
    { headers: { "User-Agent": USER_AGENT } },
  );

  const data: OpenLibraryResponse = await result.json();
  const { docs, numFound } = data;

  const response = {
    results: docs.map((doc) => ({
      id: doc.key,
      title: doc.title,
      author: doc.author_name?.[0] ?? null,
      authorId: doc.author_key?.[0] ?? null,
      publishedYear: doc.first_publish_year ?? null,
      coverThumbnail: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : null,
      category: pickCategory(doc.subject),
      isbn: doc.isbn?.[0] ?? null,
    })),
    total: numFound,
    page,
  };

  await cacheSet(cacheKey, JSON.stringify(response), TTL_SEARCH);
  return res.send(response);
}

export async function getBookById(req: Request, res: Response) {
  const id = req.params.openLibraryId;

  if (!id) return;

  const cacheKey = `book:${id}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.send(JSON.parse(cached));

  const result = await fetch(
    `https://openlibrary.org/search.json?q=key:/works/${id}&fields=key,title,first_publish_year,subject,isbn,author_key,author_name,description,cover_i`,
    { headers: { "User-Agent": USER_AGENT } },
  );

  const data = await result.json();
  const doc = data.docs?.[0];

  if (!doc) {
    throw new NotFoundError("Book not found");
  }

  const book = {
    title: doc.title,
    publishedYear: doc.first_publish_year ?? null,
    category: pickCategory(doc.subject),
    description: doc.description ?? null,
    authorId: doc.author_key?.[0] ?? null,
    author: doc.author_name?.[0] ?? null,
    isbn: doc.isbn?.[0] ?? null,
    coverThumbnail: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,
  };

  await cacheSet(cacheKey, JSON.stringify(book), TTL_BOOK);
  return res.send(book);
}

export async function suggestBooks(req: Request, res: Response) {
  const query = (req.query.q as string)?.trim();
  if (!query || query.length < 4) return res.send([]);

  const limit = 6;
  const cacheKey = `suggest:${query}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.send(JSON.parse(cached));

  const result = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=key,title,author_name,cover_i`,
    { headers: { "User-Agent": USER_AGENT } },
  );

  if (!result.ok) return res.send([]);

  const data: OpenLibraryResponse = await result.json();
  const suggestions = data.docs.map((doc) => ({
    id: doc.key,
    title: doc.title,
    author: doc.author_name?.[0] ?? null,
    coverThumbnail: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`
      : null,
  }));

  await cacheSet(cacheKey, JSON.stringify(suggestions), TTL_SEARCH);
  return res.send(suggestions);
}
