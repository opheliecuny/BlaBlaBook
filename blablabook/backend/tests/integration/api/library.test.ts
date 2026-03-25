import { describe, it, expect, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "@tests/helpers/testServer";
import { prisma } from "@/utils/prismaClient";
import { cleanDatabase, createTestUser } from "@tests/helpers/dbHelpers";

describe("Library API Integration Tests", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await cleanDatabase();
  });

  describe("GET /library", () => {
    it("devrait retourner une liste vide pour un nouvel utilisateur", async () => {
      // Créer un utilisateur et se connecter
      await createTestUser({
        email: "user@example.com",
        password: "Password123",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Récupérer la bibliothèque
      const response = await request(app)
        .get("/library")
        .set("Cookie", cookies)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it("devrait retourner les livres de l'utilisateur", async () => {
      // Créer un utilisateur et se connecter
      await createTestUser({
        email: "user@example.com",
        password: "Password123",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Ajouter un livre
      await request(app).post("/library").set("Cookie", cookies).send({
        isbn: "9780123456789",
        title: "Test Book",
        author: "Test Author",
        status: "TO_READ",
      });

      // Récupérer la bibliothèque
      const response = await request(app)
        .get("/library")
        .set("Cookie", cookies)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        title: "Test Book",
        author: "Test Author",
        isbn: "9780123456789",
        status: "TO_READ",
      });
    });

    it("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
      await request(app).get("/library").expect(401);
    });
  });

  describe("POST /library", () => {
    it("devrait ajouter un livre avec succès", async () => {
      // Créer un utilisateur et se connecter
      const user = await createTestUser({
        email: "user@example.com",
        password: "Password123",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Ajouter un livre
      const response = await request(app)
        .post("/library")
        .set("Cookie", cookies)
        .send({
          isbn: "9780123456789",
          title: "Test Book",
          author: "Test Author",
          genre: "Fiction",
          description: "A test book",
          pageCount: 300,
          status: "READING",
        })
        .expect(200);

      expect(response.body).toMatchObject({
        userId: user.id,
        status: "READING",
      });

      // Vérifier que le livre est bien en BDD
      const libraryItem = await prisma.library_item.findFirst({
        where: { userId: user.id },
        include: { book: true },
      });

      expect(libraryItem).toBeDefined();
      expect(libraryItem?.book.title).toBe("Test Book");
      expect(libraryItem?.status).toBe("READING");
    });

    it("devrait ajouter un livre avec statut par défaut TO_READ", async () => {
      // Créer un utilisateur et se connecter
      await createTestUser({
        email: "user@example.com",
        password: "Password123",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Ajouter un livre sans statut
      const response = await request(app)
        .post("/library")
        .set("Cookie", cookies)
        .send({
          isbn: "9780123456789",
          title: "Test Book",
        })
        .expect(200);

      expect(response.body.status).toBe("TO_READ");
    });

    it("devrait retourner 400 si le titre est manquant", async () => {
      // Créer un utilisateur et se connecter
      await createTestUser({
        email: "user@example.com",
        password: "Password123",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Ajouter un livre sans titre
      const response = await request(app)
        .post("/library")
        .set("Cookie", cookies)
        .send({
          isbn: "9780123456789",
        })
        .expect(400);

      expect(response.body.code).toBe("VALIDATION_ERROR");
    });

    it("devrait retourner 400 si l'isbn est manquant", async () => {
      // Créer un utilisateur et se connecter
      await createTestUser({
        email: "user@example.com",
        password: "Password123",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Ajouter un livre sans isbn
      const response = await request(app)
        .post("/library")
        .set("Cookie", cookies)
        .send({
          title: "Test Book",
        })
        .expect(400);

      expect(response.body.code).toBe("VALIDATION_ERROR");
    });

    it("devrait retourner 409 si le livre est déjà dans la bibliothèque", async () => {
      // Créer un utilisateur et se connecter
      await createTestUser({
        email: "user@example.com",
        password: "Password123",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Ajouter un livre
      await request(app)
        .post("/library")
        .set("Cookie", cookies)
        .send({
          isbn: "9780123456789",
          title: "Test Book",
        })
        .expect(200);

      // Essayer d'ajouter le même livre
      const response = await request(app)
        .post("/library")
        .set("Cookie", cookies)
        .send({
          isbn: "9780123456789",
          title: "Test Book",
        })
        .expect(409);

      expect(response.body.code).toBe("UNIQUE_CONSTRAINT");
    });

    it("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
      await request(app)
        .post("/library")
        .send({
          isbn: "9780123456789",
          title: "Test Book",
        })
        .expect(401);
    });
  });

  describe("PATCH /library/:id", () => {
    it("devrait mettre à jour le statut de lecture", async () => {
      // Créer un utilisateur et se connecter
      const user = await createTestUser({
        email: "user@example.com",
        password: "Password123",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Ajouter un livre
      const addResponse = await request(app)
        .post("/library")
        .set("Cookie", cookies)
        .send({
          isbn: "9780123456789",
          title: "Test Book",
          status: "TO_READ",
        });

      const bookId = addResponse.body.bookId;

      // Mettre à jour le statut
      const response = await request(app)
        .patch(`/library/${bookId}`)
        .set("Cookie", cookies)
        .send({ status: "READING" })
        .expect(200);

      expect(response.body.status).toBe("READING");

      // Vérifier en BDD
      const libraryItem = await prisma.library_item.findFirst({
        where: { userId: user.id, bookId },
      });

      expect(libraryItem?.status).toBe("READING");
    });

    it("devrait retourner 400 si le statut est invalide", async () => {
      // Créer un utilisateur et se connecter
      await createTestUser({
        email: "user@example.com",
        password: "Password123",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Ajouter un livre
      const addResponse = await request(app)
        .post("/library")
        .set("Cookie", cookies)
        .send({
          isbn: "9780123456789",
          title: "Test Book",
        });

      const bookId = addResponse.body.bookId;

      // Mettre à jour avec un statut invalide
      const response = await request(app)
        .patch(`/library/${bookId}`)
        .set("Cookie", cookies)
        .send({ status: "INVALID_STATUS" })
        .expect(400);

      expect(response.body.code).toBe("VALIDATION_ERROR");
    });

    it("devrait retourner 404 si le livre n'est pas dans la bibliothèque de l'utilisateur", async () => {
      // Créer un utilisateur et se connecter
      await createTestUser({
        email: "user@example.com",
        password: "Password123",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Essayer de mettre à jour un livre qui n'existe pas
      const response = await request(app)
        .patch("/library/550e8400-e29b-41d4-a716-446655440000")
        .set("Cookie", cookies)
        .send({ status: "READING" })
        .expect(404);

      expect(response.body.code).toBe("NOT_FOUND");
    });

    it("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
      await request(app)
        .patch("/library/550e8400-e29b-41d4-a716-446655440000")
        .send({ status: "READING" })
        .expect(401);
    });
  });

  describe("DELETE /library/:id", () => {
    it("devrait supprimer un livre de la bibliothèque", async () => {
      // Créer un utilisateur et se connecter
      const user = await createTestUser({
        email: "user@example.com",
        password: "Password123",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Ajouter un livre
      const addResponse = await request(app)
        .post("/library")
        .set("Cookie", cookies)
        .send({
          isbn: "9780123456789",
          title: "Test Book",
        });

      const bookId = addResponse.body.bookId;

      // Supprimer le livre
      await request(app)
        .delete(`/library/${bookId}`)
        .set("Cookie", cookies)
        .expect(204);

      // Vérifier que le livre n'est plus en BDD
      const libraryItem = await prisma.library_item.findFirst({
        where: { userId: user.id, bookId },
      });

      expect(libraryItem).toBeNull();
    });

    it("devrait retourner 404 si le livre n'existe pas dans la bibliothèque", async () => {
      // Créer un utilisateur et se connecter
      await createTestUser({
        email: "user@example.com",
        password: "Password123",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Essayer de supprimer un livre qui n'existe pas
      const response = await request(app)
        .delete("/library/550e8400-e29b-41d4-a716-446655440000")
        .set("Cookie", cookies)
        .expect(404);

      expect(response.body.code).toBe("NOT_FOUND");
    });

    it("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
      await request(app)
        .delete("/library/550e8400-e29b-41d4-a716-446655440000")
        .expect(401);
    });
  });
});
