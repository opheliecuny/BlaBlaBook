// Service pour la gestion du profil utilisateur

import { apiClient } from "@/lib/api";
import type { UpdateProfileRequest, UpdateProfileResponse } from "@/types/auth";

/**
 * Met à jour le profil de l'utilisateur connecté
 */
export async function updateProfile(
  data: UpdateProfileRequest,
): Promise<UpdateProfileResponse> {
  return apiClient.patch<UpdateProfileResponse>("/user/profile", data);
}
