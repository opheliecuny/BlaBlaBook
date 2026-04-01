// Service pour la bibliothèque personnelle

import { apiClient } from "@/lib/api";
import type { LibraryItem, LibraryItemCreateResponse, AddBookToLibraryData, UpdateStatusData, PaginatedLibraryResponse } from "@/types/library";

/**
 * Récupère tous les livres de la bibliothèque de l'utilisateur connecté.
 * Passe limit=100 pour récupérer tous les livres en une seule requête (cap backend).
 */
export async function getLibrary(): Promise<LibraryItem[]> {
  const response = await apiClient.get<PaginatedLibraryResponse>("/library?limit=100");
  return response.data;
}

/**
 * Ajoute un livre à la bibliothèque de l'utilisateur
 */
export async function addBookToLibrary(data: AddBookToLibraryData): Promise<LibraryItemCreateResponse> {
  return apiClient.post<LibraryItemCreateResponse>("/library", data);
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
