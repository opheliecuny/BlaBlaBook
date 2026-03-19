// Service pour les livres

import { apiClient } from "@/lib/api";
import type { Book, BookSearchResult } from "@/types/book";

/**
 * Récupère 4 livres aléatoires depuis OpenLibrary
 */
export async function getRandomBooks(): Promise<BookSearchResult[]> {
  return apiClient.get<BookSearchResult[]>("/books");
}

/**
 * Recherche des livres par terme de recherche
 */
export async function searchBooks(query: string): Promise<BookSearchResult[]> {
  if (!query || query.trim() === "") {
    return [];
  }
  return apiClient.get<BookSearchResult[]>(`/books/search?q=${encodeURIComponent(query)}`);
}

/**
 * Récupère les détails d'un livre par son ID OpenLibrary
 */
export async function getBookById(openLibraryId: string): Promise<Book> {
  return apiClient.get<Book>(`/books/${openLibraryId}`);
}
