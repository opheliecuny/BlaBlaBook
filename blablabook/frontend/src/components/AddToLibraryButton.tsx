"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { addBookToLibrary } from "@/services/libraryService";
import { useTranslations } from "next-intl";

interface Props {
  bookId: string;
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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);

  const t = useTranslations("components.addToLibraryButton");

  async function handleClick() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(false);
    try {
      await addBookToLibrary({
        isbn: isbn ?? `ol-${bookId}`,
        openLibraryId: bookId,
        title,
        author: author ?? undefined,
        genre: category ?? undefined,
        thumbnail: thumbnail ?? undefined,
        publishedYear: publishedYear ?? undefined,
        status: "TO_READ",
      });

      setAdded(true);
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
      disabled={authLoading || loading || added}
      className={`flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 disabled:opacity-60 ${
        error
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      }`}
    >
      {loading
        ? t("loading")
        : added
        ? t("added")
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