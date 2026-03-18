import Image from "next/image";
import Link from "next/link";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

// TODO: remplacer par les vrais résultats GET /books/search?q=...
const mockResults = [
  { id: "OL1W", title: "Stefan Zweig : le voyageur et ses mondes", author: "George Steiner", genre: "Biographie", thumbnail: null },
  { id: "OL2W", title: "Stefan Zweig et la France", author: "Stefan Zweig", genre: "Non spécifié", thumbnail: null },
  { id: "OL3W", title: "Stefan Zweig ou empire l'Europe à son sourire", author: "Sophie Faguinier", genre: "Biographie", thumbnail: null },
  { id: "OL4W", title: "Stefan Zweig : biographie", author: "Dominique Bona", genre: "Biographie", thumbnail: null },
  { id: "OL5W", title: "Lettre d'une inconnue suivi de La joueur d'échecs", author: "Stefan Zweig", genre: "Fiction", thumbnail: null },
  { id: "OL6W", title: "Seuls les vivants créent le monde", author: "Stefan Zweig", genre: "Fiction", thumbnail: null },
  { id: "OL7W", title: "Amok ou le feu de Malaisie: un roman de Stefan Zweig", author: "Stefan Zweig", genre: "Fiction", thumbnail: null },
  { id: "OL8W", title: "Stefan Zweig, l'impossible renoncement", author: "Bettina Ayerst, Pierre Michard", genre: "Biographie", thumbnail: null },
  { id: "OL9W", title: "Le monde d'hier", author: "Stefan Zweig", genre: "Autobiographie", thumbnail: null },
  { id: "OL10W", title: "Vingt-quatre heures de la vie d'une femme", author: "Stefan Zweig", genre: "Fiction", thumbnail: null },
];

const ITEMS_PER_PAGE = 8;

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page } = await searchParams;

  const hasQuery = q !== undefined;
  const query = q?.trim() ?? "";
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  // TODO: const results = await fetch(`${process.env.API_URL}/books/search?q=${query}&page=${currentPage}`).then(r => r.json())
  const allResults = query ? mockResults : [];
  const totalPages = Math.ceil(allResults.length / ITEMS_PER_PAGE);
  const results = allResults.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="py-10">
      <div className="max-w-[88%] mx-auto">

        {/* Formulaire de recherche */}
        <form action="/search" method="GET" className="flex gap-2 mb-10 px-12">
          <label htmlFor="search-input" className="sr-only">
            Rechercher un livre ou un auteur
          </label>
          <input
            id="search-input"
            name="q"
            type="text"
            defaultValue={q ?? ""}
            placeholder="Rechercher un livre, un auteur..."
            className="flex-1 border border-border rounded-full px-4 h-10 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="h-10 rounded-full bg-[#E2725B] hover:bg-[#c85e48] text-white text-xs font-medium px-8 shrink-0"
          >
            Rechercher
          </button>
        </form>

        {/* État : pas de requête */}
        {!hasQuery && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              Utilisez la barre de recherche pour trouver un livre.
            </p>
          </div>
        )}

        {/* État : requête avec résultats */}
        {hasQuery && results.length > 0 && (
          <>
            <h1 className="text-2xl font-bold mb-1 px-12">
              Résultats de recherche pour &quot;{query}&quot;
            </h1>
            <p className="text-sm text-muted-foreground mb-8 px-12">
              {allResults.length} résultat{allResults.length > 1 ? "s" : ""}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-border/50">
              {results.map((book) => (
                <div key={book.id} className="flex flex-col px-8 py-12">
                  {book.thumbnail ? (
                    <Image
                      src={book.thumbnail}
                      alt={`Couverture de ${book.title}`}
                      width={200}
                      height={300}
                      className="w-full aspect-[2/3] object-cover rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                    />
                  ) : (
                    <Image
                      src="/default-cover.png"
                      alt="Couverture non disponible"
                      width={200}
                      height={300}
                      className="w-full aspect-[2/3] object-cover rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                    />
                  )}
                  <div className="flex flex-col flex-1 mt-3">
                    <p className="font-bold text-sm leading-snug font-playfair">{book.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{book.author}</p>
                    {/* Tag + boutons alignés en bas */}
                    <div className="mt-auto pt-4 flex flex-col gap-2">
                      <span className="text-xs border rounded px-2 py-0.5 w-fit tag-terracotta">
                        {book.genre}
                      </span>
                      <div className="flex gap-2 w-full">
                        <Link
                          href={`/book/${book.id}`}
                          className="flex items-center justify-center rounded-md bg-[#E5E7EB] py-1.5 text-xs font-medium hover:bg-[#D1D5DB] grow min-w-0"
                        >
                          Voir le détail
                        </Link>
                        <button
                          type="button"
                          className="flex items-center justify-center rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:bg-primary/90 whitespace-nowrap shrink-0"
                        >
                          <span className="text-sm font-black leading-none mr-1.5" style={{ WebkitTextStroke: "1px currentColor" }}>+</span>Biblio
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-12 px-12">
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
              </div>
            )}
          </>
        )}

        {/* État : requête sans résultats */}
        {hasQuery && allResults.length === 0 && (
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
