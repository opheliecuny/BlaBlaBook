// Service pour la gestion du profil utilisateur

import { apiClient } from "@/lib/api";
import type { UpdateProfileRequest } from "@/types/auth";
import type { UpdateProfileResponse, User } from "@/types/user";

/**
 * Met à jour le profil de l'utilisateur connecté
 */
export async function updateProfile(
  data: UpdateProfileRequest,
): Promise<UpdateProfileResponse> {
  return apiClient.patch<UpdateProfileResponse>("/user/profile", data);
}

/**
 * Récupère les informations du profil de l'utilisateur connecté
 */
export async function getProfile(): Promise<User> {
  return apiClient.get<User>("/user/profile");
}

/**
 * Supprime le profil de l'utilisateur connecté
 */
export async function deleteProfile(): Promise<void> {
  return apiClient.delete("/user");
}