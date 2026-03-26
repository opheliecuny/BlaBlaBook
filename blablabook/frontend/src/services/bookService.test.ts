import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRandomBooks, searchBooks, getBookById } from "./bookService";
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

describe("bookService", () => {
  describe("getRandomBooks()", () => {
    it("appelle GET /books", async () => {
      mockApiClient.get.mockResolvedValueOnce([]);
      await getRandomBooks();
      expect(mockApiClient.get).toHaveBeenCalledWith("/books");
    });

    it("retourne la liste de livres", async () => {
      const books = [{ id: "1", title: "Test" }];
      mockApiClient.get.mockResolvedValueOnce(books);
      const result = await getRandomBooks();
      expect(result).toEqual(books);
    });
  });

  describe("searchBooks()", () => {
    it("retourne { results: [], total: 0, page: 1 } si la query est vide", async () => {
      const result = await searchBooks("");
      expect(result).toEqual({ results: [], total: 0, page: 1 });
      expect(mockApiClient.get).not.toHaveBeenCalled();
    });

    it("retourne { results: [], total: 0, page: 1 } si la query ne contient que des espaces", async () => {
      const result = await searchBooks("   ");
      expect(result).toEqual({ results: [], total: 0, page: 1 });
      expect(mockApiClient.get).not.toHaveBeenCalled();
    });

    it("appelle GET /books/search avec la query encodée et page par défaut", async () => {
      mockApiClient.get.mockResolvedValueOnce({ results: [], total: 0, page: 1 });
      await searchBooks("harry potter");
      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/books/search?q=harry%20potter&page=1",
      );
    });

    it("appelle GET /books/search avec le numéro de page fourni", async () => {
      mockApiClient.get.mockResolvedValueOnce({ results: [], total: 0, page: 3 });
      await searchBooks("harry potter", 3);
      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/books/search?q=harry%20potter&page=3",
      );
    });

    it("retourne les résultats de recherche", async () => {
      const response = { results: [{ id: "1", title: "Harry Potter" }], total: 1, page: 1 };
      mockApiClient.get.mockResolvedValueOnce(response);
      const result = await searchBooks("harry");
      expect(result).toEqual(response);
    });
  });

  describe("getBookById()", () => {
    it("appelle GET /books/:id", async () => {
      mockApiClient.get.mockResolvedValueOnce({ id: "OL123M" });
      await getBookById("OL123M");
      expect(mockApiClient.get).toHaveBeenCalledWith("/books/OL123M");
    });

    it("retourne les détails du livre", async () => {
      const book = { id: "OL123M", title: "Test Book" };
      mockApiClient.get.mockResolvedValueOnce(book);
      const result = await getBookById("OL123M");
      expect(result).toEqual(book);
    });
  });
});
