import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <span className="text-xs rounded px-2 py-1 mb-4 inline-block tag-terracotta-filled">
            📖 Votre bibliothèque personnelle
          </span>
          <h1 className="text-5xl font-bold mt-3 mb-4">BlaBlaBook</h1>
          <p className="text-muted-foreground max-w-md mb-8">
            Une façon simple et agréable de ne plus jamais perdre le fil de vos
            lectures. Notre application vous permet d&apos;organiser facilement votre
            bibliothèque personnelle : ajoutez vos ouvrages, suivez vos lectures
            et retrouvez en un instant les livres que vous aimez.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-2.5 h-8 text-sm font-medium text-primary-foreground"
          >
            Se connecter
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-80 h-56 bg-muted rounded-lg" />
        </div>
      </section>

      {/* Livres du moment */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-1">LIVRES DU MOMENT</h2>
        <p className="text-xs text-muted-foreground mb-8 tracking-widest">
          SÉLECTION ALÉATOIRE
        </p>
        {/* TODO: remplacer par les vrais livres depuis l'API */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="w-full aspect-[2/3] bg-muted rounded" />
              <p className="font-medium text-sm">Titre du livre</p>
              <p className="text-xs text-muted-foreground">Auteur</p>
              <span className="text-xs border rounded px-2 py-0.5 w-fit tag-terracotta">
                Genre
              </span>
              <Button variant="outline" size="sm">
                Voir le détail
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Recherche */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-muted rounded-xl p-12 flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-center">
            Vous cherchez un livre en particulier ?
          </h2>
          <form action="/search" className="flex gap-2 w-full max-w-md">
            <input
              name="q"
              type="text"
              placeholder="Rechercher un livre, un auteur,..."
              className="flex-1 border border-border rounded-full px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <Button type="submit" className="rounded-full" style={{ backgroundColor: "#E2725B" }}>
              <Search size={16} className="mr-1" />
              Rechercher
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
