"use client";

import { useLibraryStatus } from "@/contexts/LibraryStatusContext";
import { useAddToLibrary } from "@/hooks/useAddToLibrary";
import { useTranslations } from "next-intl";

interface Props {
  bookId: string; // openLibraryId (ex: "OL12345W")
  isbn: string | null;
  title: string;
  author: string | null;
  publishedYear: number | null;
  thumbnail: string | null;
  category: string | null;
}

export default function AddToLibraryButton({
  bookId,
  isbn,
  title,
  author,
  publishedYear,
  thumbnail,
  category,
}: Props) {
  const { isLoaded } = useLibraryStatus();
  const { add, loading, error, isInLibrary, authLoading } = useAddToLibrary();

  const t = useTranslations("components.addToLibraryButton");

  if (isLoaded && isInLibrary(bookId)) {
    return (
      <span className="flex items-center justify-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0">
        {t("alreadyAdded")}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() =>
        add({
          openLibraryId: bookId,
          isbn,
          title,
          author: author ?? undefined,
          genre: category ?? undefined,
          thumbnail: thumbnail ?? undefined,
          publishedYear: publishedYear ?? undefined,
        })
      }
      disabled={authLoading || loading}
      className={`flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 disabled:opacity-60 ${
        error
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      }`}
    >
      {loading
        ? t("loading")
        : error
        ? t("error")
        : (
          <>
            <span
              className="text-sm font-black leading-none mr-1.5"
              style={{ WebkitTextStroke: "1px currentColor" }}
            >
              +
            </span>
            {t("default")}
          </>
        )}
    </button>
  );
}