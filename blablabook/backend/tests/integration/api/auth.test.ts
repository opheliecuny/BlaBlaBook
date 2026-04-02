import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../helpers/testServer";
import { cleanDatabase, createTestUser } from "../../helpers/dbHelpers";
import { prisma } from "../../../src/utils/prismaClient";

describe("Auth API Integration Tests", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await cleanDatabase();
  });

  describe("POST /auth/register", () => {
    it("devrait créer un nouvel utilisateur avec succès", async () => {
      const userData = {
        email: "newuser@example.com",
        password: "Password123!",
        confirm: "Password123!",
        username: "newuser",
      };

      const response = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.email).toBe(userData.email);
      expect(response.body.username).toBe(userData.username);
      expect(response.body).not.toHaveProperty("password");

      // Vérifier que les cookies sont définis
      const cookies = response.headers["set-cookie"] as unknown as string[];
      expect(cookies).toBeDefined();
      expect(cookies.some((c: string) => c.startsWith("accessToken="))).toBe(
        true,
      );
      expect(cookies.some((c: string) => c.startsWith("refreshToken="))).toBe(
        true,
      );

      // Vérifier que l'utilisateur existe en BDD
      const user = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      expect(user).toBeDefined();
      expect(user?.username).toBe(userData.username);
    });

    it("devrait retourner 409 si l'email existe déjà", async () => {
      await createTestUser({ email: "existing@example.com" });

      const userData = {
        email: "existing@example.com",
        password: "Password123!",
        confirm: "Password123!",
        username: "newuser",
      };

      const response = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(409);

      expect(response.body.message).toBe("Email already token");
    });

    it("devrait retourner 400 si le password est trop court", async () => {
      const userData = {
        email: "user@example.com",
        password: "Short1",
        confirm: "Short1",
        username: "user",
      };

      const response = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.code).toBe("VALIDATION_ERROR");
    });

    it("devrait retourner 400 si le password n'a pas de majuscule", async () => {
      const userData = {
        email: "user@example.com",
        password: "password123",
        confirm: "password123",
        username: "user",
      };

      const response = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.code).toBe("VALIDATION_ERROR");
    });

    it("devrait retourner 400 si les passwords ne correspondent pas", async () => {
      const userData = {
        email: "user@example.com",
        password: "Password123!",
        confirm: "DifferentPassword123!",
        username: "user",
      };

      const response = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.code).toBe("VALIDATION_ERROR");
    });

    it("devrait retourner 400 si l'email est invalide", async () => {
      const userData = {
        email: "invalid-email",
        password: "Password123!",
        confirm: "Password123!",
        username: "user",
      };

      const response = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("POST /auth/login", () => {
    it("devrait connecter un utilisateur avec succès", async () => {
      await createTestUser({
        email: "login@example.com",
        password: "Password123!",
      });

      const loginData = {
        email: "login@example.com",
        password: "Password123!",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(loginData)
        .expect(200);

      expect(response.body).toMatchObject({
        email: loginData.email,
        username: "testuser",
      });
      expect(response.body).toHaveProperty("id");
      expect(response.body).not.toHaveProperty("password");

      // Vérifier que les cookies sont définis
      const cookies = response.headers["set-cookie"] as unknown as string[];
      expect(cookies).toBeDefined();
      expect(cookies.some((c: string) => c.startsWith("accessToken="))).toBe(
        true,
      );
      expect(cookies.some((c: string) => c.startsWith("refreshToken="))).toBe(
        true,
      );
    });

    it("devrait retourner 401 si l'utilisateur n'existe pas", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "Password123!",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe("User does not exist");
    });

    it("devrait retourner 401 si le password est incorrect", async () => {
      await createTestUser({
        email: "user@example.com",
        password: "CorrectPassword123!",
      });

      const loginData = {
        email: "user@example.com",
        password: "WrongPassword123!",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe("Invalid credentials");
    });

    it("devrait retourner 400 si l'email est manquant", async () => {
      const loginData = {
        password: "Password123!",
      };

      const response = await request(app)
        .post("/auth/login")
        .send(loginData)
        .expect(400);

      expect(response.body.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("POST /auth/logout", () => {
    it("devrait déconnecter un utilisateur authentifié avec succès", async () => {
      const user = await createTestUser({
        email: "logout@example.com",
        password: "Password123!",
      });

      // D'abord se connecter pour obtenir un token
      const loginResponse = await request(app).post("/auth/login").send({
        email: "logout@example.com",
        password: "Password123!",
      });

      const cookies = loginResponse.headers["set-cookie"];

      // Puis se déconnecter
      await request(app)
        .post("/auth/logout")
        .set("Cookie", cookies)
        .expect(204);

      // Vérifier que les refresh tokens sont supprimés de la BDD
      const refreshTokens = await prisma.refresh_token.findMany({
        where: { userId: user.id },
      });
      expect(refreshTokens.length).toBe(0);
    });

    it("devrait effacer les cookies avec les attributs corrects", async () => {
      await createTestUser({
        email: "logout-cookies@example.com",
        password: "Password123!",
      });

      const loginResponse = await request(app).post("/auth/login").send({
        email: "logout-cookies@example.com",
        password: "Password123!",
      });

      const cookies = loginResponse.headers["set-cookie"];

      const logoutResponse = await request(app)
        .post("/auth/logout")
        .set("Cookie", cookies)
        .expect(204);

      const setCookieHeaders = logoutResponse.headers["set-cookie"] as unknown as string[];
      expect(setCookieHeaders).toBeDefined();

      const accessTokenCookie = setCookieHeaders.find((c: string) =>
        c.startsWith("accessToken="),
      );
      const refreshTokenCookie = setCookieHeaders.find((c: string) =>
        c.startsWith("refreshToken="),
      );

      // accessToken doit être effacé avec samesite=lax (dev/test env)
      expect(accessTokenCookie).toBeDefined();
      expect(accessTokenCookie).toMatch(/Max-Age=0/i);
      expect(accessTokenCookie).toMatch(/SameSite=Lax/i);

      // refreshToken doit être effacé avec le bon path
      expect(refreshTokenCookie).toBeDefined();
      expect(refreshTokenCookie).toMatch(/Max-Age=0/i);
      expect(refreshTokenCookie).toMatch(/SameSite=Lax/i);
      expect(refreshTokenCookie).toMatch(/Path=\/auth\/refresh/i);
    });

    it("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
      const response = await request(app).post("/auth/logout").expect(401);

      expect(response.body.message).toBe("No token provided");
    });
  });

  describe("POST /auth/refresh", () => {
    it("devrait émettre de nouveaux tokens à partir d'un refresh token valide", async () => {
      await createTestUser({ email: "refresh@example.com", password: "Password123!" });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "refresh@example.com", password: "Password123!" });

      const cookies = loginResponse.headers["set-cookie"] as unknown as string[];
      const refreshCookie = cookies.find((c: string) => c.startsWith("refreshToken="));
      expect(refreshCookie).toBeDefined();

      const response = await request(app)
        .post("/auth/refresh")
        .set("Cookie", cookies)
        .expect(200);

      expect(response.body).toMatchObject({ email: "refresh@example.com" });
      expect(response.body).toHaveProperty("id");

      const newCookies = response.headers["set-cookie"] as unknown as string[];
      expect(newCookies.some((c: string) => c.startsWith("accessToken="))).toBe(true);
      expect(newCookies.some((c: string) => c.startsWith("refreshToken="))).toBe(true);
    });

    it("devrait retourner 401 si aucun refresh token n'est fourni", async () => {
      const response = await request(app).post("/auth/refresh").expect(401);
      expect(response.body.message).toBe("No refresh token provided");
    });

    it("devrait retourner 401 si le refresh token est invalide", async () => {
      const response = await request(app)
        .post("/auth/refresh")
        .set("Cookie", "refreshToken=tokeninvalide")
        .expect(401);

      expect(response.body.message).toBe("Invalid refresh token");
    });

    it("devrait retourner 401 si le refresh token est expiré", async () => {
      const user = await createTestUser({ email: "expired@example.com", password: "Password123!" });

      await prisma.refresh_token.create({
        data: {
          token: "expired-token",
          userId: user.id,
          issuedAt: new Date("2020-01-01"),
          expiresAt: new Date("2020-01-08"),
        },
      });

      const response = await request(app)
        .post("/auth/refresh")
        .set("Cookie", "refreshToken=expired-token")
        .expect(401);

      expect(response.body.message).toBe("Refresh token expired");
    });

    it("devrait remplacer l'ancien refresh token en BDD (rotation)", async () => {
      const user = await createTestUser({ email: "rotation@example.com", password: "Password123!" });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "rotation@example.com", password: "Password123!" });

      const cookies = loginResponse.headers["set-cookie"] as unknown as string[];
      const oldTokenStr = (cookies.find((c: string) => c.startsWith("refreshToken=")) ?? "")
        .split(";")[0]
        .replace("refreshToken=", "");

      await request(app).post("/auth/refresh").set("Cookie", cookies).expect(200);

      const oldToken = await prisma.refresh_token.findUnique({ where: { token: oldTokenStr } });
      expect(oldToken).toBeNull();

      const tokens = await prisma.refresh_token.findMany({ where: { userId: user.id } });
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).not.toBe(oldTokenStr);
    });
  });

  describe("GET /auth/me", () => {
    it("devrait retourner les infos de l'utilisateur connecté", async () => {
      await createTestUser({
        email: "me@example.com",
        password: "Password123!",
        username: "meuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "me@example.com", password: "Password123!" });

      const cookies = loginResponse.headers["set-cookie"];

      const response = await request(app)
        .get("/auth/me")
        .set("Cookie", cookies)
        .expect(200);

      expect(response.body).toMatchObject({
        email: "me@example.com",
        username: "meuser",
      });
      expect(response.body).toHaveProperty("id");
      expect(response.body).not.toHaveProperty("password");
    });

    it("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
      await request(app).get("/auth/me").expect(401);
    });

    // Couvre auth.controller.ts ligne 150 : user supprimé après émission du token
    it("devrait retourner 401 si l'utilisateur a été supprimé après la connexion (ligne 150)", async () => {
      const user = await createTestUser({
        email: "ghost@example.com",
        password: "Password123!",
        username: "ghostuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "ghost@example.com", password: "Password123!" });

      const cookies = loginResponse.headers["set-cookie"];

      // Supprimer les refresh tokens puis l'utilisateur (contrainte FK sur la DB de test)
      await prisma.refresh_token.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });

      const response = await request(app)
        .get("/auth/me")
        .set("Cookie", cookies)
        .expect(401);

      expect(response.body.message).toBe("User does not exist");
    });
  });

  describe("POST /auth/login — nettoyage des tokens expirés", () => {
    it("devrait purger les refresh tokens expirés des autres utilisateurs au login", async () => {
      // Créer un autre utilisateur avec un token expiré en BDD
      const otherUser = await createTestUser({
        email: "other@example.com",
        password: "Password123!",
        username: "otheruser",
      });

      await prisma.refresh_token.create({
        data: {
          token: "expired-token-other-user",
          userId: otherUser.id,
          issuedAt: new Date(),
          expiresAt: new Date(Date.now() - 1000), // déjà expiré
        },
      });

      // Créer l'utilisateur qui va se connecter
      await createTestUser({
        email: "user@example.com",
        password: "Password123!",
        username: "testuser",
      });

      // Login → déclenche le cleanup global
      await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123!" })
        .expect(200);

      // Vérifier que le token expiré de l'autre utilisateur a été supprimé
      await new Promise((resolve) => setTimeout(resolve, 50)); // laisse le fire&forget s'exécuter
      const expiredToken = await prisma.refresh_token.findUnique({
        where: { token: "expired-token-other-user" },
      });
      expect(expiredToken).toBeNull();
    });

    it("ne devrait pas supprimer les tokens valides des autres utilisateurs", async () => {
      // Créer un autre utilisateur avec un token valide
      const otherUser = await createTestUser({
        email: "other@example.com",
        password: "Password123!",
        username: "otheruser",
      });

      await prisma.refresh_token.create({
        data: {
          token: "valid-token-other-user",
          userId: otherUser.id,
          issuedAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // valide 7j
        },
      });

      await createTestUser({
        email: "user@example.com",
        password: "Password123!",
        username: "testuser",
      });

      await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123!" })
        .expect(200);

      await new Promise((resolve) => setTimeout(resolve, 50));
      const validToken = await prisma.refresh_token.findUnique({
        where: { token: "valid-token-other-user" },
      });
      expect(validToken).not.toBeNull();
    });
  });
});
