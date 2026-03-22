import Link from "next/link";
import AddToLibraryPanel from "@/components/AddToLibraryPanel";
import BookCover from "@/components/BookCover";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

interface BookData {
  title: string;
  publishedYear: string | null;
  category: string | null;
  description: string | { value: string } | null;
  authorId: string | null;
  isbn: string | null;
  coverThumbnail: string | null;
}

async function fetchBook(id: string): Promise<BookData | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/books/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchAuthorName(authorId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://openlibrary.org/authors/${authorId}.json`,
      { cache: "force-cache" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.name ?? null;
  } catch {
    return null;
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;

  const book = await fetchBook(id);

  if (!book) {
    return (
      <div className="max-w-[88%] mx-auto px-12 py-20 text-center">
        <p className="text-lg font-medium mb-2">Livre introuvable</p>
        <Link href="/search" className="text-sm text-primary hover:underline">
          Retour à la recherche
        </Link>
      </div>
    );
  }

  const authorName = book.authorId ? await fetchAuthorName(book.authorId) : null;
  const genre = book.category ?? null;
  const description =
    typeof book.description === "object" && book.description !== null
      ? book.description.value
      : book.description;
  const coverUrl = book.coverThumbnail ?? null;

  return (
    <div className="max-w-[88%] mx-auto px-12 py-10">
      <div className="flex flex-col md:flex-row gap-12">

        {/* Colonne gauche : couverture + actions */}
        <div className="w-48 shrink-0 flex flex-col gap-5">
          <BookCover
            src={coverUrl}
            alt={`Couverture de ${book.title}`}
            className="w-full aspect-[2/3] object-cover rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
          />

          <AddToLibraryPanel
            openLibraryId={id}
            isbn={book.isbn ?? null}
            title={book.title}
            author={authorName}
            publishedYear={book.publishedYear}
            thumbnail={coverUrl ?? ""}
            genre={genre}
          />
        </div>

        {/* Colonne droite : infos livre */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Tag genre */}
          {genre && (
            <div>
              <span className="text-xs font-medium rounded-md px-3 py-1 bg-[#E2725B] text-white">
                {genre}
              </span>
            </div>
          )}

          {/* Titre */}
          <h1 className="text-3xl font-bold leading-snug">{book.title}</h1>

          {/* Auteur — lien vers les livres de cet auteur */}
          {authorName && (
            <Link
              href={`/search?q=${encodeURIComponent(authorName)}`}
              className="text-base text-primary hover:underline w-fit"
            >
              {authorName}
            </Link>
          )}

          {/* Métadonnées */}
          {book.publishedYear && (
            <p className="text-sm text-muted-foreground">
              Publié en {book.publishedYear}
            </p>
          )}

          {/* Description */}
          {description && (
            <div className="flex flex-col gap-2 mt-2">
              <h2 className="text-base font-semibold">Description</h2>
              <p className="text-sm leading-relaxed text-justify">{description}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
