import Link from "next/link";
import AddToLibraryPanel from "@/components/AddToLibraryPanel";
import BookCover from "@/components/BookCover";
import ExpandableDescription from "@/components/ExpandableDescription";
import { getTranslations } from "next-intl/server";
import ShareButton from "@/components/ShareButton";
import RelatedBooks from "@/components/RelatedBooks";
import { Suspense } from "react";

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
      {
        cache: "force-cache",
      },
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

  const tBooks = await getTranslations("book"); // Toutes les valeurs dynamiques viennent de books.json

  const book = await fetchBook(id);

  if (!book) {
    return (
      <div className="mx-auto px-6 py-20 text-center sm:max-w-7xl sm:px-12">
        <p className="mb-2 text-lg font-medium">{tBooks("notFound.title")}</p>
        <Link
          href="/search"
          className="text-primary text-sm hover:underline"
          aria-label={tBooks("notFound.backSearch")}
        >
          {tBooks("notFound.backSearch")}
        </Link>
      </div>
    );
  }

  const authorName = book.authorId
    ? await fetchAuthorName(book.authorId)
    : null;
  const genre = book.category ?? null;
  const description =
    typeof book.description === "object" && book.description !== null
      ? book.description.value
      : book.description;
  const coverUrl = book.coverThumbnail ?? null;

  return (
    <div className="mx-auto px-6 py-8 sm:max-w-7xl sm:px-12 md:py-10">
      <div className="flex flex-col gap-6 md:flex-row md:gap-8 lg:gap-12">
        {/* Colonne gauche : couverture + actions */}
        <div className="flex flex-col items-center gap-5 md:w-56 md:shrink-0 md:items-start lg:w-64">
          {/* Tag genre au dessus de la cover — mobile uniquement */}
          {genre && (
            <div className="self-start md:hidden">
              <p aria-label={`${tBooks("labels.genre")} : ${genre}`}>
                <span className="rounded-md bg-(--accent-alt) px-3 py-1 text-xs font-medium tracking-wide text-white uppercase">
                  {genre}
                </span>
              </p>
            </div>
          )}

          <BookCover
            src={coverUrl}
            alt={`Couverture du livre ${book.title}`}
            className="aspect-2/3 w-56 rounded-xl object-cover shadow-[0_4px_16px_rgba(0,0,0,0.35)] sm:w-64 md:w-full"
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
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* Tag genre — desktop uniquement */}
          {genre && (
            <div className="hidden md:block">
              <span className="rounded-md bg-(--accent-alt) px-3 py-1 text-xs font-medium tracking-wide text-white uppercase">
                {genre}
              </span>
            </div>
          )}

          <div className="align-items flex items-start gap-1">
            <h1 className="text-2xl leading-snug font-bold md:text-3xl">
              {book.title}
            </h1>
            <ShareButton />
          </div>

          {authorName && (
            <p>
              {tBooks("labels.author")}{" "}
              <Link
                href={`/search?q=${encodeURIComponent(authorName)}`}
                className="text-primary w-fit text-base hover:underline"
              >
                <span className="underline">{authorName}</span>
              </Link>
            </p>
          )}

          {book.publishedYear && (
            <p className="text-muted-foreground text-sm">
              {tBooks("labels.published")} {book.publishedYear}
            </p>
          )}

          {description && (
            <div className="mt-2">
              <hr className="border-border mb-3 border-t" aria-hidden="true" />
              <ExpandableDescription description={description} />
            </div>
          )}
        </div>
      </div>
      <section
        aria-labelledby="vous-pourriez-aimer"
        className="py-10 sm:max-w-7xl sm:py-20"
      >
        <div className="mt-8 mb-8 px-2 sm:mt-0 sm:mb-0">
          <h2
            id="vous-pourriez-aimer"
            className="mb-1 text-center text-2xl font-bold sm:text-left"
          >
            {tBooks("section.moment.title")}
          </h2>
          <p className="text-muted-foreground text-center text-xs tracking-widest sm:text-left">
            {tBooks("section.moment.subtitle")}
          </p>
        </div>
        <div className="mx-auto">
          {/* Suspense permet d'afficher un état de chargement pendant que les livres sont récupérés */}
          <Suspense
            fallback={
              <div className="text-muted-foreground text-center">
                {tBooks("loading")}
              </div>
            }
          >
            <RelatedBooks authorId={book.authorId} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
