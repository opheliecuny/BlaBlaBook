import { Button } from "@/components/ui/button";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* TODO: remplacer par les vraies données GET /books/:id */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Couverture */}
        <div className="w-48 shrink-0">
          <div className="w-full aspect-[2/3] bg-muted rounded" />
        </div>

        {/* Infos */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Titre du livre</h1>
          <p className="text-muted-foreground">Auteur</p>
          <span className="text-xs border border-border rounded px-2 py-0.5 w-fit">
            Genre
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Description du livre...
          </p>

          {/* TODO: afficher selon l'état auth */}
          <div className="flex flex-col gap-3 mt-4">
            <select className="border border-border rounded px-3 py-2 text-sm outline-none w-fit">
              <option value="TO_READ">À lire</option>
              <option value="READING">En cours</option>
              <option value="READ">Lu</option>
            </select>
            {/* TODO: brancher sur POST /library */}
            <Button className="w-fit">Ajouter à ma bibliothèque</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
