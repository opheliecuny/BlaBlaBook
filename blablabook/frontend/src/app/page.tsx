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
      <section className="relative mx-auto flex flex-col items-center gap-12 overflow-hidden px-6 py-10 sm:max-w-7xl sm:flex-row sm:px-12">
        <div className="bg-card/60 relative z-10 mt-6 max-w-[83%] flex-1 rounded-xl p-6 backdrop-blur-sm sm:mt-0 sm:bg-transparent sm:px-0">
          <span
            className="tag-terracotta-filled mb-4 hidden items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold sm:inline-flex"
            style={{ color: "#E8927A" }}
          >
            <Bookmark size={11} aria-hidden="true" />
            Votre bibliothèque personnelle
          </span>
          <h1 className="mt-3 mb-4 text-center text-4xl font-normal text-shadow-xs sm:text-left sm:text-5xl">
            BlaBlaBook
          </h1>
          <p className="font-inter mt-8 mb-8 max-w-md text-center text-[0.9375rem] leading-tight normal-case drop-shadow-[0_1px_2px_rgba(30,64,175,0.25)] sm:text-justify sm:drop-shadow-none">
            Une façon simple et agréable de ne plus jamais perdre le fil de vos
            lectures.
            <br />
            Notre application vous permet d&apos;organiser facilement votre
            bibliothèque personnelle : ajoutez vos ouvrages, suivez vos lectures
            et retrouvez en un instant les livres que vous aimez.
          </p>
          <div className="flex justify-around gap-2 sm:justify-start sm:gap-3">
            <Link
              href="/login"
              className="sm:border-input sm:text-foreground inline-flex h-auto items-center justify-center rounded-md border border-[var(--accent-alt)] bg-[var(--color-btn-subtle)] p-2 text-center text-sm font-semibold text-[var(--accent-alt)] hover:bg-[var(--color-btn-subtle-hover)] active:bg-[var(--color-btn-subtle-active)]"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="inline-flex h-auto items-center justify-center rounded-md bg-[var(--accent-alt)] p-2 text-center text-sm font-semibold text-white hover:bg-[var(--accent-alt-hover)]"
            >
              Créer un compte
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 z-0 mx-6 mt-6 min-h-[220px] self-stretch overflow-hidden rounded-xl sm:relative sm:mx-0 sm:mt-0 sm:flex-1 sm:shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
          <Image
            src="/book-pile.jpg"
            alt="Pile de livres"
            fill
            className="object-cover sm:opacity-100"
          />
        </div>
      </section>

      {/* Livres du moment */}
      <section
        aria-labelledby="livres-du-moment"
        className="mx-auto px-5 py-8 sm:max-w-7xl sm:px-10"
      >
        <div className="mt-8 mb-8 px-2 sm:mt-0 sm:mb-0">
          <h2
            id="livres-du-moment"
            className="mb-1 text-center text-2xl font-bold sm:text-left"
          >
            LIVRES DU MOMENT
          </h2>
          <p className="text-muted-foreground text-center text-xs tracking-widest sm:text-left">
            SÉLECTION ALÉATOIRE
          </p>
        </div>
        <div className="mx-auto">
          <ul className="grid grid-cols-2 md:grid-cols-4">
            {randomBooks.length > 0 ? (
              randomBooks.map((book, i) => {
                const bookId = book.id?.split("/").pop() ?? null;
                return (
                  <li key={i} className="flex flex-col p-3 sm:p-8">
                    <BookCover
                      src={book.coverThumbnail}
                      alt={`Couverture de ${book.title}`}
                      className="aspect-[2/3] w-full rounded-xl object-cover shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                    />
                    <div className="mt-3 flex flex-1 flex-col">
                      <h3 className="font-playfair text-base leading-snug font-bold">
                        {book.title}
                      </h3>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {book.author ?? "Auteur inconnu"}
                      </p>
                      <div className="mt-auto pt-4">
                        <Link
                          href={
                            bookId
                              ? `/book/${bookId}`
                              : `/search?q=${encodeURIComponent(book.title)}`
                          }
                          className="inline-flex w-full items-center justify-center rounded-md bg-[var(--color-btn-subtle)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--color-btn-subtle-hover)] active:bg-[var(--color-btn-subtle-active)]"
                          aria-label={`Voir le détail du livre ${book.title}`}
                        >
                          Voir le détail
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <div
                className="border-border col-span-full my-17 flex flex-col items-center rounded-xl border p-12"
                role="status"
              >
                <p className="text-muted-foreground col-span-full text-center">
                  Une erreur est survenue lors du chargement des livres.
                </p>
                <p className="text-muted-foreground col-span-full text-center">
                  Veuillez réessayer plus tard.
                </p>
              </div>
            )}
          </ul>
        </div>
      </section>

      {/* CTA Recherche */}
      <section className="mx-auto px-6 py-8 sm:max-w-7xl sm:px-12">
        <div className="bg-primary/5 border-primary/20 flex w-full flex-col items-center gap-6 rounded-xl border p-12">
          <h2 className="text-center text-2xl font-bold">
            Vous cherchez un livre en particulier ?
          </h2>
          <form
            role="search"
            action="/search"
            className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
          >
            <label htmlFor="search" className="sr-only">
              Rechercher un livre ou un auteur
            </label>
            <input
              id="search"
              name="q"
              type="text"
              placeholder="Rechercher un livre, un auteur,..."
              className="border-border focus:border-primary bg-card h-10 w-full rounded-full border px-4 text-sm outline-none sm:flex-1"
              autoComplete="off"
            />
            <button
              type="submit"
              className="h-10 w-full rounded-full bg-[var(--accent-alt)] px-8 text-sm font-semibold text-white hover:bg-[var(--accent-alt-hover)] sm:w-auto"
            >
              Rechercher
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
