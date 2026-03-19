// Service pour la bibliothèque personnelle

import { apiClient } from "@/lib/api";
import type { LibraryItem, AddBookToLibraryData, UpdateStatusData } from "@/types/library";

/**
 * Récupère tous les livres de la bibliothèque de l'utilisateur connecté
 */
export async function getLibrary(): Promise<LibraryItem[]> {
  return apiClient.get<LibraryItem[]>("/library");
}

/**
 * Ajoute un livre à la bibliothèque de l'utilisateur
 */
export async function addBookToLibrary(data: AddBookToLibraryData): Promise<LibraryItem> {
  return apiClient.post<LibraryItem>("/library", data);
}

/**
 * Modifie le statut de lecture d'un livre
 */
export async function updateReadingStatus(
  bookId: string,
  data: UpdateStatusData,
): Promise<LibraryItem> {
  return apiClient.patch<LibraryItem>(`/library/${bookId}`, data);
}

/**
 * Supprime un livre de la bibliothèque
 */
export async function deleteBookFromLibrary(bookId: string): Promise<void> {
  return apiClient.delete<void>(`/library/${bookId}`);
}
