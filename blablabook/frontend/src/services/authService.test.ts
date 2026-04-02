import { describe, it, expect, vi, beforeEach } from "vitest";
import { register, login, logout } from "./authService";
import { apiClient } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockApiClient = vi.mocked(apiClient);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authService", () => {
  describe("register()", () => {
    it("appelle POST /auth/register avec les données", async () => {
      const data = {
        email: "a@b.com",
        password: "Pw123456",
        confirm: "Pw123456",
        username: "alice",
      };
      mockApiClient.post.mockResolvedValueOnce({ id: "1", email: "a@b.com" });
      await register(data);
      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/register", data);
    });

    it("retourne la réponse du serveur", async () => {
      const response = { id: "1", email: "a@b.com" };
      mockApiClient.post.mockResolvedValueOnce(response);
      const result = await register({
        email: "a@b.com",
        password: "Pw123456",
        confirm: "Pw123456",
        username: "alice",
      });
      expect(result).toEqual(response);
    });
  });

  describe("login()", () => {
    it("appelle POST /auth/login avec les données", async () => {
      const data = { email: "a@b.com", password: "Pw123456" };
      mockApiClient.post.mockResolvedValueOnce({
        id: "1",
        email: "a@b.com",
        username: "alice",
      });
      await login(data);
      expect(mockApiClient.post).toHaveBeenCalledWith("/auth/login", data);
    });

    it("retourne les infos utilisateur", async () => {
      const response = { id: "1", email: "a@b.com", username: "alice" };
      mockApiClient.post.mockResolvedValueOnce(response);
      const result = await login({ email: "a@b.com", password: "Pw123456" });
      expect(result).toEqual(response);
    });
  });

  describe("logout()", () => {
    it("appelle POST /api/auth/logout avec credentials include", async () => {
      const mockFetch = vi.fn().mockResolvedValueOnce({ status: 204 });
      vi.stubGlobal("fetch", mockFetch);

      await logout();

      expect(mockFetch).toHaveBeenCalledWith("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      vi.unstubAllGlobals();
    });

    it("ne lève pas d'erreur si la requête échoue", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockRejectedValueOnce(new Error("Network error")),
      );

      await expect(logout()).resolves.toBeUndefined();

      vi.unstubAllGlobals();
    });
  });
});
