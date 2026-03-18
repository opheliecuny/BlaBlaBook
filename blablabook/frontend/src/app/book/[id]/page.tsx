import Image from "next/image";
import Link from "next/link";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

// TODO: remplacer par les vraies données GET /books/:openLibraryId
const mockBook = {
  id: "OL123456W",
  title: "Lettre d'une inconnue suivi de Le joueur d'échecs",
  author: "Stefan Zweig",
  genre: "Roman",
  description:
    "« À lui qui ne m'as jamais connue » La lettre, anonyme, s'adresse bien à lui, à l'homme qu'il était et qu'il est devenu, l'écrivain célèbre pour son talent, sa finesse et ses conquêtes. Comment se souvenir de cette femme qui lui déclare sa passion de toute une vie, de cette adolescente de 13 ans qui l'aimait et l'aimait encore, silence agacé ? Comment revoir le visage de cette enfant qui l'a vu partir et revenir, les yeux remplis de larmes et les bras écartés ? Dans ces quelques pages défile l'existence d'une esclave dévouée par une attente éternelle, un amour obsessionnel et absolu. Celle, il a, sans jamais rien savoir de rien, que « rien ne rend un homme si beau que le jeu ».",
  publisher: "Classiques Pocket",
  publishedYear: 2013,
  pageCount: 83,
  language: "Français",
  isbn: "9782266195607",
  thumbnail: null,
};

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;

  // TODO: const book = await fetch(`${process.env.API_URL}/books/${id}`).then(r => r.json())
  const book = { ...mockBook, id };

  // TODO: récupérer depuis AuthContext (isLoggedIn)
  const isLoggedIn = false;

  return (
    <div className="max-w-[88%] mx-auto px-12 py-10">
      <div className="flex flex-col md:flex-row gap-12">

        {/* Colonne gauche : couverture + actions */}
        <div className="w-48 shrink-0 flex flex-col gap-5">
          <Image
            src={book.thumbnail ?? "/default-cover.png"}
            alt={book.thumbnail ? `Couverture de ${book.title}` : "Couverture non disponible"}
            width={200}
            height={300}
            className="w-full aspect-[2/3] object-cover rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
          />

          {isLoggedIn ? (
            <div className="flex flex-col gap-2.5 border border-border rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="status" className="text-xs text-foreground">
                  Statut de lecture
                </label>
                <select
                  id="status"
                  name="status"
                  className="w-full border border-border rounded px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="TO_READ">À lire</option>
                  <option value="READING">En cours</option>
                  <option value="READ">Lu</option>
                </select>
              </div>
              {/* TODO: brancher sur POST /library avec { openLibraryId: id, status } */}
              <button
                type="button"
                className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-5 py-2 text-[0.65rem] font-medium hover:bg-primary/90 whitespace-nowrap"
              >
                + Ajouter à ma bibliothèque
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 border border-border rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-xs text-foreground">Statut de lecture</p>
                <select
                  className="w-full border border-border rounded px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="TO_READ">À lire</option>
                  <option value="READING">En cours</option>
                  <option value="READ">Lu</option>
                </select>
              </div>
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-5 py-2 text-[0.65rem] font-medium hover:bg-primary/90 whitespace-nowrap"
              >
                + Ajouter à ma bibliothèque
              </Link>
            </div>
          )}
        </div>

        {/* Colonne droite : infos livre */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Tag genre */}
          <div>
            <span className="text-xs font-medium rounded-md px-3 py-1 bg-[#E2725B] text-white">
              {book.genre}
            </span>
          </div>

          {/* Titre */}
          <h1 className="text-3xl font-bold leading-snug">{book.title}</h1>

          {/* Auteur — lien vers les livres de cet auteur */}
          <Link
            href={`/search?q=${encodeURIComponent(book.author)}`}
            className="text-base text-primary hover:underline w-fit"
          >
            {book.author}
          </Link>

          {/* Métadonnées */}
          <div className="flex flex-col gap-0.5">
            <p className="text-sm text-muted-foreground">
              {book.pageCount && <span>{book.pageCount} pages</span>}
              {book.pageCount && book.publishedYear && <span> | </span>}
              {book.publishedYear && <span>Publié en {book.publishedYear}</span>}
              {book.publishedYear && book.language && <span> | </span>}
              {book.language && <strong className="font-semibold text-foreground">{book.language}</strong>}
              {book.language && book.publisher && <span> | </span>}
              {book.publisher && <span>{book.publisher}</span>}
            </p>
            {book.isbn && (
              <p className="text-sm text-muted-foreground">ISBN : {book.isbn}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 mt-2">
            <h2 className="text-base font-semibold">Description</h2>
            <p className="text-sm leading-relaxed">{book.description}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
