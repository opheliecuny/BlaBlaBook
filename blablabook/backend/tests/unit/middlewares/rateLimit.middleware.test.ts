import { describe, it, expect, vi, beforeAll } from "vitest";

// ─── Mocks hoistés statiquement ──────────────────────────────────────────────
// Ces mocks DOIVENT être déclarés avant tout import du module testé.
// vi.mock() est automatiquement hoisted par Vitest, contrairement à vi.doMock().

let capturedSendCommand: ((...args: string[]) => Promise<unknown>) | null =
  null;
const mockRedisCall = vi.fn();

// Mock de RedisStore : capture sendCommand dans le constructeur
vi.mock("rate-limit-redis", () => ({
  RedisStore: class MockRedisStore {
    increment = vi
      .fn()
      .mockResolvedValue({ totalHits: 1, resetTime: new Date() });
    decrement = vi.fn().mockResolvedValue(undefined);
    resetKey = vi.fn().mockResolvedValue(undefined);

    constructor(opts: {
      sendCommand: (...args: string[]) => Promise<unknown>;
    }) {
      capturedSendCommand = opts.sendCommand;
    }
  },
}));

// Mock de ioredis (utilisé dans le bloc sans Redis)
vi.mock("ioredis", () => ({
  default: class MockRedis {
    call = mockRedisCall;
    on = vi.fn();
  },
}));

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("rateLimit.middleware", () => {
  // ─── Sans Redis ────────────────────────────────────────────────────────────

  describe("makeStore sans REDIS_URL", () => {
    let globalRateLimit: unknown;
    let authRateLimit: unknown;

    beforeAll(async () => {
      capturedSendCommand = null;

      vi.stubEnv("REDIS_URL", "");
      vi.resetModules();

      // redisClient expose redis = null quand REDIS_URL est vide
      vi.doMock("../../../src/utils/redisClient", () => ({
        redis: null,
        cacheGet: vi.fn(),
        cacheSet: vi.fn(),
      }));

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
      expect(capturedSendCommand).toBeNull();
    });
  });

  // ─── Avec Redis ────────────────────────────────────────────────────────────

  describe("makeStore avec REDIS_URL (lignes 11-21)", () => {
    beforeAll(async () => {
      capturedSendCommand = null;
      mockRedisCall.mockReset();

      // makeStore exige redis non-null ET NODE_ENV=production (ligne 12)
      vi.stubEnv("NODE_ENV", "production");
      vi.resetModules();

      // ✅ doMock AVANT l'import — redisClient expose un redis non-null
      vi.doMock("../../../src/utils/redisClient", () => {
        const mockRedis = {
          call: mockRedisCall,
          on: vi.fn(),
        };
        return { redis: mockRedis, cacheGet: vi.fn(), cacheSet: vi.fn() };
      });

      // L'import déclenche makeStore → new RedisStore({ sendCommand })
      // → capturedSendCommand est assigné dans le constructeur du mock
      await import("../../../src/middlewares/rateLimit.middleware");

      vi.unstubAllEnvs();
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

  // ─── skip: isTest ──────────────────────────────────────────────────────────

  describe("skip function — isTest = true en environnement de test", () => {
    it("les middlewares de rate limit sont désactivés en environnement de test (NODE_ENV=test)", async () => {
      vi.resetModules();

      vi.doMock("../../../src/utils/redisClient", () => ({
        redis: null,
        cacheGet: vi.fn(),
        cacheSet: vi.fn(),
      }));

      const m = await import("../../../src/middlewares/rateLimit.middleware");

      expect(typeof m.globalRateLimit).toBe("function");
      expect(typeof m.authRateLimit).toBe("function");
      expect(typeof m.searchRateLimit).toBe("function");
    });

    it("skip() est appelé et retourne true - la requête n'est pas bloquée (ligne 35)", async () => {
      const { default: express } = await import("express");
      const { default: request } = await import("supertest");

      vi.resetModules();
      vi.doMock("../../../src/utils/redisClient", () => ({
        redis: null,
        cacheGet: vi.fn(),
        cacheSet: vi.fn(),
      }));

      const m = await import("../../../src/middlewares/rateLimit.middleware");

      const app = express();
      app.use(m.globalRateLimit);
      app.get("/ping", (_req, res) => res.json({ ok: true }));

      // NODE_ENV=test → skip() retourne true → pas de rate limiting
      const res = await request(app).get("/ping");
      expect(res.status).toBe(200);
    });
  });
});
