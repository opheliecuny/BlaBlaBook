// Configuration de l'API client pour les appels au backend

// En production (et dev), les appels passent par le proxy Next.js /api/*
// → même domaine → cookies acceptés par Safari
// Le proxy est configuré dans next.config.ts (rewrites)
const API_URL = "/api";

/**
 * Classe pour gérer les appels API avec gestion d'erreurs et authentification
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Méthode générique pour faire des requêtes HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry = false,
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers,
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Access token expiré — on tente le refresh une seule fois
        if (response.status === 401 && !isRetry) {
          const refreshRes = await fetch(`${this.baseURL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
          });

          if (refreshRes.ok) {
            // Nouveau token reçu — on rejoue la requête originale
            return this.request<T>(endpoint, options, true);
          }

          // Refresh échoué → session vraiment expirée
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }

        const error = await response.json().catch(() => ({
          message: "Une erreur est survenue",
        }));
        throw new Error(error.message || `Erreur ${response.status}`);
      }

      if (response.status === 204) {
        return null as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Une erreur réseau est survenue");
    }
  }

  /**
   * Requête GET
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * Requête POST
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Requête PATCH
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Requête DELETE
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

// Instance singleton de l'API client
export const apiClient = new ApiClient(API_URL);

// Export de l'URL pour usage externe si nécessaire
export { API_URL };
