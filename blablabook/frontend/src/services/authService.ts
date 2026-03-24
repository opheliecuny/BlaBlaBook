// Service pour l'authentification

import { apiClient } from "@/lib/api";
import type { RegisterRequest, LoginRequest, AuthResponse } from "@/types/auth";

/**
 * Inscription d'un nouvel utilisateur
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>("/auth/register", data);
}

/**
 * Connexion d'un utilisateur
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>("/auth/login", data);
}

/**
 * Déconnexion d'un utilisateur
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post<void>("/auth/logout");
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  } finally {
    // Nettoyer le localStorage même si la requête échoue
    if (typeof window !== "undefined") {
    }
  }
}
