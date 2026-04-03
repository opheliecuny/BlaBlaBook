"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLibraryStatus } from "@/contexts/LibraryStatusContext";
import { addBookToLibrary } from "@/services/libraryService";
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
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { libraryIds, isLoaded, addLocal } = useLibraryStatus();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Utilisation des traductions de main
  const t = useTranslations("components.addToLibraryButton");

  // Logique de redis-cache : si la bibliothèque est chargée et que le livre est déjà dans la bibliothèque, on affiche un état "Déjà ajouté" sans faire de requête supplémentaire
  const isInLibrary = isLoaded && libraryIds.has(bookId);

  // Si le livre est déjà présent dans la bibliothèque, on affiche un badge "Déjà ajouté" (avec traduction) et on ne rend pas le bouton d'ajout
  if (isInLibrary) {
    return (
      <span className="flex shrink-0 items-center justify-center rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
        ✓ {t("added")}
      </span>
    );
  }

  async function handleClick() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const result = await addBookToLibrary({
        isbn: isbn ?? `ol-${bookId}`,
        openLibraryId: bookId,
        title,
        author: author ?? undefined,
        genre: category ?? undefined,
        thumbnail: thumbnail ?? undefined,
        publishedYear: publishedYear ?? undefined,
        status: "TO_READ",
      });

      addLocal(bookId, result.bookId);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={authLoading || loading}
      className={`flex h-9 shrink-0 items-center justify-center rounded-md px-3 text-xs font-medium whitespace-nowrap transition-colors disabled:opacity-60 ${
        error ? "bg-red-500" : "bg-primary text-primary-foreground"
      }`}
    >
      {loading ? (
        t("loading")
      ) : error ? (
        t("error")
      ) : (
        <>
          <span
            className="mr-1.5 text-sm leading-none font-black"
            style={{ WebkitTextStroke: "1px currentColor" }}
            aria-hidden="true"
          >
            +
          </span>
          {t("default")}
        </>
      )}
    </button>
  );
}
