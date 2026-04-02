// src/app/[locale]/search/page.tsx
import Link from "next/link";
import BookCover from "@/components/BookCover";
import SearchBookActions from "@/components/SearchBookActions";
import { getTranslations } from "next-intl/server";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

interface BookResult {
  id: string;
  title: string;
  author: string | null;
  publishedYear: number | null;
  coverThumbnail: string | null;
  category: string | null;
  isbn: string | null;
}

const ITEMS_PER_PAGE = 16;
const MAX_PAGES = 50;

async function fetchBooks(
  query: string,
  page: number,
): Promise<{ results: BookResult[]; total: number }> {
  try {
    const res = await fetch(
      `${process.env.API_URL}/books/search?q=${encodeURIComponent(query)}&page=${page}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return { results: [], total: 0 };
    const data = await res.json();
    return { results: data.results ?? [], total: data.total ?? 0 };
  } catch {
    return { results: [], total: 0 };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const t = await getTranslations("search"); // traduction côté serveur

  const { q, page } = await searchParams;
  const hasQuery = q !== undefined;
  const query = q?.trim() ?? "";
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  const { results, total } = query
    ? await fetchBooks(query, currentPage)
    : { results: [], total: 0 };

  const totalPages = Math.min(MAX_PAGES, Math.ceil(total / ITEMS_PER_PAGE));

  return (
    <div className="py-10">
      <div className="mx-auto px-6 sm:max-w-7xl sm:px-12">
        {/* Formulaire de recherche */}
        <form
          action="/search"
          method="GET"
          role="search"
          className="mb-10 flex flex-col gap-2 px-4 sm:flex-row sm:px-12"
        >
          <label htmlFor="search-input" className="sr-only">
            {t("labelSearch")}
          </label>
          <input
            id="search-input"
            name="q"
            type="text"
            defaultValue={q ?? ""}
            placeholder={t("placeholderSearch")}
            className="border-border focus:border-primary h-10 w-full rounded-full border px-4 text-sm outline-none"
            autoComplete="off"
          />
          <button
            type="submit"
            className="h-10 w-full shrink-0 rounded-full bg-(--accent-alt) px-8 text-xs font-medium text-white hover:bg-(--accent-alt-hover) sm:w-auto"
            aria-label={t("btnSearch")}
          >
            {t("btnSearch")}
          </button>
        </form>

        <h1 className="mb-1 px-4 text-2xl font-bold sm:px-12">
          {hasQuery ? t("resultsFor", { query }) : t("searchBooks")}
        </h1>

        {!hasQuery && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">{t("searchPrompt")}</p>
          </div>
        )}

        {hasQuery && results.length > 0 && (
          <>
            <p className="text-muted-foreground mb-4 px-4 text-sm sm:px-12">
              {t("resultsCount", { count: total })}
            </p>

            <ul className="divide-border/50 border-border/50 *:border-border/50 2n:border-r-0 md:2n:border-r md:4n:border-r-0 grid grid-cols-2 divide-y *:border-r md:grid-cols-4">
              {results.map((book) => {
                const bookId = book.id.split("/").pop() ?? book.id;
                return (
                  <li
                    key={book.id}
                    className="flex flex-col px-4 py-6 sm:px-8 sm:py-12"
                  >
                    <BookCover
                      src={book.coverThumbnail}
                      alt={`Couverture de ${book.title}`}
                      className="aspect-2/3 w-full rounded-xl object-cover shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                    />
                    <div className="mt-3 flex flex-1 flex-col">
                      <h2 className="font-playfair text-sm leading-snug font-bold">
                        {book.title}
                      </h2>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {book.author ?? t("unknownAuthor")}
                      </p>
                      <div className="mt-auto flex flex-col gap-2 pt-4">
                        {book.category && (
                          <span className="group tag-terracotta relative w-fit rounded border px-2 py-0.5 text-base">
                            {book.category.length > 20
                              ? `${book.category.slice(0, 17)}...`
                              : book.category}
                            <span className="absolute -top-8 left-0 z-10 hidden rounded border bg-white px-2 py-1 text-xs whitespace-nowrap text-gray-800 shadow-md group-hover:block">
                              {book.category}
                            </span>
                          </span>
                        )}
                        <div className="flex w-full flex-col gap-2 lg:flex-row">
                          <Link
                            href={`/book/${bookId}`}
                            className="flex w-full items-center justify-center rounded-md bg-(--color-btn-subtle) py-1.5 text-xs font-medium hover:bg-(--color-btn-subtle-hover) active:bg-(--color-btn-subtle-active) sm:grow dark:bg-gray-800"
                            aria-label={t("viewBookDetails", {
                              title: book.title,
                            })}
                          >
                            {t("viewDetails")}
                          </Link>
                          <SearchBookActions
                            bookId={bookId}
                            isbn={book.isbn}
                            title={book.title}
                            author={book.author}
                            publishedYear={book.publishedYear}
                            thumbnail={book.coverThumbnail}
                            category={book.category}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {totalPages > 1 && (
              <nav
                aria-label="pagination"
                className="mt-12 flex items-center justify-center gap-6 px-4 sm:px-12"
              >
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&page=${Math.max(1, currentPage - 1)}`}
                  className="border-primary hover:bg-primary/5 inline-flex h-8 items-center gap-2 rounded border px-4 text-xs font-medium"
                >
                  <span className="text-foreground">{t("previous")}</span>
                </Link>

                <span className="text-muted-foreground text-xs">
                  {t("pageOf", { current: currentPage, total: totalPages })}
                </span>

                <Link
                  href={`/search?q=${encodeURIComponent(query)}&page=${Math.min(totalPages, currentPage + 1)}`}
                  className="border-primary hover:bg-primary/5 inline-flex h-8 items-center gap-2 rounded border px-4 text-xs font-medium"
                >
                  <span className="text-foreground">{t("next")}</span>
                </Link>
              </nav>
            )}
          </>
        )}

        {hasQuery && results.length === 0 && (
          <div className="py-20 text-center">
            <p className="mb-2 text-lg font-medium">
              {t("noResults", { query })}
            </p>
            <p className="text-muted-foreground text-sm">
              {t("noResultsHint")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
