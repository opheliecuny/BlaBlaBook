import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  isAuthenticated,
  optionalAuth,
} from "../../../src/middlewares/auth.middleware";

// Mock config
vi.mock("../../../config", () => ({
  config: {
    jwtSecret: "test-secret-key-minimum-32-characters-long-for-testing",
  },
}));

describe("Auth Middleware", () => {
  let mockRequest: Partial<Request> & { user?: { id: string } };
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      cookies: {},
      user: undefined,
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
  });

  describe("optionalAuth", () => {
    it("appelle next() sans définir req.user si aucun cookie accessToken", () => {
      mockRequest.cookies = {};
      optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRequest.user).toBeUndefined();
    });

    it("définit req.user et appelle next() si le token est valide (lignes 18-20)", () => {
      const userId = "test-user-id";
      mockRequest.cookies = { accessToken: "valid-token" };
      vi.spyOn(jwt, "verify").mockReturnValue({ userId } as any);
      optionalAuth(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockRequest.user).toEqual({ id: userId });
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it("appelle next() sans req.user si le token est invalide - pas d'erreur levée (lignes 21-23)", () => {
      mockRequest.cookies = { accessToken: "bad-token" };
      vi.spyOn(jwt, "verify").mockImplementation(() => {
        throw new Error("invalid signature");
      });
      expect(() =>
        optionalAuth(
          mockRequest as Request,
          mockResponse as Response,
          mockNext,
        ),
      ).not.toThrow();
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRequest.user).toBeUndefined();
    });
  });

  describe("isAuthenticated", () => {
    it("devrait throw si le token est manquant", () => {
      mockRequest.cookies = {};

      expect(() => {
        isAuthenticated(
          mockRequest as Request,
          mockResponse as Response,
          mockNext,
        );
      }).toThrow("No token provided");
    });

    it("devrait throw si token invalide", () => {
      mockRequest.cookies = {
        accessToken: "invalid-token",
      };

      vi.spyOn(jwt, "verify").mockImplementation(() => {
        throw new Error("invalid");
      });

      expect(() => {
        isAuthenticated(
          mockRequest as Request,
          mockResponse as Response,
          mockNext,
        );
      }).toThrow("Token is not valid or expired");
    });

    it("devrait throw si le token est expiré", () => {
      const expiredToken = jwt.sign(
        { userId: "test-user-id" },
        "test-secret-key-minimum-32-characters-long-for-testing",
        { expiresIn: "-1h" },
      );

      mockRequest.cookies = {
        accessToken: expiredToken,
      };

      expect(() => {
        isAuthenticated(
          mockRequest as Request,
          mockResponse as Response,
          mockNext,
        );
      }).toThrow("Token is not valid or expired");

      expect(mockNext).not.toHaveBeenCalled();
    });

    it("devrait définir req.user et appeler next() si le token est valide", () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000";

      mockRequest.cookies = {
        accessToken: "valid-token",
      };

      vi.spyOn(jwt, "verify").mockReturnValue({
        userId,
      } as any);

      isAuthenticated(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockRequest.user).toEqual({ id: userId });
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it("devrait gérer correctement un token avec un payload différent", () => {
      const userId = "another-user-id";

      mockRequest.cookies = {
        accessToken: "valid-token",
      };

      vi.spyOn(jwt, "verify").mockReturnValue({
        userId,
        extra: "data",
      } as any);

      isAuthenticated(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockRequest.user).toEqual({ id: userId });
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
});
