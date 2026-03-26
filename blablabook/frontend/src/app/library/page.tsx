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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
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
  openLibraryId: string;
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
            bookId: item.id,
            title: item.title,
            author: item.author ?? "Auteur inconnu",
            cover: item.thumbnail ?? "/default-cover.png",
            status: item.status,
            openLibraryId: item.openLibraryId,
          }))
        );
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [authLoading, isAuthenticated, router]);

  const stats = useMemo(() => ({
    toRead: books.filter((b) => b.status === "TO_READ").length,
    reading: books.filter((b) => b.status === "READING").length,
    read: books.filter((b) => b.status === "READ").length,
    total: books.length,
  }), [books]);

  if (authLoading || !isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground text-sm">Chargement...</p>
      </div>
    );
  }

  const filteredBooks = activeFilter === "ALL" ? books : books.filter((b) => b.status === activeFilter);

  const handleStatusChange = async (bookId: string, newStatus: ReadingStatus) => {
    const previous = books;
    setBooks((prev) => prev.map((book) =>
      book.bookId === bookId ? { ...book, status: newStatus } : book
    ));
    try {
      await updateReadingStatus(bookId, { status: newStatus });
    } catch {
      setBooks(previous);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    const previous = books;
    setBooks((prev) => prev.filter((book) => book.bookId !== bookId));
    try {
      await deleteBookFromLibrary(bookId);
    } catch {
      setBooks(previous);
    }
  };

  const STATUS_LABELS: Record<ReadingStatus, string> = {
    TO_READ: "À lire",
    READING: "En cours",
    READ: "Lu",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ma bibliothèque</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Bonjour {user?.username} — {stats.total} livre{stats.total > 1 ? "s" : ""} dans votre bibliothèque
          </p>
        </div>
        <Link href="/search">
          <Button className="gap-2 shadow-sm">
            <Plus size={18} aria-hidden="true" />
            Ajouter un livre
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div role="group" aria-label="Statistiques de lecture" className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard icon={<Bookmark className="text-amber-500" size={18} aria-hidden="true" />} label="À lire" count={stats.toRead} />
        <StatCard icon={<BookOpen className="text-blue-500" size={18} aria-hidden="true" />} label="En cours" count={stats.reading} />
        <StatCard icon={<Check className="text-emerald-500" size={18} aria-hidden="true" />} label="Lus" count={stats.read} />
      </div>

      {/* Filtres */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        <Button variant={activeFilter === "ALL" ? "default" : "secondary"} onClick={() => setActiveFilter("ALL")} className="h-9 rounded-full px-5 min-w-max">
          Tous ({stats.total})
        </Button>
        <Button variant={activeFilter === "TO_READ" ? "default" : "secondary"} onClick={() => setActiveFilter("TO_READ")} className="h-9 rounded-full px-5 min-w-max">
          À lire ({stats.toRead})
        </Button>
        <Button variant={activeFilter === "READING" ? "default" : "secondary"} onClick={() => setActiveFilter("READING")} className="h-9 rounded-full px-5 min-w-max">
          En cours ({stats.reading})
        </Button>
        <Button variant={activeFilter === "READ" ? "default" : "secondary"} onClick={() => setActiveFilter("READ")} className="h-9 rounded-full px-5 min-w-max">
          Lus ({stats.read})
        </Button>
      </div>

      {/* Grille livres */}
      {filteredBooks.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 divide-x divide-gray-200/50 -mx-4">
          {filteredBooks.map((book) => (
            <li
              key={book.bookId}
              className={`
        flex flex-col px-4 py-6 bg-background
        border-b border-gray-200/50

        [&:nth-last-child(-n+2)]:border-b-0
        lg:[&:nth-last-child(-n+3)]:border-b-0
        xl:[&:nth-last-child(-n+4)]:border-b-0
      `}
            >
              <div className="group relative mb-3 h-64 sm:h-80 md:h-96 lg:h-[420px] xl:h-[480px] overflow-hidden rounded-lg">
                <Image
                  src={book.cover}
                  alt={`Couverture du livre ${book.title}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
                <AlertDialog>
                  <AlertDialogTrigger
                    className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm"
                    aria-label={`Supprimer ${book.title}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Supprimer ce livre ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Le livre &quot;{book.title}&quot; sera supprimé définitivement de votre bibliothèque.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteBook(book.bookId)}
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <h3 className="line-clamp-1 text-sm sm:text-base lg:text-lg font-bold">{book.title}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{book.author}</p>

              <div className="mt-auto space-y-3">
                <Select value={book.status} onValueChange={(value) => handleStatusChange(book.bookId, value as ReadingStatus)}>
                  {/* Label uniquement pour les lecteurs d'écran */}
                  <label htmlFor={`status-${book.bookId}`} className="sr-only">
                    Statut de lecture pour {book.title}
                  </label>
                  <SelectTrigger className="bg-background w-full">
                    <SelectValue>{STATUS_LABELS[book.status]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TO_READ">À lire</SelectItem>
                    <SelectItem value="READING">En cours</SelectItem>
                    <SelectItem value="READ">Lu</SelectItem>
                  </SelectContent>
                </Select>

                <Link href={`/book/${book.openLibraryId}`}>
                  <Button className="w-full active:scale-95 active:bg-gray-100 transition-all hover:bg-[#D1D5DB]" variant="secondary" aria-label={`Voir le détail de ${book.title}`}>
                    Voir le détail
                  </Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// StatCard
function StatCard({ icon, label, count }: {
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col">
      <div className="self-start" aria-hidden="true">
        {icon}
      </div>
      <dl className="flex flex-col items-center justify-center text-center mt-1">
        <dd className="text-2xl font-bold">{count}</dd>
        <dt className="text-muted-foreground text-sm">{label}</dt>
      </dl>
    </div>
  );
}

// EmptyState
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 text-center">
      <Search className="text-muted-foreground mb-4 h-10 w-10 opacity-20" aria-hidden="true" />
      <p className="text-muted-foreground font-medium">Aucun livre trouvé dans cette catégorie.</p>
      <Link href="/search" className="mt-4">
        <Button variant="outline" size="sm">Explorer le catalogue</Button>
      </Link>
    </div>
  );
}