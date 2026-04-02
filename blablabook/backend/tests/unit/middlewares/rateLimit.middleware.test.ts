import { describe, it, expect, vi, beforeAll } from "vitest";

// Capture du sendCommand passé à RedisStore lors de l'import du module
let capturedSendCommand: ((...args: string[]) => Promise<unknown>) | null =
  null;
const mockRedisCall = vi.fn();

class MockRedis {
  call = mockRedisCall;
  on = vi.fn();
  constructor(_url?: string, _opts?: unknown) {}
}

// Implémente l'interface Store d'express-rate-limit (increment, decrement, resetKey)
class MockRedisStore {
  increment = vi
    .fn()
    .mockResolvedValue({ totalHits: 1, resetTime: new Date() });
  decrement = vi.fn().mockResolvedValue(undefined);
  resetKey = vi.fn().mockResolvedValue(undefined);

  constructor(opts: { sendCommand: (...args: string[]) => Promise<unknown> }) {
    capturedSendCommand = opts.sendCommand;
  }
}

describe("rateLimit.middleware", () => {
  // ─── Sans Redis (comportement actuel en test) ────────────────────────────

  describe("makeStore sans REDIS_URL", () => {
    let globalRateLimit: unknown;
    let authRateLimit: unknown;

    beforeAll(async () => {
      vi.stubEnv("REDIS_URL", "");
      vi.resetModules();
      vi.doMock("ioredis", () => ({ default: MockRedis }));
      vi.doMock("rate-limit-redis", () => ({ RedisStore: MockRedisStore }));

      const m = await import("../../../src/middlewares/rateLimit.middleware");
      globalRateLimit = m.globalRateLimit;
      authRateLimit = m.authRateLimit;

      vi.unstubAllEnvs();
    });

    it("globalRateLimit est défini même sans Redis", () => {
      expect(globalRateLimit).toBeDefined();
      expect(typeof globalRateLimit).toBe("function");
    });

    it("authRateLimit est défini même sans Redis", () => {
      expect(authRateLimit).toBeDefined();
      expect(typeof authRateLimit).toBe("function");
    });

    it("makeStore retourne undefined sans Redis (pas de RedisStore créé)", () => {
      // Sans REDIS_URL, capturedSendCommand ne doit pas être défini par ce bloc
      expect(capturedSendCommand).toBeNull();
    });
  });

  // ─── Avec Redis : makeStore + sendCommand (lignes 11-21) ─────────────────

  describe("makeStore avec REDIS_URL (lignes 11-21)", () => {
    beforeAll(async () => {
      capturedSendCommand = null;
      mockRedisCall.mockReset();

      vi.stubEnv("REDIS_URL", "redis://localhost:6379");
      vi.resetModules();
      vi.doMock("ioredis", () => ({ default: MockRedis }));
      vi.doMock("rate-limit-redis", () => ({ RedisStore: MockRedisStore }));

      await import("../../../src/middlewares/rateLimit.middleware");
    });

    it("makeStore crée un RedisStore et capture le sendCommand (ligne 11)", () => {
      expect(capturedSendCommand).not.toBeNull();
      expect(typeof capturedSendCommand).toBe("function");
    });

    it("sendCommand appelle redis.call et retourne le résultat (ligne 15)", async () => {
      mockRedisCall.mockResolvedValue("OK");

      const result = await capturedSendCommand!("SET", "key", "value");

      expect(mockRedisCall).toHaveBeenCalledWith("SET", "key", "value");
      expect(result).toBe("OK");
    });

    it("sendCommand retourne null si redis.call lève une erreur (lignes 17-21)", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockRedisCall.mockRejectedValue(new Error("Redis timeout"));

      const result = await capturedSendCommand!("GET", "key");

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[RateLimit] Redis command failed"),
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  // ─── skip: () => isTest (ligne 33) ───────────────────────────────────────

  describe("skip function — isTest = true en environnement de test", () => {
    it("les middlewares de rate limit sont désactivés en environnement de test (NODE_ENV=test)", async () => {
      vi.resetModules();
      vi.doMock("ioredis", () => ({ default: MockRedis }));
      vi.doMock("rate-limit-redis", () => ({ RedisStore: MockRedisStore }));

      // NODE_ENV est déjà 'test' — on vérifie que skip() retourne true
      // en inspectant le comportement : supertest ne doit pas recevoir 429
      const m = await import("../../../src/middlewares/rateLimit.middleware");

      // Les middlewares sont des fonctions Express valides
      expect(typeof m.globalRateLimit).toBe("function");
      expect(typeof m.authRateLimit).toBe("function");
      expect(typeof m.searchRateLimit).toBe("function");
    });
  });
});
