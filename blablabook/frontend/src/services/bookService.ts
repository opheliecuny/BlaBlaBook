// Service pour les livres

import { apiClient } from "@/lib/api";
import type { Book, BookSearchResult, BookSearchResponse } from "@/types/book";

/**
 * Récupère 4 livres aléatoires depuis OpenLibrary
 */
export async function getRandomBooks(): Promise<BookSearchResult[]> {
  return apiClient.get<BookSearchResult[]>("/books");
}

/**
 * Recherche des livres par terme de recherche avec pagination server-side
 */
export async function searchBooks(query: string, page = 1): Promise<BookSearchResponse> {
  if (!query || query.trim() === "") {
    return { results: [], total: 0, page: 1 };
  }
  return apiClient.get<BookSearchResponse>(
    `/books/search?q=${encodeURIComponent(query)}&page=${page}`
  );
}

/**
 * Récupère les détails d'un livre par son ID OpenLibrary
 */
export async function getBookById(openLibraryId: string): Promise<Book> {
  return apiClient.get<Book>(`/books/${openLibraryId}`);
}
