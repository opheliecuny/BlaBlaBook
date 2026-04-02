import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";

const mockGet = vi.fn();
const mockSetex = vi.fn();

// Capture des callbacks passés à redis.on("error") et redis.on("connect")
let capturedErrorHandler: ((err: Error) => void) | null = null;
let capturedConnectHandler: (() => void) | null = null;

// Classe mock utilisable avec `new` — vi.fn().mockImplementation ne supporte pas new
class MockRedis {
  get = mockGet;
  setex = mockSetex;
  on = vi.fn((event: string, handler: (...args: unknown[]) => void) => {
    if (event === "error")
      capturedErrorHandler = handler as (err: Error) => void;
    if (event === "connect") capturedConnectHandler = handler as () => void;
  });
  call = vi.fn();
  constructor(_url?: string, _opts?: unknown) {}
}

describe("redisClient", () => {
  // ─── Sans REDIS_URL — dégradation gracieuse ─────────────────────────────────

  describe("sans REDIS_URL", () => {
    let cacheGet: any, cacheSet: any;

    beforeAll(async () => {
      vi.stubEnv("REDIS_URL", "");
      vi.resetModules();
      vi.doMock("ioredis", () => ({ default: MockRedis }));
      const m = await import("../../../src/utils/redisClient");
      cacheGet = m.cacheGet;
      cacheSet = m.cacheSet;
      vi.unstubAllEnvs();
    });

    it("cacheGet retourne null sans appeler Redis", async () => {
      const result = await cacheGet("test-key");
      expect(result).toBeNull();
      expect(mockGet).not.toHaveBeenCalled();
    });

    it("cacheSet ne lève pas d'erreur et n'appelle pas setex", async () => {
      await expect(
        cacheSet("test-key", "value", 3600),
      ).resolves.toBeUndefined();
      expect(mockSetex).not.toHaveBeenCalled();
    });
  });

  // ─── Avec REDIS_URL ──────────────────────────────────────────────────────────

  describe("avec REDIS_URL", () => {
    let cacheGet: any, cacheSet: any;

    beforeAll(async () => {
      vi.stubEnv("REDIS_URL", "redis://localhost:6379");
      vi.resetModules();
      vi.doMock("ioredis", () => ({ default: MockRedis }));
      const m = await import("../../../src/utils/redisClient");
      cacheGet = m.cacheGet;
      cacheSet = m.cacheSet;
    });

    afterEach(() => {
      mockGet.mockReset();
      mockSetex.mockReset();
    });

    // cacheGet ─────────────────────────────────────────────────────────────────

    it("cacheGet retourne null si la clé n'existe pas", async () => {
      mockGet.mockResolvedValue(null);
      const result = await cacheGet("missing-key");
      expect(result).toBeNull();
      expect(mockGet).toHaveBeenCalledWith("missing-key");
    });

    it("cacheGet retourne la valeur mise en cache", async () => {
      const cached = JSON.stringify({ title: "Le Seigneur des Anneaux" });
      mockGet.mockResolvedValue(cached);
      const result = await cacheGet("book:OL27516W");
      expect(result).toBe(cached);
      expect(mockGet).toHaveBeenCalledWith("book:OL27516W");
    });

    it("cacheGet retourne null si Redis lève une erreur (dégradation gracieuse)", async () => {
      mockGet.mockRejectedValue(new Error("Connection lost"));
      await expect(cacheGet("test-key")).resolves.toBeNull();
    });

    // cacheSet ─────────────────────────────────────────────────────────────────

    it("cacheSet appelle setex avec la clé, le TTL et la valeur", async () => {
      mockSetex.mockResolvedValue("OK");
      await cacheSet("search:tolkien:1", '{"results":[]}', 3600);
      expect(mockSetex).toHaveBeenCalledWith(
        "search:tolkien:1",
        3600,
        '{"results":[]}',
      );
    });

    it("cacheSet applique le bon TTL (24h pour les détails de livre)", async () => {
      mockSetex.mockResolvedValue("OK");
      await cacheSet("book:OL27516W", '{"title":"Test"}', 86400);
      expect(mockSetex).toHaveBeenCalledWith(
        "book:OL27516W",
        86400,
        '{"title":"Test"}',
      );
    });

    it("cacheSet ne lève pas d'erreur si setex échoue (dégradation gracieuse)", async () => {
      mockSetex.mockRejectedValue(new Error("Redis write error"));
      await expect(
        cacheSet("test-key", "value", 3600),
      ).resolves.toBeUndefined();
    });

    // ─── Event handlers redis.on (lignes 19 et 23) ──────────────────────────

    it("le handler 'error' logue l'erreur en console.error (ligne 19)", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const fakeError = new Error("Connection refused");
      fakeError.message = "Connection refused";

      expect(capturedErrorHandler).not.toBeNull();
      capturedErrorHandler!(fakeError);

      expect(consoleSpy).toHaveBeenCalledWith(
        "[Redis] Connection error:",
        "Connection refused",
      );

      consoleSpy.mockRestore();
    });

    it("le handler 'connect' logue la connexion en console.log (ligne 23)", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      expect(capturedConnectHandler).not.toBeNull();
      capturedConnectHandler!();

      expect(consoleSpy).toHaveBeenCalledWith("[Redis] Connected");

      consoleSpy.mockRestore();
    });
  });
});
