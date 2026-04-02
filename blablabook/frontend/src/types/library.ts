// Types pour la bibliothèque


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

// Réponse de POST /library (retourne le library_item brut, pas le livre)
export interface LibraryItemCreateResponse {
  id: string;       // library_item UUID
  bookId: string;   // book UUID — nécessaire pour DELETE /library/:bookId
  status: ReadingStatus;
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

export interface PaginatedLibraryResponse {
  data: LibraryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
