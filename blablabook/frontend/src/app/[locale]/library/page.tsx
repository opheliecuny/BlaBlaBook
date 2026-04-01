"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ArrowDownAZ, ArrowUpDown, Bookmark, BookOpen, Check, Library, Plus, Trash2, Search, X } from "lucide-react";
import BookCover from "@/components/BookCover";
import { getLibrary, updateReadingStatus, deleteBookFromLibrary } from "@/services/libraryService";
import type { ReadingStatus } from "@/types/library";
import { useAuth } from "@/contexts/AuthContext";
import { useLibraryStatus } from "@/contexts/LibraryStatusContext";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface DisplayBook {
  bookId: string;
  title: string;
  author: string;
  cover: string;
  status: ReadingStatus;
  openLibraryId: string;
}

export default function LibraryPage() {
  const t = useTranslations("library");
  const router = useRouter();
  const ITEMS_PER_PAGE = 16;

  const [activeFilter, setActiveFilter] = useState<"ALL" | ReadingStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "title" | "author">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState<DisplayBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated, isLoading: authLoading, authError, retryAuth, user } = useAuth();
  const { removeLocal } = useLibraryStatus();

  useEffect(() => {
    if (authLoading) return;
    if (authError === "network") return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    getLibrary()
      .then((items) => {
        const mapped = items.map((item) => ({
          bookId: item.id,
          title: item.title,
          author: item.author ?? t("authorUnknown"),
          cover: item.thumbnail ?? "/default-cover.png",
          status: item.status,
          openLibraryId: item.openLibraryId,
        }));
        setBooks(mapped);

        // Toast de bienvenue après connexion
        if (sessionStorage.getItem("just_logged_in")) {
          sessionStorage.removeItem("just_logged_in");
          const count = mapped.length;
          toast.success(
            t("welcomeToast", {
              username: user?.username ?? "",
              count,
              plural: count > 1 ? "s" : ""
            }),
            { position: "bottom-right" },
          );
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [authLoading, isAuthenticated, authError, router, t]);

  const stats = useMemo(() => ({
    toRead: books.filter((b) => b.status === "TO_READ").length,
    reading: books.filter((b) => b.status === "READING").length,
    read: books.filter((b) => b.status === "READ").length,
    total: books.length,
  }), [books]);

  if (authLoading) return null;

  if (authError === "network") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-sm">{t("authError")}</p>
        <Button variant="outline" onClick={retryAuth}>{t("retry")}</Button>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground text-sm">{t("loading")}</p>
      </div>
    );
  }

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredBooks = books
    .filter((b) => {
      const matchesFilter = activeFilter === "ALL" || b.status === activeFilter;
      const matchesSearch =
        !normalizedQuery ||
        b.title.toLowerCase().includes(normalizedQuery) ||
        b.author.toLowerCase().includes(normalizedQuery);
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "createdAt") return 0; // conserve l'ordre du backend (createdAt desc)
      const dir = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "title") return dir * a.title.localeCompare(b.title, "fr");
      return dir * a.author.localeCompare(b.author, "fr");
    });

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function handleFilterChange(filter: "ALL" | ReadingStatus) {
    setActiveFilter(filter);
    setCurrentPage(1);
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  const handleStatusChange = async (bookId: string, newStatus: ReadingStatus) => {
    const previous = books;
    setBooks((prev) => prev.map((book) =>
      book.bookId === bookId ? { ...book, status: newStatus } : book
    ));
    try {
      await updateReadingStatus(bookId, { status: newStatus });
      toast.success(t("statusUpdated"), { position: "bottom-right" });
    } catch {
      setBooks(previous);
      toast.error(t("statusError"), { position: "bottom-right" });
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    const previous = books;
    const deleted = books.find((b) => b.bookId === bookId);
    setBooks((prev) => prev.filter((book) => book.bookId !== bookId));
    try {
      await deleteBookFromLibrary(bookId);
      if (deleted?.openLibraryId) removeLocal(deleted.openLibraryId);
      toast.success(t("deleteSuccess", { title: deleted?.title ?? t("unknownTitle")}), { position: "bottom-right" });
    } catch {
      setBooks(previous);
      toast.error(t("deleteError"), { position: "bottom-right" });
    }
  };

  const STATUS_LABELS: Record<ReadingStatus, string> = {
    TO_READ: t("status.TO_READ"),
    READING: t("status.READING"),
    READ: t("status.READ"),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("greeting", {
              username: user?.username ?? "",
              count: stats.total,
              plural: stats.total > 1 ? "s" : ""
            })}
          </p>
        </div>
        <Link href="/search">
          <Button className="gap-2 shadow-sm">
            <Plus size={18} aria-hidden="true" />
            {t("addBook")}
          </Button>
        </Link>
      </div>

      {books.length === 0 ? (
        <OnboardingEmpty />
      ) : (
      <>

      {/* Stats Cards */}
      <div role="group" aria-label="Statistiques de lecture" className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard icon={<Bookmark className="text-amber-500" size={18} aria-hidden="true" />} label={t("stats.toRead")} count={stats.toRead} />
        <StatCard icon={<BookOpen className="text-blue-500" size={18} aria-hidden="true" />} label={t("stats.reading")} count={stats.reading} />
        <StatCard icon={<Check className="text-emerald-500" size={18} aria-hidden="true" />} label={t("stats.read")} count={stats.read} />
      </div>

      {/* Barre de recherche + Tri */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Rechercher par titre ou auteur…"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 pr-9"
            aria-label="Rechercher dans ma bibliothèque"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Effacer la recherche"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-muted-foreground shrink-0" aria-hidden="true" />
          <Select
            value={sortBy}
            onValueChange={(value) => {
              if (!value) return;
              setSortBy(value as "createdAt" | "title" | "author");
              setSortOrder(value === "createdAt" ? "desc" : "asc");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[170px] h-9 text-xs">
              <SelectValue>
                {sortBy === "createdAt" && "Date d\u2019ajout"}
                {sortBy === "title" && "Titre A → Z"}
                {sortBy === "author" && "Auteur A → Z"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date d&apos;ajout</SelectItem>
              <SelectItem value="title">Titre A → Z</SelectItem>
              <SelectItem value="author">Auteur A → Z</SelectItem>
            </SelectContent>
          </Select>
          {sortBy !== "createdAt" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-2"
              onClick={() => {
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                setCurrentPage(1);
              }}
              aria-label={sortOrder === "asc" ? "Trier en ordre décroissant" : "Trier en ordre croissant"}
            >
              <ArrowDownAZ size={16} className={sortOrder === "desc" ? "scale-y-[-1]" : ""} aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        <Button variant={activeFilter === "ALL" ? "default" : "secondary"} onClick={() => handleFilterChange("ALL")} className="h-9 rounded-full px-5 min-w-max">
          {t("filters.all", { count: stats.total })}
        </Button>
        <Button variant={activeFilter === "TO_READ" ? "default" : "secondary"} onClick={() => handleFilterChange("TO_READ")} className="h-9 rounded-full px-5 min-w-max">
          {t("filters.toRead", { count: stats.toRead })}
        </Button>
        <Button variant={activeFilter === "READING" ? "default" : "secondary"} onClick={() => handleFilterChange("READING")} className="h-9 rounded-full px-5 min-w-max">
          {t("filters.reading", { count: stats.reading })}
        </Button>
        <Button variant={activeFilter === "READ" ? "default" : "secondary"} onClick={() => handleFilterChange("READ")} className="h-9 rounded-full px-5 min-w-max">
          {t("filters.read", { count: stats.read })}
        </Button>
      </div>

      {/* Grille livres */}
      {filteredBooks.length === 0 ? (
        <EmptyState hasBooks={books.length > 0} />
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-4 divide-y divide-border/50 [&>*]:border-r [&>*]:border-border/50 [&>*:nth-child(2n)]:border-r-0 md:[&>*:nth-child(2n)]:border-r md:[&>*:nth-child(4n)]:border-r-0">
          {paginatedBooks.map((book) => (
            <li key={book.bookId} className="flex flex-col px-4 py-6 sm:px-8 sm:py-12">
              <div className="relative mb-3">
                <BookCover
                  src={book.cover}
                  alt={`Couverture du livre ${book.title}`}
                  className="w-full aspect-[2/3] object-cover rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                />
                <AlertDialog>
                  <AlertDialogTrigger
                    className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-700 shadow-sm"
                    aria-label={t("actions.delete", { title: book.title })}
                  >
                    <Trash2 className="h-4 w-4 text-gray-600 dark:text-gray-200" aria-hidden="true" />
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t("delete.title")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("delete.description", { title: book.title })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {t("delete.cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteBook(book.bookId)}
                      >
                        {t("delete.confirm")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <h3 className="font-bold text-sm leading-snug font-playfair mt-3">{book.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">{book.author}</p>

              <div className="mt-auto space-y-3">
                <Select value={book.status} onValueChange={(value) => handleStatusChange(book.bookId, value as ReadingStatus)}>
                  <label htmlFor={`status-${book.bookId}`} className="sr-only">
                    {t("status.[status]")}
                  </label>
                  <SelectTrigger className="bg-background w-full">
                    <SelectValue>{STATUS_LABELS[book.status]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TO_READ">{t("status.TO_READ")}</SelectItem>
                    <SelectItem value="READING">{t("status.READING")}</SelectItem>
                    <SelectItem value="READ">{t("status.READ")}</SelectItem>
                  </SelectContent>
                </Select>

                <Link href={`/book/${book.openLibraryId}`}>
                  <Button className="w-full active:scale-95 active:bg-gray-100 transition-all hover:bg-[#D1D5DB] dark:bg-gray-800 dark:hover:bg-gray-700" variant="secondary" aria-label={t("actions.view")}>
                    {t("actions.view")}
                  </Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="pagination" className="flex items-center justify-center gap-6 mt-12 px-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-2 border border-primary rounded px-4 h-8 text-xs font-medium hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg width="10" height="13" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
              <polyline points="6,1 1,5 6,9" />
              <line x1="1" y1="5" x2="11" y2="5" />
            </svg>
            <span className="text-foreground">Précédent</span>
          </button>

          <span className="text-xs text-muted-foreground">
            Page {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-2 border border-primary rounded px-4 h-8 text-xs font-medium hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="text-foreground">Suivant</span>
            <svg width="10" height="13" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
              <polyline points="6,1 11,5 6,9" />
              <line x1="11" y1="5" x2="1" y2="5" />
            </svg>
          </button>
        </nav>
      )}

      </>
      )}
    </div>
  );
}

// OnboardingEmpty — écran illustré quand la bibliothèque est vide
function OnboardingEmpty() {
  const t = useTranslations("library");
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
        <Library className="h-12 w-12 text-primary" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{t("onboardingTitle")}</h2>
      <p className="text-muted-foreground max-w-md mb-8 text-sm leading-relaxed">
        {t("onboardingDescription")}
      </p>
      <Link href="/search">
        <Button className="gap-2 shadow-sm" size="lg">
          <Search className="h-4 w-4" aria-hidden="true" />
          {t("onboardingCta")}
        </Button>
      </Link>
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
    <div className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col dark:bg-gray-900 dark:border-gray-700">
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
function EmptyState({ hasBooks }: { hasBooks: boolean }) {
  const t = useTranslations("library");
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 text-center">
      <Search className="text-muted-foreground mb-4 h-10 w-10 opacity-20" aria-hidden="true" />
      {hasBooks ? (
        <p className="text-muted-foreground font-medium">{t("emptySearch")}</p>
      ) : (
        <>
          <p className="text-muted-foreground font-medium">{t("empty")}</p>
          <Link href="/search" className="mt-4">
            <Button variant="outline" size="sm">{t("explore")}</Button>
          </Link>
        </>
      )}
    </div>
  );
}