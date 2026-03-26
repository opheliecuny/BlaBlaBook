import Image from "next/image";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import BookCover from "@/components/BookCover";

interface RandomBook {
  id: string;
  title: string;
  author: string | null;
  coverThumbnail: string | null;
}

async function fetchRandomBooks(): Promise<RandomBook[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/books`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const randomBooks = await fetchRandomBooks();

  return (
    <div>
      {/* Hero */}
      <section className="relative sm:max-w-7xl  mx-auto px-6 sm:px-12 py-10 flex flex-col sm:flex-row items-center gap-12 overflow-hidden">
        <div className="flex-1 relative z-10 bg-white/60 backdrop-blur-sm sm:bg-transparent p-6 sm:px-0 rounded-xl mt-6 sm:mt-0 max-w-[83%]">
          <span className="hidden sm:inline-flex text-xs font-semibold rounded px-2 py-1 mb-4 items-center gap-1.5 tag-terracotta-filled" style={{ color: "#E8927A" }}>
            <Bookmark size={11} aria-hidden="true" />
            Votre bibliothèque personnelle
          </span>
          <h1 className="text-4xl sm:text-5xl font-normal mt-3 mb-4 text-shadow-xs text-center sm:text-left">BlaBlaBook</h1>
          <p className="max-w-md mb-8 mt-8 normal-case font-inter leading-tight text-center sm:text-justify text-[0.9375rem] drop-shadow-[0_1px_2px_rgba(30,64,175,0.25)] sm:drop-shadow-none">
            Une façon simple et agréable de ne plus jamais perdre le fil de vos lectures.
            <br />
            Notre application vous permet d&apos;organiser facilement votre
            bibliothèque personnelle : ajoutez vos ouvrages, suivez vos lectures
            et retrouvez en un instant les livres que vous aimez.
          </p>
          <div className="flex gap-2 sm:gap-3 justify-around sm:justify-start">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md bg-muted border border-[var(--accent-alt)] sm:border-input p-2 h-auto text-sm font-semibold text-[var(--accent-alt)] sm:text-foreground hover:bg-muted/70 text-center"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-[var(--accent-alt)] hover:bg-[var(--accent-alt-hover)] p-2 h-auto text-sm font-semibold text-white text-center"
            >
              Créer un compte
            </Link>
          </div>
        </div>
        <div className="mx-6 sm:mx-0 mt-6 sm:mt-0 absolute inset-0 sm:relative sm:flex-1 self-stretch min-h-[220px] rounded-xl overflow-hidden sm:shadow-[0_4px_20px_rgba(0,0,0,0.25)] z-0">
          <Image
            src="/book-pile.jpg"
            alt="Pile de livres"
            fill
            className="object-cover sm:opacity-100"
          />
        </div>
      </section>

      {/* Livres du moment */}
      <section aria-labelledby="livres-du-moment" className="py-8 sm:max-w-7xl mx-auto px-5 sm:px-10">
        <div className="px-2 mb-8 sm:mb-0 mt-8 sm:mt-0">
          <h2 id="livres-du-moment" className="text-2xl font-bold mb-1 text-center sm:text-left">LIVRES DU MOMENT</h2>
          <p className="text-xs text-muted-foreground tracking-widest text-center sm:text-left">
            SÉLECTION ALÉATOIRE
          </p>
        </div>
        <div className="mx-auto">
          <ul className="grid grid-cols-2 md:grid-cols-4">
            {randomBooks.length > 0 ? randomBooks.map((book, i) => {
              const bookId = book.id?.split("/").pop() ?? null;
              return (
                <li key={i} className="flex flex-col p-3 sm:p-8">
                  <BookCover
                    src={book.coverThumbnail}
                    alt={`Couverture de ${book.title}`}
                    className="w-full aspect-[2/3] object-cover rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                  />
                  <div className="flex flex-col flex-1 mt-3">
                    <h3 className="font-bold text-base leading-snug font-playfair">{book.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{book.author ?? "Auteur inconnu"}</p>
                    <div className="mt-auto pt-4">
                      <Link
                        href={bookId ? `/book/${bookId}` : `/search?q=${encodeURIComponent(book.title)}`}
                        className="inline-flex items-center justify-center rounded-md bg-[#E5E7EB] px-3 py-1.5 text-xs font-medium hover:bg-[#D1D5DB] w-full"
                        aria-label={`Voir le détail du livre ${book.title}`}
                      >
                        Voir le détail
                      </Link>
                    </div>
                  </div>
                </li>
              );
            }) : [1, 2, 3, 4].map((i) => (
              <li key={i} className="flex flex-col p-12">
                <BookCover
                  src={null}
                  alt="Couverture non disponible"
                  className="w-full aspect-[2/3] object-cover rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                />
                <div className="flex flex-col flex-1 mt-3">
                  <h3 className="font-bold text-base leading-snug font-playfair">Titre du livre</h3>
                  <p className="text-xs text-muted-foreground mt-1">Auteur</p>
                  <div className="mt-auto pt-4">
                    <Link
                      href="/search"
                      className="inline-flex items-center justify-center rounded-md bg-[#E5E7EB] px-3 py-1.5 text-xs font-medium hover:bg-[#D1D5DB] w-full"
                      aria-label="Voir le détail du livre"
                    >
                      Voir le détail
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA Recherche */}
      <section className="sm:max-w-7xl mx-auto px-6 sm:px-12 py-8">
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-12 flex flex-col items-center gap-6 w-full">
          <h2 className="text-2xl font-bold text-center">
            Vous cherchez un livre en particulier ?
          </h2>
          <form role="search" action="/search" className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
            <label htmlFor="search" className="sr-only">
              Rechercher un livre ou un auteur
            </label>
            <input
              id="search"
              name="q"
              type="text"
              placeholder="Rechercher un livre, un auteur,..."
              className="w-full sm:flex-1 border border-border rounded-full px-4 h-10 text-sm outline-none focus:border-primary bg-white"
              autoComplete="off"
            />
            <button
              type="submit"
              className="h-10 rounded-full bg-[var(--accent-alt)] hover:bg-[var(--accent-alt-hover)] text-white text-sm font-semibold px-8 w-full sm:w-auto"
            >
              Rechercher
            </button>
          </form>
        </div>
      </section >
    </div >
  );
}
