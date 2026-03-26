import Link from "next/link";
import AddToLibraryButton from "@/components/AddToLibraryButton";
import BookCover from "@/components/BookCover";

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
  page: number
): Promise<{ results: BookResult[]; total: number }> {
  try {
    const res = await fetch(
      `${process.env.API_URL}/books/search?q=${encodeURIComponent(query)}&page=${page}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return { results: [], total: 0 };
    const data = await res.json();
    return { results: data.results ?? [], total: data.total ?? 0 };
  } catch {
    return { results: [], total: 0 };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
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
      <div className="max-w-[88%] mx-auto">

        <form action="/search" method="GET" className="flex flex-col sm:flex-row gap-2 mb-10 px-4 sm:px-12" role="search">
          <label htmlFor="search-input" className="sr-only">
            Rechercher un livre ou un auteur
          </label>
          <input
            id="search-input"
            name="q"
            type="text"
            defaultValue={q ?? ""}
            placeholder="Rechercher un livre, un auteur..."
            className="w-full border border-border rounded-full px-4 h-10 text-sm outline-none focus:border-primary"
            autoComplete="off"
          />
          <button
            type="submit"
            className="h-10 rounded-full bg-[#E2725B] hover:bg-[#c85e48] text-white text-xs font-medium px-8 shrink-0 w-full sm:w-auto"
            aria-label="Lancer la recherche"
          >
            Rechercher
          </button>
        </form>

        <h1 className="text-2xl font-bold mb-1 px-4 sm:px-12">
          {hasQuery
            ? `Résultats de recherche pour "${query}"`
            : "Recherche de livres"}
        </h1>

        {!hasQuery && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              Utilisez la barre de recherche pour trouver un livre.
            </p>
          </div>
        )}

        {hasQuery && results.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-4 px-4 sm:px-12">
              {total} résultat{total > 1 ? "s" : ""}
            </p>

            <ul className="grid grid-cols-2 md:grid-cols-4 divide-y divide-border/50 [&>*]:border-r [&>*]:border-border/50 [&>*:nth-child(2n)]:border-r-0 md:[&>*:nth-child(2n)]:border-r md:[&>*:nth-child(4n)]:border-r-0">
              {results.map((book) => {
                const bookId = book.id.split("/").pop() ?? book.id;
                return (
                  <li key={book.id} className="flex flex-col px-4 py-6 sm:px-8 sm:py-12">
                    <BookCover
                      src={book.coverThumbnail}
                      alt={`Couverture de ${book.title}`}
                      className="w-full aspect-[2/3] object-cover rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                    />
                    <div className="flex flex-col flex-1 mt-3">
                      <h2 className="font-bold text-sm leading-snug font-playfair">{book.title}</h2>
                      <p className="text-xs text-muted-foreground mt-1">{book.author ?? "Auteur inconnu"}</p>
                      <div className="mt-auto pt-4 flex flex-col gap-2">
                        {book.category && (
                          <span className="text-base border rounded px-2 py-0.5 w-fit tag-terracotta">
                            {book.category}
                          </span>
                        )}
                        <div className="flex flex-col lg:flex-row gap-2 w-full">
                          <Link
                            href={`/book/${bookId}`}
                            className="flex items-center justify-center rounded-md bg-[#E5E7EB] py-1.5 text-xs font-medium hover:bg-[#D1D5DB] active:bg-[#C4C9D0] w-full sm:grow"
                            aria-label={`Voir le détail du livre ${book.title}`}
                          >
                            Voir le détail
                          </Link>
                          <AddToLibraryButton
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
              <nav aria-label="pagination" className="flex items-center justify-center gap-6 mt-12 px-4 sm:px-12">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&page=${Math.max(1, currentPage - 1)}`}
                  className="inline-flex items-center gap-2 border border-primary rounded px-4 h-8 text-xs font-medium hover:bg-primary/5"
                >
                  <svg width="10" height="13" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                    <polyline points="6,1 1,5 6,9" />
                    <line x1="1" y1="5" x2="11" y2="5" />
                  </svg>
                  <span className="text-foreground">Précédent</span>
                </Link>

                <span className="text-xs text-muted-foreground">
                  Page {currentPage} / {totalPages}
                </span>

                <Link
                  href={`/search?q=${encodeURIComponent(query)}&page=${Math.min(totalPages, currentPage + 1)}`}
                  className="inline-flex items-center gap-2 border border-primary rounded px-4 h-8 text-xs font-medium hover:bg-primary/5"
                >
                  <span className="text-foreground">Suivant</span>
                  <svg width="10" height="13" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
                    <polyline points="6,1 11,5 6,9" />
                    <line x1="11" y1="5" x2="1" y2="5" />
                  </svg>
                </Link>
              </nav>
            )}
          </>
        )}

        {hasQuery && results.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg font-medium mb-2">
              Aucun résultat pour &quot;{query}&quot;
            </p>
            <p className="text-sm text-muted-foreground">
              Essayez avec d&apos;autres mots-clés ou vérifiez l&apos;orthographe.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}