"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("components.searchBookActions");

  if (!isAuthenticated) return null;

  const isInLibrary = isLoaded && libraryIds.has(props.bookId);
  const bookUUID = bookIdMap.get(props.bookId);

  async function handleDelete() {
    if (!bookUUID) return;
    setDeleting(true);
    try {
      await deleteBookFromLibrary(bookUUID);
      removeLocal(props.bookId);
      toast.success(t("toastSuccess", { title: props.title }), {
        position: "bottom-right",
      });
    } catch {
      toast.error(t("toastError"), { position: "bottom-right" });
    } finally {
      setDeleting(false);
    }
  }

  if (isInLibrary) {
    return (
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="flex items-center justify-center rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
          {t("alreadyAdded")}
        </span>

        <AlertDialog>
          <AlertDialogTrigger
            className="border-border text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border disabled:opacity-50"
            aria-label={t("ariaLabel", { title: props.title })}
            disabled={deleting || !bookUUID}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("dialogTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("dialogDescription", { title: props.title })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                {t("confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return <AddToLibraryButton {...props} />;
}
