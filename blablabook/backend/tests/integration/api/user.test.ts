import { describe, it, expect, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "@tests/helpers/testServer";
import { prisma } from "@/utils/prismaClient";
import { cleanDatabase, createTestUser } from "@tests/helpers/dbHelpers";
import argon2 from "argon2";

describe("User API Integration Tests", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await cleanDatabase();
  });

  describe("GET /user/profile", () => {
    it("devrait retourner le profil de l'utilisateur authentifié", async () => {
      // Créer un utilisateur et se connecter
      const user = await createTestUser({
        email: "user@example.com",
        password: "Password123!",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123!" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Récupérer le profil
      const response = await request(app)
        .get("/user/profile")
        .set("Cookie", cookies)
        .expect(200);

      expect(response.body).toMatchObject({
        id: user.id,
        email: "user@example.com",
        username: "testuser",
      });
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(response.body.password).toBeUndefined(); // Le mot de passe ne doit pas être retourné
    });

    it("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
      await request(app).get("/user/profile").expect(401);
    });

    // Couvre user.controller.ts ligne 23 : user supprimé après émission du token
    it("devrait retourner 401 si l'utilisateur a été supprimé après la connexion (ligne 23)", async () => {
      const user = await createTestUser({
        email: "deleted@example.com",
        password: "Password123!",
        username: "deleteduser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "deleted@example.com", password: "Password123!" });

      const cookies = loginResponse.headers["set-cookie"];

      // Supprimer les refresh tokens puis l'utilisateur (contrainte FK sur la DB de test)
      await prisma.refresh_token.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });

      const response = await request(app)
        .get("/user/profile")
        .set("Cookie", cookies)
        .expect(401);

      expect(response.body.message).toBe("User does not exist");
    });
  });

  describe("PATCH /user/profile", () => {
    it("devrait mettre à jour le username", async () => {
      // Créer un utilisateur et se connecter
      const user = await createTestUser({
        email: "user@example.com",
        password: "Password123!",
        username: "oldusername",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123!" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Mettre à jour le username
      const response = await request(app)
        .patch("/user/profile")
        .set("Cookie", cookies)
        .send({ username: "newusername" })
        .expect(200);

      expect(response.body.message).toBe("User updated successfully");
      expect(response.body.user.username).toBe("newusername");

      // Vérifier en BDD
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(updatedUser?.username).toBe("newusername");
    });

    it("devrait mettre à jour l'email", async () => {
      // Créer un utilisateur et se connecter
      const user = await createTestUser({
        email: "old@example.com",
        password: "Password123!",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "old@example.com", password: "Password123!" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Mettre à jour l'email
      const response = await request(app)
        .patch("/user/profile")
        .set("Cookie", cookies)
        .send({ email: "new@example.com" })
        .expect(200);

      expect(response.body.user.email).toBe("new@example.com");

      // Vérifier en BDD
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(updatedUser?.email).toBe("new@example.com");
    });

    it("devrait mettre à jour le password et le hasher", async () => {
      // Créer un utilisateur et se connecter
      const user = await createTestUser({
        email: "user@example.com",
        password: "OldPassword123!",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "OldPassword123!" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Mettre à jour le password avec le mot de passe actuel
      await request(app)
        .patch("/user/profile")
        .set("Cookie", cookies)
        .send({ password: "NewPassword123!", currentPassword: "OldPassword123!" })
        .expect(200);

      // Vérifier que le nouveau password est hashé en BDD
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      expect(updatedUser?.password).not.toBe("NewPassword123!");
      const isValidPassword = await argon2.verify(
        updatedUser!.password,
        "NewPassword123!",
      );
      expect(isValidPassword).toBe(true);

      // Vérifier qu'on peut se connecter avec le nouveau password
      const newLoginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "NewPassword123!" })
        .expect(200);

      expect(newLoginResponse.body).toHaveProperty("id");
      expect(newLoginResponse.body.email).toBe("user@example.com");
    });

    it("devrait retourner 400 si currentPassword est absent lors du changement de mot de passe", async () => {
      await createTestUser({ email: "user@example.com", password: "Password123!", username: "testuser" });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123!" });

      const cookies = loginResponse.headers["set-cookie"] as unknown as string[];

      const response = await request(app)
        .patch("/user/profile")
        .set("Cookie", cookies)
        .send({ password: "NewPassword123!" })
        .expect(400);

      expect(response.body.message).toBe("Validation error");
      expect(response.body.details[0].message).toBe("Current password is required to set a new password");
    });

    it("devrait retourner 401 si currentPassword est incorrect", async () => {
      await createTestUser({ email: "user@example.com", password: "Password123!", username: "testuser" });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123!" });

      const cookies = loginResponse.headers["set-cookie"] as unknown as string[];

      const response = await request(app)
        .patch("/user/profile")
        .set("Cookie", cookies)
        .send({ password: "NewPassword123!", currentPassword: "WrongPassword123!" })
        .expect(401);

      expect(response.body.message).toBe("Current password is incorrect");
    });

    it("devrait retourner 409 si le nouvel email est déjà utilisé", async () => {
      // Créer deux utilisateurs
      await createTestUser({
        email: "user1@example.com",
        password: "Password123!",
        username: "user1",
      });

      await createTestUser({
        email: "user2@example.com",
        password: "Password123!",
        username: "user2",
      });

      // Se connecter avec user1
      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user1@example.com", password: "Password123!" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Essayer de changer l'email de user1 vers l'email de user2
      await request(app)
        .patch("/user/profile")
        .set("Cookie", cookies)
        .send({ email: "user2@example.com" })
        .expect(409);
    });

    it("devrait retourner 400 si le password est trop court", async () => {
      // Créer un utilisateur et se connecter
      await createTestUser({
        email: "user@example.com",
        password: "Password123!",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123!" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Essayer de mettre à jour avec un password trop court
      const response = await request(app)
        .patch("/user/profile")
        .set("Cookie", cookies)
        .send({ password: "Short1" })
        .expect(400);

      expect(response.body.code).toBe("VALIDATION_ERROR");
    });

    it("devrait retourner 400 si le password n'a pas de majuscule", async () => {
      // Créer un utilisateur et se connecter
      await createTestUser({
        email: "user@example.com",
        password: "Password123!",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123!" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Essayer de mettre à jour avec un password sans majuscule
      const response = await request(app)
        .patch("/user/profile")
        .set("Cookie", cookies)
        .send({ password: "password123" })
        .expect(400);

      expect(response.body.code).toBe("VALIDATION_ERROR");
    });

    it("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
      await request(app)
        .patch("/user/profile")
        .send({ username: "newusername" })
        .expect(401);
    });
  });

  describe("DELETE /user", () => {
    it("devrait supprimer le compte utilisateur et ses refresh tokens", async () => {
      // Créer un utilisateur et se connecter
      const user = await createTestUser({
        email: "user@example.com",
        password: "Password123!",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123!" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Vérifier qu'un refresh token existe
      const refreshTokensBefore = await prisma.refresh_token.findMany({
        where: { userId: user.id },
      });
      expect(refreshTokensBefore.length).toBeGreaterThan(0);

      // Supprimer le compte
      await request(app).delete("/user").set("Cookie", cookies).expect(204);

      // Vérifier que l'utilisateur est supprimé
      const deletedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(deletedUser).toBeNull();

      // Vérifier que les refresh tokens sont supprimés
      const refreshTokensAfter = await prisma.refresh_token.findMany({
        where: { userId: user.id },
      });
      expect(refreshTokensAfter.length).toBe(0);
    });

    it("devrait supprimer les library_items en cascade", async () => {
      // Créer un utilisateur et se connecter
      const user = await createTestUser({
        email: "user@example.com",
        password: "Password123!",
        username: "testuser",
      });

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({ email: "user@example.com", password: "Password123!" });

      const cookies = loginResponse.headers[
        "set-cookie"
      ] as unknown as string[];

      // Ajouter un livre à la bibliothèque
      await request(app).post("/library").set("Cookie", cookies).send({
        openLibraryId: "OL123W",
        isbn: "9780123456789",
        title: "Test Book",
      });

      // Vérifier que le livre est en bibliothèque
      const libraryItemsBefore = await prisma.library_item.findMany({
        where: { userId: user.id },
      });
      expect(libraryItemsBefore.length).toBe(1);

      // Supprimer le compte
      await request(app).delete("/user").set("Cookie", cookies).expect(204);

      // Vérifier que les library_items sont supprimés en cascade
      const libraryItemsAfter = await prisma.library_item.findMany({
        where: { userId: user.id },
      });
      expect(libraryItemsAfter.length).toBe(0);
    });

    it("devrait retourner 401 si l'utilisateur n'est pas authentifié", async () => {
      await request(app).delete("/user").expect(401);
    });
  });
});
