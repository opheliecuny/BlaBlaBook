"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { addBookToLibrary } from "@/services/libraryService";
import type { ReadingStatus } from "@/types/library";
import { useTranslations } from "next-intl";

interface Props {
  openLibraryId: string;
  isbn: string | null;
  title: string;
  author: string | null;
  publishedYear: string | null;
  thumbnail: string;
  genre: string | null;
}

export default function AddToLibraryPanel({
  openLibraryId,
  isbn,
  title,
  author,
  publishedYear,
  thumbnail,
  genre,
}: Props) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [status, setStatus] = useState<ReadingStatus>("TO_READ");
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations("components.addToLibraryPanel");

  async function handleAdd() {
    setLoading(true);
    setError(null);
    try {
      await addBookToLibrary({
        isbn: isbn ?? `ol-${openLibraryId}`,
        openLibraryId,
        title,
        author: author ?? undefined,
        genre: genre ?? undefined,
        thumbnail,
        publishedYear: publishedYear ? parseInt(publishedYear) : undefined,
        status,
      });
      setAdded(true);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2.5 border border-border rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="status" className="text-xs text-foreground">
          {t("readingStatusLabel")}
        </label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ReadingStatus)}
          disabled={!isAuthenticated || added || authLoading}
          className="w-full border border-border rounded px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary disabled:opacity-60"
        >
          <option value="TO_READ">{t("statusToRead")}</option>
          <option value="READING">{t("statusReading")}</option>
          <option value="READ">{t("statusRead")}</option>
        </select>
      </div>

      {isAuthenticated ? (
        <>
          <button
            type="button"
            onClick={handleAdd}
            disabled={loading || added || authLoading}
            className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-5 py-2 text-[0.65rem] font-medium hover:bg-primary/90 whitespace-nowrap disabled:opacity-60"
          >
            {loading
              ? t("loading")
              : added
              ? t("added")
              : t("default")}
          </button>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </>
      ) : (
        <Link
          href="/login"
          className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-5 py-2 text-[0.65rem] font-medium hover:bg-primary/90 whitespace-nowrap"
        >
          {t("default")}
        </Link>
      )}
    </div>
  );
}