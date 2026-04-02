import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getLibrary,
  addBookToLibrary,
  updateReadingStatus,
  deleteBookFromLibrary,
} from "./libraryService";
import { apiClient } from "../lib/api";

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

describe("libraryService", () => {
  describe("getLibrary()", () => {
    it("appelle GET /library?limit=100", async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: [] });
      await getLibrary();
      expect(mockApiClient.get).toHaveBeenCalledWith("/library?limit=100");
    });

    it("retourne la liste des items extraite de .data", async () => {
      const items = [{ id: "1", title: "Test", status: "TO_READ" }];
      mockApiClient.get.mockResolvedValueOnce({ data: items });
      const result = await getLibrary();
      expect(result).toEqual(items);
    });
  });

  describe("addBookToLibrary()", () => {
    it("appelle POST /library avec les données du livre", async () => {
      const data = { isbn: "978-0", title: "Test", status: "TO_READ" as const };
      mockApiClient.post.mockResolvedValueOnce({ id: "1", ...data });
      await addBookToLibrary(data);
      expect(mockApiClient.post).toHaveBeenCalledWith("/library", data);
    });
  });

  describe("updateReadingStatus()", () => {
    it("appelle PATCH /library/:id avec le nouveau statut", async () => {
      mockApiClient.patch.mockResolvedValueOnce({ id: "1", status: "READING" });
      await updateReadingStatus("book-123", { status: "READING" });
      expect(mockApiClient.patch).toHaveBeenCalledWith("/library/book-123", {
        status: "READING",
      });
    });
  });

  describe("deleteBookFromLibrary()", () => {
    it("appelle DELETE /library/:id", async () => {
      mockApiClient.delete.mockResolvedValueOnce(null);
      await deleteBookFromLibrary("book-123");
      expect(mockApiClient.delete).toHaveBeenCalledWith("/library/book-123");
    });
  });
});
