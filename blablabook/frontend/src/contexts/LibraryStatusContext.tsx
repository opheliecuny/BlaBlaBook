"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { getLibrary } from "@/services/libraryService";

interface LibraryStatusContextType {
  libraryIds: Set<string>;         // Set of openLibraryIds in library
  bookIdMap: Map<string, string>;  // openLibraryId → book UUID (needed for DELETE)
  isLoaded: boolean;
  addLocal: (openLibraryId: string, bookUUID: string) => void;
  removeLocal: (openLibraryId: string) => void;
}

const LibraryStatusContext = createContext<LibraryStatusContextType | undefined>(undefined);

export function LibraryStatusProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [libraryIds, setLibraryIds] = useState<Set<string>>(new Set());
  const [bookIdMap, setBookIdMap] = useState<Map<string, string>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLibraryIds(new Set());
      setBookIdMap(new Map());
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);
    getLibrary()
      .then((items) => {
        setLibraryIds(new Set(items.map((i) => i.openLibraryId)));
        setBookIdMap(new Map(items.map((i) => [i.openLibraryId, i.id])));
      })
      .catch(console.error)
      .finally(() => setIsLoaded(true));
  }, [isAuthenticated, authLoading]);

  const addLocal = useCallback((openLibraryId: string, bookUUID: string) => {
    setLibraryIds((prev) => new Set([...prev, openLibraryId]));
    setBookIdMap((prev) => new Map([...prev, [openLibraryId, bookUUID]]));
  }, []);

  const removeLocal = useCallback((openLibraryId: string) => {
    setLibraryIds((prev) => {
      const next = new Set(prev);
      next.delete(openLibraryId);
      return next;
    });
    setBookIdMap((prev) => {
      const next = new Map(prev);
      next.delete(openLibraryId);
      return next;
    });
  }, []);

  return (
    <LibraryStatusContext.Provider value={{ libraryIds, bookIdMap, isLoaded, addLocal, removeLocal }}>
      {children}
    </LibraryStatusContext.Provider>
  );
}

export function useLibraryStatus() {
  const ctx = useContext(LibraryStatusContext);
  if (!ctx) throw new Error("useLibraryStatus must be used within LibraryStatusProvider");
  return ctx;
}
