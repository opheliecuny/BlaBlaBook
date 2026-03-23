import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../../../generated/prisma/client";
import z from "zod";
import {
  AppError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalServerError,
} from "../../../src/errors/index";
import { transformError } from "../../../src/errors/transformError";
import { asyncWrapper } from "../../../src/errors/asyncWrapper";

describe("Error Classes", () => {
  describe("AppError", () => {
    it("devrait créer une AppError avec toutes les propriétés", () => {
      const error = new AppError({
        statusCode: 418,
        code: "CUSTOM_ERROR",
        message: "I'm a teapot",
        details: { info: "test" },
        path: "/test",
        method: "GET",
        traceId: "trace-123",
      });

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(418);
      expect(error.code).toBe("CUSTOM_ERROR");
      expect(error.message).toBe("I'm a teapot");
      expect(error.details).toEqual({ info: "test" });
      expect(error.path).toBe("/test");
      expect(error.method).toBe("GET");
      expect(error.traceId).toBe("trace-123");
    });

    it("devrait créer une AppError sans propriétés optionnelles", () => {
      const error = new AppError({
        statusCode: 500,
        code: "ERROR",
        message: "Error message",
      });

      expect(error.statusCode).toBe(500);
      expect(error.code).toBe("ERROR");
      expect(error.message).toBe("Error message");
      expect(error.details).toBeUndefined();
      expect(error.path).toBeUndefined();
      expect(error.method).toBeUndefined();
      expect(error.traceId).toBeUndefined();
    });
  });

  describe("NotFoundError", () => {
    it("devrait créer une erreur 404 avec message par défaut", () => {
      const error = new NotFoundError();

      expect(error.statusCode).toBe(404);
      expect(error.code).toBe("NOT_FOUND");
      expect(error.message).toBe("Resource not found");
    });

    it("devrait créer une erreur 404 avec message personnalisé", () => {
      const error = new NotFoundError("User not found");

      expect(error.statusCode).toBe(404);
      expect(error.code).toBe("NOT_FOUND");
      expect(error.message).toBe("User not found");
    });
  });

  describe("BadRequestError", () => {
    it("devrait créer une erreur 400", () => {
      const error = new BadRequestError("Invalid input");

      expect(error.statusCode).toBe(400);
      expect(error.code).toBe("BAD_REQUEST");
      expect(error.message).toBe("Invalid input");
    });
  });

  describe("UnauthorizedError", () => {
    it("devrait créer une erreur 401", () => {
      const error = new UnauthorizedError("Token expired");

      expect(error.statusCode).toBe(401);
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.message).toBe("Token expired");
    });
  });

  describe("ForbiddenError", () => {
    it("devrait créer une erreur 403", () => {
      const error = new ForbiddenError("Access denied");

      expect(error.statusCode).toBe(403);
      expect(error.code).toBe("FORBIDDEN");
      expect(error.message).toBe("Access denied");
    });
  });

  describe("ConflictError", () => {
    it("devrait créer une erreur 409", () => {
      const error = new ConflictError("Email already exists");

      expect(error.statusCode).toBe(409);
      expect(error.code).toBe("CONFLICT");
      expect(error.message).toBe("Email already exists");
    });
  });

  describe("InternalServerError", () => {
    it("devrait créer une erreur 500", () => {
      const error = new InternalServerError("Database connection failed");

      expect(error.statusCode).toBe(500);
      expect(error.code).toBe("INTERNAL_SERVER_ERROR");
      expect(error.message).toBe("Database connection failed");
    });
  });
});

