import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app } from "../../helpers/testServer";

const mockDoc = {
  key: "/works/OL123W",
  title: "Harry Potter",
  author_name: ["J.K. Rowling"],
  author_key: ["/authors/OL1A"],
  cover_i: 123456,
  first_publish_year: 1997,
  subject: ["Fantasy"],
  isbn: ["9780747532743"],
};

function mockFetch(docs: unknown[], numFound = docs.length) {
  vi.mocked(fetch).mockResolvedValueOnce({
    json: async () => ({ numFound, start: 0, docs }),
  } as Response);
}

describe("Books API Integration Tests", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("GET /books", () => {
    it("devrait retourner une liste de livres transformés", async () => {
      mockFetch([mockDoc]);

      const response = await request(app).get("/books").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toMatchObject({
        title: "Harry Potter",
        author: "J.K. Rowling",
        authorId: "/authors/OL1A",
        isbn: "9780747532743",
        coverThumbnail: "https://covers.openlibrary.org/b/id/123456-M.jpg",
      });
    });

    it("devrait retourner une liste vide si l'API ne renvoie aucun résultat", async () => {
      mockFetch([]);

      const response = await request(app).get("/books").expect(200);
      expect(response.body).toEqual([]);
    });

    it("devrait retourner null pour coverThumbnail si cover_i est absent", async () => {
      const { cover_i: _, ...docWithoutCover } = mockDoc;
      mockFetch([docWithoutCover]);

      const response = await request(app).get("/books").expect(200);
      expect(response.body[0].coverThumbnail).toBeNull();
    });

    it("devrait retourner null pour les champs optionnels absents", async () => {
      mockFetch([{ key: "/works/OL1W", title: "Minimal Book" }]);

      const response = await request(app).get("/books").expect(200);
      expect(response.body[0].author).toBeNull();
      expect(response.body[0].authorId).toBeNull();
      expect(response.body[0].isbn).toBeNull();
      expect(response.body[0].coverThumbnail).toBeNull();
    });
  });

  describe("GET /books/search", () => {
    it("devrait retourner les résultats avec total et page", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => ({ numFound: 42, start: 0, docs: [mockDoc] }),
      } as Response);

      const response = await request(app)
        .get("/books/search?q=harry+potter")
        .expect(200);

      expect(response.body).toMatchObject({ total: 42, page: 1 });
      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results[0]).toMatchObject({
        title: "Harry Potter",
        author: "J.K. Rowling",
      });
    });

    it("devrait utiliser la page 1 par défaut", async () => {
      mockFetch([]);

      const response = await request(app)
        .get("/books/search?q=test")
        .expect(200);

      expect(response.body.page).toBe(1);
    });

    it("devrait respecter le numéro de page fourni", async () => {
      mockFetch([]);

      await request(app).get("/books/search?q=test&page=3").expect(200);

      const fetchUrl = vi.mocked(fetch).mock.calls[0][0] as string;
      expect(fetchUrl).toContain("page=3");
    });

    it("devrait encoder la query dans l'URL appelée à Open Library", async () => {
      mockFetch([]);

      await request(app).get("/books/search?q=harry%20potter").expect(200);

      const fetchUrl = vi.mocked(fetch).mock.calls[0][0] as string;
      expect(fetchUrl).toContain("harry%20potter");
    });

    it("devrait retourner null pour les champs optionnels absents", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => ({
          numFound: 1,
          start: 0,
          docs: [{ key: "/works/OL1W", title: "Minimal" }],
        }),
      } as Response);

      const response = await request(app)
        .get("/books/search?q=minimal")
        .expect(200);

      const book = response.body.results[0];
      expect(book.author).toBeNull();
      expect(book.coverThumbnail).toBeNull();
      expect(book.isbn).toBeNull();
      expect(book.category).toBeNull();
      expect(book.publishedYear).toBeNull();
    });
  });

  describe("GET /books/:openLibraryId", () => {
    it("devrait retourner les détails d'un livre", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => ({ docs: [mockDoc] }),
      } as Response);

      const response = await request(app).get("/books/OL123W").expect(200);

      expect(response.body).toMatchObject({
        title: "Harry Potter",
        author: "J.K. Rowling",
        publishedYear: 1997,
        isbn: "9780747532743",
        coverThumbnail: "https://covers.openlibrary.org/b/id/123456-M.jpg",
      });
    });

    it("devrait retourner 404 si le livre n'est pas trouvé", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => ({ docs: [] }),
      } as Response);

      const response = await request(app).get("/books/OL999W").expect(404);
      expect(response.body).toHaveProperty("message", "Book not found");
    });

    it("devrait retourner null pour les champs optionnels absents", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => ({
          docs: [{ key: "/works/OL1W", title: "Minimal Book" }],
        }),
      } as Response);

      const response = await request(app).get("/books/OL1W").expect(200);

      expect(response.body.author).toBeNull();
      expect(response.body.coverThumbnail).toBeNull();
      expect(response.body.isbn).toBeNull();
      expect(response.body.description).toBeNull();
      expect(response.body.category).toBeNull();
    });

    it("devrait inclure l'id Open Library dans la query appelée", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => ({ docs: [mockDoc] }),
      } as Response);

      await request(app).get("/books/OL123W").expect(200);

      const fetchUrl = vi.mocked(fetch).mock.calls[0][0] as string;
      expect(fetchUrl).toContain("OL123W");
    });
  });
});
