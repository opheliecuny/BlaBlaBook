"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // TODO: remplacer par le vrai état auth (AuthContext)
  const isLoggedIn = false;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl shrink-0">
          BlaBlaBook
        </Link>

        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un livre"
              className="w-full rounded-full border border-border px-4 py-1.5 pr-10 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Search size={16} />
            </button>
          </div>
        </form>

        {/* Navigation */}
        <nav className="flex items-center gap-3 shrink-0">
          <Link href="/" className="text-sm hover:text-primary">
            Accueil
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/library" className="text-sm hover:text-primary">
                Ma bibliothèque
              </Link>
              <Link href="/profile" className="text-sm hover:text-primary">
                Compte
              </Link>
              <Button variant="outline" size="sm" className="border-primary hover:bg-primary/5">
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-primary")}>
                Connexion
              </Link>
              <Link href="/register" className={cn(buttonVariants({ size: "sm" }), "shadow-[0_2px_8px_rgba(55,48,163,0.4)]")}>
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
