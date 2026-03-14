import { Button } from "@/components/ui/button";
import { Bookmark, BookOpen, Check } from "lucide-react";
import Link from "next/link";

export default function LibraryPage() {
  // TODO: protéger cette route (redirection /login si non connecté)
  // TODO: remplacer par les vraies données GET /library

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-1">Ma bibliothèque</h1>
      <p className="text-muted-foreground mb-8">
        Gérez votre collection personnelle et vos lectures.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-border rounded-lg p-4 flex items-center gap-3">
          <Bookmark size={20} className="text-orange-400" />
          <div>
            <p className="text-sm text-muted-foreground">À lire</p>
            <p className="text-xl font-bold">0 <span className="text-sm font-normal text-muted-foreground">livres</span></p>
          </div>
        </div>
        <div className="border border-border rounded-lg p-4 flex items-center gap-3">
          <BookOpen size={20} className="text-orange-500" />
          <div>
            <p className="text-sm text-muted-foreground">En cours</p>
            <p className="text-xl font-bold">0 <span className="text-sm font-normal text-muted-foreground">livres</span></p>
          </div>
        </div>
        <div className="border border-border rounded-lg p-4 flex items-center gap-3">
          <Check size={20} className="text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Lus</p>
            <p className="text-xl font-bold">0 <span className="text-sm font-normal text-muted-foreground">livres</span></p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-8">
        {["Tous", "À lire", "En cours", "Lus"].map((filter) => (
          <button
            key={filter}
            className="text-sm px-4 py-1.5 rounded-full border border-border hover:bg-muted first:bg-primary first:text-primary-foreground first:border-primary"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grille livres */}
      {/* TODO: remplacer par les vrais livres */}
      <div className="text-center py-16 text-muted-foreground">
        <p>Votre bibliothèque est vide.</p>
        <Link
          href="/search"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-2.5 h-8 text-sm font-medium text-primary-foreground"
        >
          Rechercher un livre
        </Link>
      </div>
    </div>
  );
}
