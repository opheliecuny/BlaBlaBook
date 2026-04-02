import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import {
  AppError,
  NotFoundError,
  BadRequestError,
} from "../../../src/errors/index";
import { errorHandler } from "../../../src/middlewares/errorHandler";

function makeRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

const mockReq = {
  originalUrl: "/api/test",
  method: "GET",
} as Partial<Request> as Request;

const mockNext: NextFunction = vi.fn();

describe("errorHandler middleware", () => {
  describe("AppError → réponse structurée avec statusCode", () => {
    it("devrait retourner le statusCode et code de l'AppError", () => {
      const err = new NotFoundError("Resource not found");
      const res = makeRes();

      errorHandler(err, mockReq, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Resource not found",
          code: "NOT_FOUND",
          path: "/api/test",
          method: "GET",
        }),
      );
    });

    it("devrait utiliser le traceId de l'AppError s'il est défini", () => {
      const err = new AppError({
        statusCode: 400,
        code: "BAD_REQUEST",
        message: "Bad input",
        traceId: "fixed-trace-id",
      });
      const res = makeRes();

      errorHandler(err, mockReq, res, mockNext);

      const body = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(body.traceId).toBe("fixed-trace-id");
    });

    it("devrait générer un traceId si l'AppError n'en a pas", () => {
      const err = new BadRequestError("Invalid input");
      const res = makeRes();

      errorHandler(err, mockReq, res, mockNext);

      const body = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(body.traceId).toBeDefined();
      expect(typeof body.traceId).toBe("string");
      expect(body.traceId.length).toBeGreaterThan(0);
    });

    it("devrait inclure les details si présents dans l'AppError", () => {
      const err = new AppError({
        statusCode: 400,
        code: "VALIDATION_ERROR",
        message: "Validation error",
        details: [{ field: "email", message: "Invalid email" }],
      });
      const res = makeRes();

      errorHandler(err, mockReq, res, mockNext);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          details: [{ field: "email", message: "Invalid email" }],
        }),
      );
    });

    it("ne devrait pas inclure 'details' si undefined dans l'AppError", () => {
      const err = new NotFoundError("Not found");
      const res = makeRes();

      errorHandler(err, mockReq, res, mockNext);

      const body = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(body).not.toHaveProperty("details");
    });
  });

  // ─── Branche non-AppError (lignes 32-34) ─────────────────────────────────
  describe("Error générique → 500 Internal Server Error (lignes 32-34)", () => {
    it("devrait retourner 500 pour une erreur JavaScript standard", () => {
      const err = new Error("Something unexpected");
      const res = makeRes();

      errorHandler(err, mockReq, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
          path: "/api/test",
          method: "GET",
        }),
      );
    });

    it("devrait générer un traceId unique pour l'erreur inconnue", () => {
      const err = new Error("Unknown failure");
      const res1 = makeRes();
      const res2 = makeRes();

      errorHandler(err, mockReq, res1, mockNext);
      errorHandler(err, mockReq, res2, mockNext);

      const body1 = (res1.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
      const body2 = (res2.json as ReturnType<typeof vi.fn>).mock.calls[0][0];

      expect(body1.traceId).toBeDefined();
      expect(body2.traceId).toBeDefined();
      expect(body1.traceId).not.toBe(body2.traceId);
    });

    it("devrait utiliser req.originalUrl et req.method pour les erreurs inconnues", () => {
      const err = new TypeError("Cannot read property");
      const req = {
        originalUrl: "/books/search",
        method: "POST",
      } as Request;
      const res = makeRes();

      errorHandler(err, req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/books/search",
          method: "POST",
        }),
      );
    });
  });
});
