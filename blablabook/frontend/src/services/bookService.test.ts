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
    it("retourne [] si la query est vide", async () => {
      const result = await searchBooks("");
      expect(result).toEqual([]);
      expect(mockApiClient.get).not.toHaveBeenCalled();
    });

    it("retourne [] si la query ne contient que des espaces", async () => {
      const result = await searchBooks("   ");
      expect(result).toEqual([]);
      expect(mockApiClient.get).not.toHaveBeenCalled();
    });

    it("appelle GET /books/search avec la query encodée", async () => {
      mockApiClient.get.mockResolvedValueOnce([]);
      await searchBooks("harry potter");
      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/books/search?q=harry%20potter",
      );
    });

    it("retourne les résultats de recherche", async () => {
      const books = [{ id: "1", title: "Harry Potter" }];
      mockApiClient.get.mockResolvedValueOnce(books);
      const result = await searchBooks("harry");
      expect(result).toEqual(books);
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
