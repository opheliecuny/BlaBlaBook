import Link from "next/link";
import AddToLibraryPanel from "@/components/AddToLibraryPanel";
import BookCover from "@/components/BookCover";
import ExpandableDescription from "@/components/ExpandableDescription";

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
  <div className="max-w-[88%] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10">
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12">

      {/* Colonne gauche : couverture + actions */}
      <div className="flex flex-col items-center md:items-start gap-5 md:shrink-0 md:w-56 lg:w-64">

        {/* Tag genre au dessus de la cover — mobile uniquement */}
        {genre && (
          <div className="self-start md:hidden">
            <span className="text-xs font-medium rounded-md px-3 py-1 bg-[#E2725B] text-white uppercase tracking-wide">
              {genre}
            </span>
          </div>
        )}

        <BookCover
          src={coverUrl}
          alt={`Couverture de ${book.title}`}
          className="w-56 sm:w-64 md:w-full aspect-[2/3] object-cover rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
        />
        <div className="w-full">
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
      </div>

      {/* Colonne droite : infos livre */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">

        {/* Tag genre — desktop uniquement */}
        {genre && (
          <div className="hidden md:block">
            <span className="text-xs font-medium rounded-md px-3 py-1 bg-[#E2725B] text-white uppercase tracking-wide">
              {genre}
            </span>
          </div>
        )}

        <h1 className="text-2xl md:text-3xl font-bold leading-snug">{book.title}</h1>

        {authorName && (
          <Link
            href={`/search?q=${encodeURIComponent(authorName)}`}
            className="text-base text-primary hover:underline w-fit"
          >
            {authorName}
          </Link>
        )}

        {book.publishedYear && (
          <p className="text-sm text-muted-foreground">
            Publié en {book.publishedYear}
          </p>
        )}

        {description && (
          <div className="mt-2">
            <hr className="border-t border-border mb-3" />
            <ExpandableDescription description={description} />
          </div>
        )}
      </div>

    </div>
  </div>
);
};