import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import {
  generateAuthenticationTokens,
  saveRefreshTokenInDatabase,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  replaceRefreshTokenInDatabase,
} from "../../../src/utils/token";
import { prisma } from "../../../src/utils/prismaClient";
import type { user } from "../../../generated/prisma/client";
import type { Response } from "express";

// Mock Prisma
vi.mock("../../../src/utils/prismaClient", () => ({
  prisma: {
    refresh_token: {
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

// Mock config
vi.mock("../../../config", () => ({
  config: {
    jwtSecret: "test-secret-key-minimum-32-characters-long-for-testing",
  },
}));

describe("Token Utils", () => {
  const mockUser: user = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "test@example.com",
    username: "testuser",
    password: "hashedpassword",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateAuthenticationTokens", () => {
    it("devrait générer un accessToken et un refreshToken", () => {
      const result = generateAuthenticationTokens(mockUser);

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });

    it("l'accessToken devrait être un JWT valide", () => {
      const result = generateAuthenticationTokens(mockUser);

      expect(result.accessToken.token).toBeDefined();
      expect(result.accessToken.type).toBe("Bearer");
      expect(result.accessToken.expiresInMS).toBe(1 * 60 * 60 * 1000); // 1h

      // Vérifier que le token JWT contient le userId
      const decoded = jwt.verify(
        result.accessToken.token,
        "test-secret-key-minimum-32-characters-long-for-testing",
      ) as { userId: string };
      expect(decoded.userId).toBe(mockUser.id);
    });

    it("le refreshToken devrait être une chaîne base64", () => {
      const result = generateAuthenticationTokens(mockUser);

      expect(result.refreshToken.token).toBeDefined();
      expect(result.refreshToken.type).toBe("Bearer");
      expect(result.refreshToken.expiresInMS).toBe(7 * 24 * 60 * 60 * 1000); // 7j
      expect(typeof result.refreshToken.token).toBe("string");
      expect(result.refreshToken.token.length).toBeGreaterThan(0);
    });

    it("devrait générer des refreshTokens différents à chaque appel", () => {
      const result1 = generateAuthenticationTokens(mockUser);
      const result2 = generateAuthenticationTokens(mockUser);

      expect(result1.refreshToken.token).not.toBe(result2.refreshToken.token);
    });
  });

  describe("saveRefreshTokenInDatabase", () => {
    it("devrait créer un refresh token en base de données", async () => {
      const mockRefreshToken = {
        token: "mock-refresh-token",
        type: "Bearer" as const,
        expiresInMS: 7 * 24 * 60 * 60 * 1000,
      };

      await saveRefreshTokenInDatabase(mockRefreshToken, mockUser);

      expect(prisma.refresh_token.create).toHaveBeenCalledWith({
        data: {
          token: mockRefreshToken.token,
          userId: mockUser.id,
          issuedAt: expect.any(Date),
          expiresAt: expect.any(Date),
        },
      });
    });
  });

  describe("setAccessTokenCookie", () => {
    it("devrait définir un cookie httpOnly pour l'accessToken", () => {
      const mockResponse = {
        cookie: vi.fn(),
      } as unknown as Response;

      const mockAccessToken = {
        token: "mock-access-token",
        type: "Bearer" as const,
        expiresInMS: 1 * 60 * 60 * 1000,
      };

      setAccessTokenCookie(mockResponse, mockAccessToken);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        "accessToken",
        mockAccessToken.token,
        {
          httpOnly: true,
          maxAge: mockAccessToken.expiresInMS,
          secure: false,
          sameSite: "lax",
        },
      );
    });
  });

  describe("setRefreshTokenCookie", () => {
    it("devrait définir un cookie httpOnly pour le refreshToken avec path restreint", () => {
      const mockResponse = {
        cookie: vi.fn(),
      } as unknown as Response;

      const mockRefreshToken = {
        token: "mock-refresh-token",
        type: "Bearer" as const,
        expiresInMS: 7 * 24 * 60 * 60 * 1000,
      };

      setRefreshTokenCookie(mockResponse, mockRefreshToken);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        "refreshToken",
        mockRefreshToken.token,
        {
          httpOnly: true,
          maxAge: mockRefreshToken.expiresInMS,
          secure: false,
          sameSite: "lax",
          path: "/auth/refresh",
        },
      );
    });

    // Couvre la branche ligne 62 : path = "/api/auth/refresh" en production
    it("devrait utiliser /api/auth/refresh comme path en production (ligne 62)", () => {
      vi.stubEnv("NODE_ENV", "production");

      const mockResponse = {
        cookie: vi.fn(),
      } as unknown as Response;

      const mockRefreshToken = {
        token: "mock-refresh-token",
        type: "Bearer" as const,
        expiresInMS: 7 * 24 * 60 * 60 * 1000,
      };

      setRefreshTokenCookie(mockResponse, mockRefreshToken);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        "refreshToken",
        mockRefreshToken.token,
        expect.objectContaining({
          path: "/api/auth/refresh",
          secure: true,
          sameSite: "lax",
        }),
      );

      vi.unstubAllEnvs();
    });
  });

  describe("replaceRefreshTokenInDatabase", () => {
    it("devrait supprimer les anciens tokens et créer un nouveau", async () => {
      const mockRefreshToken = {
        token: "new-refresh-token",
        type: "Bearer" as const,
        expiresInMS: 7 * 24 * 60 * 60 * 1000,
      };

      await replaceRefreshTokenInDatabase(mockRefreshToken, mockUser);

      expect(prisma.refresh_token.deleteMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
      });

      expect(prisma.refresh_token.create).toHaveBeenCalledWith({
        data: {
          token: mockRefreshToken.token,
          userId: mockUser.id,
          issuedAt: expect.any(Date),
          expiresAt: expect.any(Date),
        },
      });
    });
  });
});
