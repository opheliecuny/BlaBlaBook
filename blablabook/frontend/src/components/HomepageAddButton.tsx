"use client";

import { useAuth } from "@/contexts/AuthContext";
import AddToLibraryButton from "./AddToLibraryButton";

interface Props {
  bookId: string;
  title: string;
  author: string | null;
  thumbnail: string | null;
}

export default function HomepageAddButton({ bookId, title, author, thumbnail }: Props) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <AddToLibraryButton
      bookId={bookId}
      isbn={null}
      title={title}
      author={author}
      publishedYear={null}
      thumbnail={thumbnail}
      category={null}
    />
  );
}
