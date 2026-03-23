import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "../../../src/middlewares/auth.middleware";

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

  describe("isAuthenticated", () => {
    it("devrait retourner 401 si le token est manquant", () => {
      mockRequest.cookies = {};

      isAuthenticated(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Token is missing",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("devrait retourner 401 si le token est invalide", () => {
      mockRequest.cookies = {
        accessToken: "invalid-token",
      };

      isAuthenticated(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Token is not valid or expired",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("devrait retourner 401 si le token est expiré", () => {
      // Créer un token expiré
      const expiredToken = jwt.sign(
        { userId: "test-user-id" },
        "test-secret-key-minimum-32-characters-long-for-testing",
        { expiresIn: "-1h" }, // Token expiré il y a 1 heure
      );

      mockRequest.cookies = {
        accessToken: expiredToken,
      };

      isAuthenticated(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Token is not valid or expired",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("devrait définir req.user et appeler next() si le token est valide", () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000";
      const validToken = jwt.sign(
        { userId },
        "test-secret-key-minimum-32-characters-long-for-testing",
        { expiresIn: "1h" },
      );

      mockRequest.cookies = {
        accessToken: validToken,
      };

      isAuthenticated(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockRequest.user).toEqual({ id: userId });
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("devrait gérer correctement un token avec un payload différent", () => {
      const userId = "another-user-id";
      const validToken = jwt.sign(
        { userId, extra: "data" },
        "test-secret-key-minimum-32-characters-long-for-testing",
        { expiresIn: "2h" },
      );

      mockRequest.cookies = {
        accessToken: validToken,
      };

      isAuthenticated(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockRequest.user).toEqual({ id: userId });
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
