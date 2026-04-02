"use client";

import { useState } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import BookCover from "@/components/BookCover";
import { Skeleton } from "@/components/ui/skeleton";
import { getRandomBooks } from "@/services/bookService";
import type { BookSearchResult } from "@/types/book";
import { useAuth } from "@/contexts/AuthContext";

interface RandomBooksSectionProps {
  initialBooks: BookSearchResult[];
}

export default function RandomBooksSection({
  initialBooks,
}: RandomBooksSectionProps) {
  const t = useTranslations("home");
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState<BookSearchResult[]>(initialBooks);
  const [isLoading, setIsLoading] = useState(false);

  async function handleRefresh() {
    setIsLoading(true);
    try {
      const newBooks = await getRandomBooks();
      setBooks(newBooks);
    } catch {
      // En cas d'erreur on conserve la sélection actuelle
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section
      aria-labelledby="livres-du-moment"
      className="mx-auto px-5 py-8 sm:max-w-7xl sm:px-10"
    >
      <div className="mt-8 mb-8 flex items-center justify-between px-2 sm:mt-0 sm:mb-0">
        <div>
          <h2
            id="livres-du-moment"
            className="mb-1 text-center text-2xl font-bold sm:text-left"
          >
            {t("section.moment.title")}
          </h2>
          <p className="text-muted-foreground text-center text-xs tracking-widest sm:text-left">
            {isAuthenticated
              ? t("section.moment.subtitlePersonalized")
              : t("section.moment.subtitle")}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isLoading}
          aria-label={t("section.moment.refreshAriaLabel")}
          className="text-muted-foreground hover:text-foreground text-md flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors hover:bg-(--color-btn-subtle) disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
        >
          <RefreshCw
            size={14}
            aria-hidden="true"
            className={isLoading ? "animate-spin" : ""}
          />
          {t("section.moment.refresh")}
        </button>
      </div>

      <div className="mx-auto">
        <ul className="grid grid-cols-2 md:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex flex-col p-3 sm:p-8">
                <Skeleton className="aspect-2/3 w-full rounded-xl" />
                <div className="mt-3 flex flex-col gap-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="mt-2 h-7 w-full rounded-md" />
                </div>
              </li>
            ))
          ) : books.length > 0 ? (
            books.map((book, i) => {
              const bookId = book.id?.split("/").pop() ?? null;
              return (
                <li key={i} className="flex flex-col p-3 sm:p-8">
                  <BookCover
                    src={book.coverThumbnail}
                    alt={`Couverture de ${book.title}`}
                    className="aspect-2/3 w-full rounded-xl object-cover shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                    priority={i === 0} // Prioriser le chargement de la première image pour une meilleure performance perçue
                  />
                  <div className="mt-3 flex flex-1 flex-col">
                    <h3 className="font-playfair text-base leading-snug font-bold">
                      {book.title}
                    </h3>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {book.author ?? t("book.unknownAuthor")}
                    </p>
                    <div className="mt-auto pt-4">
                      <Link
                        href={
                          bookId
                            ? `/book/${bookId}`
                            : `/search?q=${encodeURIComponent(book.title)}`
                        }
                        className="inline-flex w-full items-center justify-center rounded-md bg-(--color-btn-subtle) px-3 py-1.5 text-xs font-medium hover:bg-(--color-btn-subtle-hover) active:bg-(--color-btn-subtle-active) dark:bg-gray-800"
                        aria-label={t("book.viewDetailAriaLabel", {
                          title: book.title,
                        })}
                      >
                        {t("book.viewDetail")}
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <div
              className="border-border col-span-full my-17 flex flex-col items-center rounded-xl border p-12"
              role="status"
            >
              <p className="text-muted-foreground col-span-full text-center">
                {t("error.loadingBooks")}
              </p>
              <p className="text-muted-foreground col-span-full text-center">
                {t("error.tryAgain")}
              </p>
            </div>
          )}
        </ul>
      </div>
    </section>
  );
}