describe("transformError", () => {
  let mockRequest: Partial<Request>;

  beforeEach(() => {
    mockRequest = {
      originalUrl: "/test/path",
      method: "POST",
    };
  });

  describe("ZodError", () => {
    it("devrait transformer une ZodError en AppError", () => {
      const schema = z.object({
        email: z.string().email(),
        age: z.number().min(18),
      });

      try {
        schema.parse({ email: "invalid", age: 15 });
      } catch (zodError) {
        const appError = transformError(zodError, mockRequest as Request);

        expect(appError).toBeInstanceOf(AppError);
        expect(appError.statusCode).toBe(400);
        expect(appError.code).toBe("VALIDATION_ERROR");
        expect(appError.message).toBe("Validation error");
        expect(appError.path).toBe("/test/path");
        expect(appError.method).toBe("POST");
        expect(appError.details).toBeDefined();
        expect(Array.isArray(appError.details)).toBe(true);
      }
    });
  });

  describe("Prisma Errors", () => {
    it("devrait transformer une erreur P2002 (unique constraint)", () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        "Unique constraint failed",
        {
          code: "P2002",
          clientVersion: "5.0.0",
          meta: { target: ["email"] },
        },
      );

      const appError = transformError(prismaError, mockRequest as Request);

      expect(appError.statusCode).toBe(409);
      expect(appError.code).toBe("UNIQUE_CONSTRAINT");
      expect(appError.message).toBe("Resource already exists");
      expect(appError.details).toEqual({ target: ["email"] });
    });

    it("devrait transformer une erreur P2025 (not found)", () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        "Record not found",
        {
          code: "P2025",
          clientVersion: "5.0.0",
        },
      );

      const appError = transformError(prismaError, mockRequest as Request);

      expect(appError.statusCode).toBe(404);
      expect(appError.code).toBe("NOT_FOUND");
      expect(appError.message).toBe("Resource not found");
    });

    it("devrait transformer une erreur Prisma avec code inconnu", () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        "Database error",
        {
          code: "P2000",
          clientVersion: "5.0.0",
        },
      );

      const appError = transformError(prismaError, mockRequest as Request);

      expect(appError.statusCode).toBe(400);
      expect(appError.code).toBe("P2000");
      expect(appError.message).toBe("Database error");
    });

    it("devrait transformer une PrismaClientUnknownRequestError", () => {
      const prismaError = new Prisma.PrismaClientUnknownRequestError(
        "Unknown error",
        { clientVersion: "5.0.0" },
      );

      const appError = transformError(prismaError, mockRequest as Request);

      expect(appError.statusCode).toBe(500);
      expect(appError.code).toBe("DB_UNKNOWN_ERROR");
      expect(appError.message).toBe("Unknown database error");
    });
  });

  describe("AppError", () => {
    it("devrait retourner une AppError existante sans transformation", () => {
      const originalError = new NotFoundError("User not found");

      const result = transformError(originalError, mockRequest as Request);

      expect(result).toBe(originalError);
      expect(result.statusCode).toBe(404);
      expect(result.message).toBe("User not found");
    });
  });

  describe("Unknown Error", () => {
    it("devrait transformer une erreur inconnue en InternalServerError", () => {
      const unknownError = new Error("Something went wrong");

      const appError = transformError(unknownError, mockRequest as Request);

      expect(appError.statusCode).toBe(500);
      expect(appError.code).toBe("INTERNAL_SERVER_ERROR");
      expect(appError.message).toBe("Internal server error");
      expect(appError.path).toBe("/test/path");
      expect(appError.method).toBe("POST");
    });
  });
});

describe("asyncWrapper", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      originalUrl: "/test",
      method: "GET",
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
  });

  it("devrait exécuter une fonction async sans erreur", async () => {
    const handler = vi.fn().mockResolvedValue(undefined);
    const wrappedHandler = asyncWrapper(handler);

    await wrappedHandler(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(handler).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("devrait attraper une erreur et appeler next() avec l'erreur transformée", async () => {
    const error = new Error("Test error");
    const handler = vi.fn().mockRejectedValue(error);
    const wrappedHandler = asyncWrapper(handler);

    await wrappedHandler(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(handler).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      }),
    );
  });

  it("devrait transformer une ZodError via asyncWrapper", async () => {
    const schema = z.object({ email: z.string().email() });
    const handler = vi.fn().mockImplementation(() => {
      schema.parse({ email: "invalid" });
    });
    const wrappedHandler = asyncWrapper(handler);

    await wrappedHandler(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        code: "VALIDATION_ERROR",
        message: "Validation error",
      }),
    );
  });

  it("devrait préserver une AppError via asyncWrapper", async () => {
    const customError = new NotFoundError("Resource not found");
    const handler = vi.fn().mockRejectedValue(customError);
    const wrappedHandler = asyncWrapper(handler);

    await wrappedHandler(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        code: "NOT_FOUND",
        message: "Resource not found",
      }),
    );
  });
});
