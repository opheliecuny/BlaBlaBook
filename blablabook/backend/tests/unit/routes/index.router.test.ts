import { describe, it, expect, vi } from "vitest";
import express from "express";
import request from "supertest";

// Empêche les appels Redis et OpenLibrary lors des tests de routing
vi.mock("../../../src/utils/redisClient", () => ({
  redis: null,
  cacheGet: vi.fn().mockResolvedValue(null),
  cacheSet: vi.fn().mockResolvedValue(undefined),
}));

vi.stubGlobal(
  "fetch",
  vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ docs: [], numFound: 0 }),
  }),
);

import { router } from "../../../src/routes/index.router";

/**
 * index.router.ts est bypassé par le testServer (qui importe les sous-routers
 * directement). Ce test force l'import et vérifie que tous les sous-routers
 * sont bien enregistrés (lignes 7-12).
 */
describe("index.router", () => {
  it("devrait exporter un Router Express valide (ligne 7)", () => {
    expect(router).toBeDefined();
    expect(typeof router).toBe("function");
  });

  describe("Sous-routers enregistrés (lignes 9-12)", () => {
    const app = express();
    app.use(express.json());
    app.use(router);

    it("devrait router GET /books vers book.router (booksRouter enregistré)", async () => {
      // Une route inconnue dans /books → 404 géré par Express (pas 500)
      // Cela prouve que booksRouter est monté (sinon ce serait Cannot GET /books)
      const res = await request(app).get("/books");
      // Le router répond (200 ou erreur métier), pas un "Cannot GET"
      expect(res.status).not.toBe(404);
    });

    it("devrait router POST /auth/register vers auth.router (authRouter enregistré)", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({ email: "bad", password: "bad" });
      // Validation Zod → 400, preuve que authRouter est monté
      expect(res.status).toBe(400);
    });

    it("devrait router GET /library vers library.router (libraryRouter enregistré)", async () => {
      const res = await request(app).get("/library");
      // Pas de cookie → 401, preuve que libraryRouter est monté (middleware auth actif)
      expect(res.status).toBe(401);
    });

    it("devrait router GET /user/profile vers user.router (userRouter enregistré)", async () => {
      const res = await request(app).get("/user/profile");
      // Pas de cookie → 401, preuve que userRouter est monté
      expect(res.status).toBe(401);
    });
  });
});
