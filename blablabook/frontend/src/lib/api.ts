// Configuration de l'API client pour les appels au backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Configuration des headers par défaut
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Le token est maintenant dans un cookie httpOnly (accessToken)
    // Il est automatiquement envoyé par le navigateur avec credentials: 'include'
    // Pas besoin d'ajouter le header Authorization
    const config: RequestInit = {
      ...options,
      headers,
      credentials: "include", // Envoie automatiquement les cookies httpOnly
    };

    try {
      const response = await fetch(url, config);

      // Gestion des erreurs HTTP
      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: "Une erreur est survenue",
        }));

        // Si 401 (Unauthorized), supprimer les données utilisateur et rediriger vers login
        if (response.status === 401) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }
        }

        throw new Error(error.message || `Erreur ${response.status}`);
      }

      // Si 204 No Content, retourner null
      if (response.status === 204) {
        return null as T;
      }

      // Parser la réponse JSON
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
