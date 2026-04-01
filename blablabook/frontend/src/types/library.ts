// Types pour la bibliothèque

import type { Book } from "./book";

export type ReadingStatus = "TO_READ" | "READING" | "READ";

export interface LibraryItem {
  id: string;
  title: string;
  author?: string;
  thumbnail?: string;
  status: ReadingStatus;
  openLibraryId: string; 
  // plus de champ `book` imbriqué
}

export interface AddBookToLibraryData {
  isbn: string;
  openLibraryId?: string;
  title: string;
  author?: string;
  genre?: string;
  description?: string;
  thumbnail?: string;
  publisher?: string;
  pageCount?: number;
  language?: string;
  publishedYear?: number;
  status?: ReadingStatus;
}

export interface UpdateStatusData {
  status: ReadingStatus;
}
