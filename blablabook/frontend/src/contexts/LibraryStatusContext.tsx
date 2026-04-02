"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import { getLibrary } from "@/services/libraryService";

interface LibraryStatusContextType {
  libraryIds: Set<string>;
  bookIdMap: Map<string, string>;
  isLoaded: boolean;
  addLocal: (openLibraryId: string, bookUUID: string) => void;
  removeLocal: (openLibraryId: string) => void;
}

const LibraryStatusContext = createContext<
  LibraryStatusContextType | undefined
>(undefined);

// Composant interne recréé via "key" à chaque changement d'auth
// → tous les useState repartent de zéro sans passer par un useEffect
function LibraryStatusInner({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [libraryIds, setLibraryIds] = useState<Set<string>>(new Set());
  const [bookIdMap, setBookIdMap] = useState<Map<string, string>>(new Map());
  // Initialisation directe : si non authentifié, isLoaded est déjà true dès le montage
  // → aucun setState synchrone dans l'effet n'est nécessaire
  const [isLoaded, setIsLoaded] = useState(!isAuthenticated);

  useEffect(() => {
    // Pas de setState synchrone : isLoaded et les collections sont déjà corrects
    // grâce à l'initialisation ci-dessus et à la technique "key" du parent
    if (!isAuthenticated) return;

    let isMounted = true;

    getLibrary()
      .then((items) => {
        if (!isMounted) return;
        setLibraryIds(new Set(items.map((i) => i.openLibraryId)));
        setBookIdMap(new Map(items.map((i) => [i.openLibraryId, i.id])));
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setIsLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

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

  const value = useMemo(
    () => ({ libraryIds, bookIdMap, isLoaded, addLocal, removeLocal }),
    [libraryIds, bookIdMap, isLoaded, addLocal, removeLocal],
  );

  return (
    <LibraryStatusContext.Provider value={value}>
      {children}
    </LibraryStatusContext.Provider>
  );
}

// Le changement de "key" force React à détruire et recréer LibraryStatusInner,
// réinitialisant tous ses états sans appel setState dans un effet
export function LibraryStatusProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <LibraryStatusInner key={isAuthenticated ? user?.id : "guest"}>
      {children}
    </LibraryStatusInner>
  );
}

export function useLibraryStatus() {
  const ctx = useContext(LibraryStatusContext);
  if (!ctx)
    throw new Error(
      "useLibraryStatus must be used within LibraryStatusProvider",
    );
  return ctx;
}
