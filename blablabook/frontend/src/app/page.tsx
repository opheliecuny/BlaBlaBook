import Image from "next/image";
import Link from "next/link";
import { Bookmark } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-[88%] mx-auto px-12 py-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <span className="text-xs font-semibold rounded px-2 py-1 mb-4 inline-flex items-center gap-1.5 tag-terracotta-filled" style={{ color: "#E8927A" }}>
            <Bookmark size={11} aria-hidden="true" />
            Votre bibliothèque personnelle
          </span>
          <h1 className="text-5xl font-normal mt-3 mb-4">BlaBlaBook</h1>
          <p className="max-w-md mb-8 font-medium normal-case font-lora leading-tight text-justify text-[0.9375rem]">
            Une façon simple et agréable de ne plus jamais perdre le fil de vos lectures.
            <br />
            Notre application vous permet d&apos;organiser facilement votre
            bibliothèque personnelle : ajoutez vos ouvrages, suivez vos lectures
            et retrouvez en un instant les livres que vous aimez.
          </p>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md bg-muted border border-[#9CA3AF] px-4 h-9 text-sm font-semibold text-foreground hover:bg-muted/70"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-[#E2725B] hover:bg-[#c85e48] px-4 h-9 text-sm font-semibold text-white"
            >
              Créer un compte
            </Link>
          </div>
        </div>
        <div className="flex-1 relative self-stretch min-h-[220px] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
          <Image
            src="/book-pile.jpg"
            alt="Pile de livres"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Livres du moment */}
      <section className="pt-4 pb-8">
        <div className="max-w-[88%] mx-auto px-12 mb-0">
          <h2 className="text-2xl font-bold mb-1">LIVRES DU MOMENT</h2>
          <p className="text-xs text-muted-foreground tracking-widest">
            SÉLECTION ALÉATOIRE
          </p>
        </div>
        {/* TODO: remplacer par les vrais livres depuis l'API */}
        <div className="max-w-[88%] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col p-12">
                <Image
                  src="/default-cover.png"
                  alt="Couverture non disponible"
                  width={200}
                  height={300}
                  className="w-full aspect-[2/3] object-cover rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                />
                <div className="flex flex-col flex-1 mt-3">
                  <p className="font-bold text-base leading-snug font-playfair">Titre du livre</p>
                  <p className="text-xs text-muted-foreground mt-1">Auteur</p>
                  <div className="mt-auto pt-4 flex flex-col gap-2">
                    <span className="text-xs border rounded px-2 py-0.5 w-fit tag-terracotta">
                      Genre
                    </span>
                    <Link
                      href="#"
                      className="inline-flex items-center justify-center rounded-md bg-[#E5E7EB] px-3 py-1.5 text-xs font-medium hover:bg-[#D1D5DB] w-full"
                    >
                      Voir le détail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Recherche */}
      <section className="max-w-[88%] mx-auto px-12 py-8">
        <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl p-12 flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-center">
            Vous cherchez un livre en particulier ?
          </h2>
          <form action="/search" className="flex gap-2 w-full max-w-md">
            <label htmlFor="search" className="sr-only">
              Rechercher un livre ou un auteur
            </label>
            <input
              id="search"
              name="q"
              type="text"
              placeholder="Rechercher un livre, un auteur,..."
              className="flex-1 border border-border rounded-full px-4 h-10 text-sm outline-none focus:border-primary bg-white"
            />
            <button
              type="submit"
              className="h-10 rounded-full bg-[#E2725B] hover:bg-[#c85e48] text-white text-sm font-semibold px-8 shrink-0"
            >
              Rechercher
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
