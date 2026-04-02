// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from "vitest";
import { apiClient } from "./api";

const mockFetch = vi.fn();

beforeAll(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

beforeEach(() => {
  mockFetch.mockReset();
  localStorage.clear();
});

function mockResponse(body: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response);
}

describe("ApiClient", () => {
  describe("get()", () => {
    it("appelle fetch avec la bonne URL et méthode GET", async () => {
      mockFetch.mockReturnValueOnce(mockResponse({ id: 1 }));
      await apiClient.get("/books");
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/books"),
        expect.objectContaining({ method: "GET", credentials: "include" }),
      );
    });

    it("retourne le corps JSON parsé", async () => {
      mockFetch.mockReturnValueOnce(mockResponse([{ id: 1 }]));
      const result = await apiClient.get("/books");
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe("post()", () => {
    it("envoie le body en JSON avec la bonne méthode", async () => {
      mockFetch.mockReturnValueOnce(mockResponse({ id: 1 }));
      await apiClient.post("/auth/login", { email: "a@b.com", password: "pw" });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email: "a@b.com", password: "pw" }),
        }),
      );
    });
  });

  describe("patch()", () => {
    it("envoie la bonne méthode PATCH", async () => {
      mockFetch.mockReturnValueOnce(mockResponse({ status: "READ" }));
      await apiClient.patch("/library/123", { status: "READ" });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/library/123"),
        expect.objectContaining({ method: "PATCH" }),
      );
    });
  });

  describe("delete()", () => {
    it("envoie la bonne méthode DELETE", async () => {
      mockFetch.mockReturnValueOnce(mockResponse(null, 204));
      await apiClient.delete("/library/123");
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/library/123"),
        expect.objectContaining({ method: "DELETE" }),
      );
    });
  });

  describe("gestion des erreurs", () => {
    it("retourne null pour une réponse 204", async () => {
      mockFetch.mockReturnValueOnce(mockResponse(null, 204));
      const result = await apiClient.get("/auth/logout");
      expect(result).toBeNull();
    });

    it("lève une erreur si la réponse n'est pas ok", async () => {
      mockFetch.mockReturnValueOnce(mockResponse({ message: "Forbidden" }, 403));
      await expect(apiClient.get("/library")).rejects.toThrow("Forbidden");
    });

    it("redirige vers /login sur 401", async () => {
      vi.stubGlobal("location", { href: "" });

      // Premier appel : /library → 401
      mockFetch.mockReturnValueOnce(mockResponse({ message: "Non autorisé" }, 401));
      // Deuxième appel : /auth/refresh → échec (401 aussi), déclenchant la redirection
      mockFetch.mockReturnValueOnce(mockResponse({ message: "Non autorisé" }, 401));

      await expect(apiClient.get("/library")).rejects.toThrow("Non autorisé");

      expect(window.location.href).toBe("/login");
    });

    // Couvre api.ts ligne 52 : refresh réussi → rejoue la requête originale
    it("rejoue la requête originale après un refresh réussi (ligne 52)", async () => {
      // Appel 1 : /library → 401 (token expiré)
      mockFetch.mockReturnValueOnce(mockResponse({ message: "Non autorisé" }, 401));
      // Appel 2 : /auth/refresh → 200 (nouveau token reçu)
      mockFetch.mockReturnValueOnce(mockResponse({}, 200));
      // Appel 3 : /library rejoué → 200 (succès)
      mockFetch.mockReturnValueOnce(mockResponse([{ id: "1" }]));

      const result = await apiClient.get("/library");

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual([{ id: "1" }]);
    });

    it("lève une erreur réseau si fetch échoue avec une Error", async () => {
      mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));
      await expect(apiClient.get("/books")).rejects.toThrow("Failed to fetch");
    });

    // Couvre api.ts ligne 76 : catch quand l'exception n'est pas une instance d'Error
    it("lève une erreur réseau générique si l'exception n'est pas une Error (ligne 76)", async () => {
      // fetch rejette avec une valeur non-Error (chaîne, objet, etc.)
      mockFetch.mockRejectedValueOnce("network failure");
      await expect(apiClient.get("/books")).rejects.toThrow(
        "Une erreur réseau est survenue",
      );
    });
  });
});
