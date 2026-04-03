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
import {
  Bookmark,
  BookOpen,
  Check,
  Plus,
  Trash2,
  Search,
  X,
} from "lucide-react";
import BookCover from "@/components/BookCover";
import {
  getLibrary,
  updateReadingStatus,
  deleteBookFromLibrary,
} from "@/services/libraryService";
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

  const [activeFilter, setActiveFilter] = useState<"ALL" | ReadingStatus>(
    "ALL",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState<DisplayBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    isAuthenticated,
    isLoading: authLoading,
    authError,
    user,
  } = useAuth();
  const { removeLocal } = useLibraryStatus();

  useEffect(() => {
    if (authLoading) return;
    if (authError) return;
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
            author: item.author ?? t("authorUnknown"),
            cover: item.thumbnail ?? "/default-cover.png",
            status: item.status,
            openLibraryId: item.openLibraryId,
          })),
        );
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [authLoading, isAuthenticated, authError, router, t]);

  useEffect(() => {
    // On attend que l'utilisateur soit chargé et que la bibliothèque soit récupérée
    if (!user?.username || isLoading) return;

    if (sessionStorage.getItem("just_logged_in")) {
      sessionStorage.removeItem("just_logged_in");

      toast.success(
        t("welcomeToast", {
          username: user.username,
          count: books.length,
          plural: books.length > 1 ? "s" : "",
        }),
        { position: "top-center" },
      );
    }
  }, [user?.username, books.length, isLoading, t]);

  const stats = useMemo(
    () => ({
      toRead: books.filter((b) => b.status === "TO_READ").length,
      reading: books.filter((b) => b.status === "READING").length,
      read: books.filter((b) => b.status === "READ").length,
      total: books.length,
    }),
    [books],
  );

  if (authLoading) return null;

  if (authError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-sm">{t("authError")}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          {t("retry")}
        </Button>
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

  const filteredBooks = books.filter((b) => {
    const matchesFilter = activeFilter === "ALL" || b.status === activeFilter;
    const matchesSearch =
      !normalizedQuery ||
      b.title.toLowerCase().includes(normalizedQuery) ||
      b.author.toLowerCase().includes(normalizedQuery);
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  function handleFilterChange(filter: "ALL" | ReadingStatus) {
    setActiveFilter(filter);
    setCurrentPage(1);
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  const handleStatusChange = async (
    bookId: string,
    newStatus: ReadingStatus,
  ) => {
    const previous = books;
    setBooks((prev) =>
      prev.map((book) =>
        book.bookId === bookId ? { ...book, status: newStatus } : book,
      ),
    );
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
      toast.success(
        t("deleteSuccess", { title: deleted?.title ?? t("unknownTitle") }),
        { position: "bottom-right" },
      );
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
              plural: stats.total > 1 ? "s" : "",
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

      {/* Stats Cards */}
      <div
        role="group"
        aria-label="Statistiques de lecture"
        className="mb-8 grid grid-cols-3 gap-3 sm:gap-4"
      >
        <StatCard
          icon={
            <Bookmark className="text-amber-500" size={18} aria-hidden="true" />
          }
          label={t("stats.toRead")}
          count={stats.toRead}
        />
        <StatCard
          icon={
            <BookOpen className="text-blue-500" size={18} aria-hidden="true" />
          }
          label={t("stats.reading")}
          count={stats.reading}
        />
        <StatCard
          icon={
            <Check className="text-emerald-500" size={18} aria-hidden="true" />
          }
          label={t("stats.read")}
          count={stats.read}
        />
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-6">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Rechercher par titre ou auteur…"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pr-9 pl-9"
          aria-label="Rechercher dans ma bibliothèque"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearchChange("")}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
            aria-label="Effacer la recherche"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={activeFilter === "ALL" ? "default" : "secondary"}
          onClick={() => handleFilterChange("ALL")}
          className="h-9 min-w-max rounded-full px-5"
        >
          {t("filters.all", { count: stats.total })}
        </Button>
        <Button
          variant={activeFilter === "TO_READ" ? "default" : "secondary"}
          onClick={() => handleFilterChange("TO_READ")}
          className="h-9 min-w-max rounded-full px-5"
        >
          {t("filters.toRead", { count: stats.toRead })}
        </Button>
        <Button
          variant={activeFilter === "READING" ? "default" : "secondary"}
          onClick={() => handleFilterChange("READING")}
          className="h-9 min-w-max rounded-full px-5"
        >
          {t("filters.reading", { count: stats.reading })}
        </Button>
        <Button
          variant={activeFilter === "READ" ? "default" : "secondary"}
          onClick={() => handleFilterChange("READ")}
          className="h-9 min-w-max rounded-full px-5"
        >
          {t("filters.read", { count: stats.read })}
        </Button>
      </div>

      {/* Grille livres */}
      {filteredBooks.length === 0 ? (
        <EmptyState hasBooks={books.length > 0} />
      ) : (
        <ul className="divide-border/50 border-border/50 *:border-border/50 2n:border-r-0 md:2n:border-r md:4n:border-r-0 grid grid-cols-2 divide-y *:border-r md:grid-cols-4">
          {paginatedBooks.map((book, i) => (
            <li
              key={book.bookId}
              className="flex flex-col px-4 py-6 sm:px-8 sm:py-12"
            >
              <div className="relative mb-3">
                <BookCover
                  src={book.cover}
                  alt={`Couverture du livre ${book.title}`}
                  className="aspect-2/3 w-full rounded-xl object-cover shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                  priority={i === 0}
                />
                <AlertDialog>
                  <AlertDialogTrigger
                    className="bg-card hover:bg-muted active:bg-border absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-colors dark:hover:bg-gray-700"
                    aria-label={t("actions.delete", { title: book.title })}
                  >
                    <Trash2
                      className="text-muted-foreground dark:text-secondary-foreground h-4 w-4"
                      aria-hidden="true"
                    />
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
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

              <h3 className="font-playfair mt-3 text-sm leading-snug font-bold">
                {book.title}
              </h3>
              <p className="text-muted-foreground mt-1 mb-4 text-xs">
                {book.author}
              </p>

              <div className="mt-auto space-y-3">
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
                    <SelectItem value="TO_READ">
                      {t("status.TO_READ")}
                    </SelectItem>
                    <SelectItem value="READING">
                      {t("status.READING")}
                    </SelectItem>
                    <SelectItem value="READ">{t("status.READ")}</SelectItem>
                  </SelectContent>
                </Select>

                <Link href={`/book/${book.openLibraryId}`}>
                  <Button
                    className="dark:bg-secondary w-full transition-all hover:bg-(--color-btn-subtle-hover) active:scale-95 active:bg-(--color-btn-subtle-active) dark:hover:bg-gray-700"
                    variant="secondary"
                    aria-label={t("actions.view")}
                  >
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
        <nav className="mt-12 flex items-center justify-center gap-6 px-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="border-primary hover:bg-primary/5 inline-flex h-8 items-center gap-2 rounded border px-4 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              width="10"
              height="13"
              viewBox="0 0 12 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
              aria-hidden="true"
            >
              <polyline points="6,1 1,5 6,9" />
              <line x1="1" y1="5" x2="11" y2="5" />
            </svg>
            {t("pagination.previous")}
          </button>

          <span className="text-muted-foreground text-xs">
            {t("pagination.info", { current: currentPage, total: totalPages })}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="border-primary inline-flex h-8 items-center gap-2 rounded border px-4 text-xs font-medium disabled:opacity-40"
          >
            {t("pagination.next")}
            <svg
              width="10"
              height="13"
              viewBox="0 0 12 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
              aria-hidden="true"
            >
              <polyline points="6,1 11,5 6,9" />
              <line x1="11" y1="5" x2="1" y2="5" />
            </svg>
          </button>
        </nav>
      )}
    </div>
  );
}

// StatCard
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
    <div className="border-border bg-card dark:border-border dark:bg-card flex flex-col rounded-xl border p-3">
      <div className="self-start" aria-hidden="true">
        {icon}
      </div>
      <dl className="mt-1 flex flex-col items-center justify-center text-center">
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
      <Search
        className="text-muted-foreground mb-4 h-10 w-10 opacity-20"
        aria-hidden="true"
      />
      {hasBooks ? (
        <p className="text-muted-foreground font-medium">{t("emptySearch")}</p>
      ) : (
        <>
          <p className="text-muted-foreground font-medium">{t("empty")}</p>
          <Link href="/search" className="mt-4">
            <Button variant="outline" size="sm">
              {t("explore")}
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
