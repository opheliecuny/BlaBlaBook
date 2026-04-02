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
 * Utilise fetch directement (pas apiClient) pour éviter d'envoyer
 * Content-Type: application/json avec un corps vide.
 */
export async function logout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Session locale nettoyée par AuthContext même si la requête échoue
  }
}
