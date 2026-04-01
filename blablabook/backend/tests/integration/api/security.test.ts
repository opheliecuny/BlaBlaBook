import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { app } from "@tests/helpers/testServer";
import { cleanDatabase, createTestUser } from "@tests/helpers/dbHelpers";

describe("Security Integration Tests", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await cleanDatabase();
  });

  describe("Password validation — new rules", () => {
    it("devrait rejeter un mdp sans chiffre", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({
          email: "user@example.com",
          password: "Abcdefgh!",
          confirm: "Abcdefgh!",
          username: "user",
        })
        .expect(400);

      expect(response.body.code).toBe("VALIDATION_ERROR");
    });

    it("devrait rejeter un mdp sans caractère spécial", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({
          email: "user@example.com",
          password: "Abcdefg1",
          confirm: "Abcdefg1",
          username: "user",
        })
        .expect(400);

      expect(response.body.code).toBe("VALIDATION_ERROR");
    });

    it("devrait rejeter un mdp sans minuscule", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({
          email: "user@example.com",
          password: "ABCDEFG1!",
          confirm: "ABCDEFG1!",
          username: "user",
        })
        .expect(400);

      expect(response.body.code).toBe("VALIDATION_ERROR");
    });

    it("devrait accepter un mdp conforme (min+maj+chiffre+spécial)", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({
          email: "valid@example.com",
          password: "Test@1234",
          confirm: "Test@1234",
          username: "validuser",
        })
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.email).toBe("valid@example.com");
    });
  });

  describe("XSS sanitization", () => {
    it("devrait assainir les balises script dans le body", async () => {
      await createTestUser({
        email: "user@example.com",
        password: "Test@1234",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Test@1234" });

      const cookies = loginResponse.headers["set-cookie"];

      // Tenter d'ajouter un livre avec du XSS dans le titre
      const response = await request(app)
        .post("/library")
        .set("Cookie", cookies)
        .send({
          isbn: "978-0-00-000000-0",
          openLibraryId: "OL12345W",
          title: '<script>alert("xss")</script>Mon Livre',
          author: "Auteur<img onerror=alert(1) src=x>",
          status: "TO_READ",
        });

      // Le XSS doit être nettoyé du body
      if (response.status === 201 || response.status === 200) {
        // Vérifie que les tags malveillants sont retirés ou échappés
        const item = response.body;
        expect(JSON.stringify(item)).not.toContain("<script>");
        expect(JSON.stringify(item)).not.toContain("onerror=");
      }
    });

    it("devrait assainir les balises script dans le username au register", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({
          email: "xss@example.com",
          password: "Test@1234",
          confirm: "Test@1234",
          username: '<img src=x onerror="alert(1)">User',
        });

      if (response.status === 201) {
        expect(response.body.username).not.toContain("onerror=");
      }
    });
  });

  describe("Security headers (Helmet)", () => {
    it("devrait inclure les headers de sécurité sur les réponses", async () => {
      // On utilise une route auth (pas d'API externe) pour vérifier les headers
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "nobody@example.com", password: "Test@1234" });

      // Helmet ajoute ces headers même sur les erreurs
      expect(response.headers["x-content-type-options"]).toBe("nosniff");
      expect(response.headers["x-frame-options"]).toBeDefined();
    });
  });

  describe("Authentication edge cases", () => {
    it("devrait rejeter un token JWT malformé", async () => {
      const response = await request(app)
        .get("/library")
        .set("Cookie", "accessToken=not.a.valid.jwt.token")
        .expect(401);

      expect(response.body.message).toBe("Token is not valid or expired");
    });

    it("devrait rejeter un token JWT signé avec une mauvaise clé", async () => {
      const jwt = await import("jsonwebtoken");
      const fakeToken = jwt.default.sign(
        { userId: "fake-id" },
        "wrong-secret-key-that-is-not-the-real-one!!"
      );

      const response = await request(app)
        .get("/library")
        .set("Cookie", `accessToken=${fakeToken}`)
        .expect(401);

      expect(response.body.message).toBe("Token is not valid or expired");
    });

    it("devrait rejeter l'accès à /library sans cookie", async () => {
      await request(app).get("/library").expect(401);
    });
  });
});
