"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useLibraryStatus } from "@/contexts/LibraryStatusContext";
import { deleteBookFromLibrary } from "@/services/libraryService";
import AddToLibraryButton from "./AddToLibraryButton";

interface Props {
  bookId: string; // openLibraryId
  isbn: string | null;
  title: string;
  author: string | null;
  publishedYear: number | null;
  thumbnail: string | null;
  category: string | null;
}

export default function SearchBookActions(props: Props) {
  const { isAuthenticated } = useAuth();
  const { libraryIds, bookIdMap, isLoaded, removeLocal } = useLibraryStatus();
  const [deleting, setDeleting] = useState(false);

  if (!isAuthenticated) return null;

  const isInLibrary = isLoaded && libraryIds.has(props.bookId);
  const bookUUID = bookIdMap.get(props.bookId);

  async function handleDelete() {
    if (!bookUUID) return;
    setDeleting(true);
    try {
      await deleteBookFromLibrary(bookUUID);
      removeLocal(props.bookId);
      toast.success(`"${props.title}" retiré de votre bibliothèque.`, { position: "bottom-right" });
    } catch {
      toast.error("Impossible de supprimer le livre.", { position: "bottom-right" });
    } finally {
      setDeleting(false);
    }
  }

  if (isInLibrary) {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="flex items-center justify-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 px-3 py-1.5 text-xs font-medium whitespace-nowrap">
          ✓ Déjà ajouté
        </span>

        <AlertDialog>
          <AlertDialogTrigger
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 shrink-0"
            aria-label={`Retirer ${props.title} de la bibliothèque`}
            disabled={deleting || !bookUUID}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Retirer ce livre ?</AlertDialogTitle>
              <AlertDialogDescription>
                Le livre &quot;{props.title}&quot; sera supprimé définitivement de votre bibliothèque.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return <AddToLibraryButton {...props} />;
}
