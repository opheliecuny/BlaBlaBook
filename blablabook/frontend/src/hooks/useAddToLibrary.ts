"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLibraryStatus } from "@/contexts/LibraryStatusContext";
import { addBookToLibrary } from "@/services/libraryService";
import type { ReadingStatus } from "@/types/library";

interface AddToLibraryParams {
  openLibraryId: string;
  isbn: string | null;
  title: string;
  author?: string;
  genre?: string;
  thumbnail?: string;
  publishedYear?: number;
  status?: ReadingStatus;
}

export function useAddToLibrary() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { libraryIds, addLocal } = useLibraryStatus();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add(params: AddToLibraryParams) {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await addBookToLibrary({
        isbn: params.isbn ?? `ol-${params.openLibraryId}`,
        openLibraryId: params.openLibraryId,
        title: params.title,
        author: params.author,
        genre: params.genre,
        thumbnail: params.thumbnail,
        publishedYear: params.publishedYear,
        status: params.status ?? "TO_READ",
      });

      addLocal(params.openLibraryId, result.bookId);
      setAdded(true);
    } catch {
      setError("Erreur lors de l'ajout. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  function isInLibrary(openLibraryId: string) {
    return libraryIds.has(openLibraryId);
  }

  return { add, loading, added, error, isInLibrary, authLoading };
}
