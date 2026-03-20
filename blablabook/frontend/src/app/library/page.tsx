"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bookmark, BookOpen, Check, Plus, Trash2, Search } from "lucide-react";
import { getLibrary, updateReadingStatus, deleteBookFromLibrary } from "@/services/libraryService";
import type { ReadingStatus } from "@/types/library";
import { useAuth } from "@/contexts/AuthContext";

interface DisplayBook {
  bookId: string;
  title: string;
  author: string;
  cover: string;
  status: ReadingStatus;
}

export default function LibraryPage() {
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState<"ALL" | ReadingStatus>("ALL");
  const [books, setBooks] = useState<DisplayBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    getLibrary()
      .then((items) => {
        setBooks(
          items.map((item) => ({
            bookId: item.bookId,
            title: item.book.title,
            author: item.book.author ?? "Auteur inconnu",
            cover: item.book.thumbnail ?? "/default-cover.png",
            status: item.status,
          }))
        );
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isAuthenticated, authLoading, router]);

  // Calcul des statistiques
  const stats = useMemo(
    () => ({
      toRead: books.filter((b) => b.status === "TO_READ").length,
      reading: books.filter((b) => b.status === "READING").length,
      read: books.filter((b) => b.status === "READ").length,
      total: books.length,
    }),
    [books],
  );

  if (authLoading || !isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground text-sm">Chargement...</p>
      </div>
    );
  }

  // Filtrage des livres
  const filteredBooks =
    activeFilter === "ALL"
      ? books
      : books.filter((b) => b.status === activeFilter);

  const handleStatusChange = async (bookId: string, newStatus: ReadingStatus) => {
    const previous = books;
    setBooks((prev) =>
      prev.map((book) =>
        book.bookId === bookId ? { ...book, status: newStatus } : book,
      ),
    );
    try {
      await updateReadingStatus(bookId, { status: newStatus });
    } catch {
      setBooks(previous);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce livre de votre bibliothèque ?")) {
      const previous = books;
      setBooks((prev) => prev.filter((book) => book.bookId !== bookId));
      try {
        await deleteBookFromLibrary(bookId);
      } catch {
        setBooks(previous);
      }
    }
  };

  // Définir le mapping des statuts pour l'affichage en français
  const STATUS_LABELS: Record<ReadingStatus, string> = {
    TO_READ: "À lire",
    READING: "En cours",
    READ: "Lu",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ma bibliothèque</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Bonjour {user?.username} — {stats.total} livre{stats.total > 1 ? "s" : ""} dans
            votre bibliothèque
          </p>
        </div>
        <Link href="/search">
          <Button className="gap-2 shadow-sm">
            <Plus size={18} />
            Ajouter un livre
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Bookmark className="text-amber-500" size={20} />}
          label="À lire"
          count={stats.toRead}
        />
        <StatCard
          icon={<BookOpen className="text-blue-500" size={20} />}
          label="En cours"
          count={stats.reading}
        />
        <StatCard
          icon={<Check className="text-emerald-500" size={20} />}
          label="Lus"
          count={stats.read}
        />
      </div>

      {/* Filtres */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Button
          variant={activeFilter === "ALL" ? "default" : "secondary"}
          onClick={() => setActiveFilter("ALL")}
          className="h-9 rounded-full px-5"
        >
          Tous
        </Button>
        <Button
          variant={activeFilter === "TO_READ" ? "default" : "secondary"}
          onClick={() => setActiveFilter("TO_READ")}
          className="h-9 rounded-full px-5"
        >
          À lire
        </Button>
        <Button
          variant={activeFilter === "READING" ? "default" : "secondary"}
          onClick={() => setActiveFilter("READING")}
          className="h-9 rounded-full px-5"
        >
          En cours
        </Button>
        <Button
          variant={activeFilter === "READ" ? "default" : "secondary"}
          onClick={() => setActiveFilter("READ")}
          className="h-9 rounded-full px-5"
        >
          Lus
        </Button>
      </div>

      {/* Grille de livres */}
      {filteredBooks.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book) => (
            <div
              key={book.bookId}
              className="bg-card group flex flex-col rounded-xl border p-2 shadow-sm transition-all hover:shadow-md"
            >
              {/* Couverture avec bouton de suppression */}
              <div className="relative mb-4 h-80 overflow-hidden rounded-lg">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill={true}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
                {/* Bouton de suppression */}
                <Button
                  variant="destructive"
                  size="icon"
                  className="text-destructive hover:bg-accent absolute top-2 right-2 h-8 w-8 rounded-full border-none bg-white shadow-sm"
                  onClick={() => handleDeleteBook(book.bookId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Titre et auteur */}
              <h3 className="line-clamp-1 text-lg font-bold">{book.title}</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {book.author}
              </p>

              {/* Zone d'actions */}
              <div className="mt-auto space-y-3">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground px-1 text-[12px] font-bold tracking-wider">
                    Changer le statut
                  </label>
                  <Select
                    value={book.status}
                    onValueChange={(value) =>
                      handleStatusChange(book.bookId, value as ReadingStatus)
                    }
                  >
                    <SelectTrigger className="bg-background w-full">
                      <SelectValue>{STATUS_LABELS[book.status]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TO_READ">À lire</SelectItem>
                      <SelectItem value="READING">En cours</SelectItem>
                      <SelectItem value="READ">Lu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Link href={`/book/${book.bookId}`} className="mt-4 block">
                  <Button
                    variant="secondary"
                    className="hover:bg-accent w-full"
                  >
                    Voir le détail
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Sous-composant StatCard
function StatCard({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <div className="bg-card flex items-center gap-4 rounded-xl border p-4 shadow-sm">
      <div className="bg-background rounded-full p-2.5 shadow-sm">{icon}</div>
      <div>
        <p className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
          {label}
        </p>
        <p className="text-xl font-bold">
          {count}{" "}
          <span className="text-muted-foreground text-sm font-normal">
            livre{count > 1 ? "s" : ""}
          </span>
        </p>
      </div>
    </div>
  );
}

// Sous-composant EmptyState
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 text-center">
      <Search className="text-muted-foreground mb-4 h-10 w-10 opacity-20" />
      <p className="text-muted-foreground font-medium">
        Aucun livre trouvé dans cette catégorie.
      </p>
      <Link href="/search" className="mt-4">
        <Button variant="outline" size="sm">
          Explorer le catalogue
        </Button>
      </Link>
    </div>
  );
}
