// Types pour les livres

export interface Book {
  id: string;
  isbn?: string;
  openLibraryId?: string;
  title: string;
  author?: string;
  genre?: string;
  description?: string;
  thumbnail?: string;
  coverThumbnail?: string; // Alias pour thumbnail (compatibilité API)
  publisher?: string;
  pageCount?: number;
  language?: string;
  publishedYear?: number;
  category?: string;
  authorId?: string;
}

export interface BookSearchResult {
  id: string;
  title: string;
  author: string | null;
  authorId: string | null;
  publishedYear: number | null;
  coverThumbnail: string | null;
  category: string | null;
  isbn?: string | null;
}

export interface BookSearchResponse {
  results: BookSearchResult[];
  total: number;
  page: number;
}
