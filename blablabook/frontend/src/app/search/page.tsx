import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {q ? (
        <>
          <h1 className="text-2xl font-bold mb-1">
            Résultats de recherche pour &quot;{q}&quot;
          </h1>
          {/* TODO: remplacer par le vrai count depuis l'API */}
          <p className="text-sm text-muted-foreground mb-8">0 Résultats</p>

          {/* TODO: remplacer par les vrais résultats GET /books/search?q=... */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* placeholder */}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground">
            Utilisez la barre de recherche pour trouver un livre.
          </p>
        </div>
      )}
    </div>
  );
}
