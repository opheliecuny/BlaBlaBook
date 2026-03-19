import { ZodError } from "zod";
import { AppError } from "../errors";
import { Request } from "express";
import { Prisma } from "../../generated/prisma/client";

// transforme les erreurs Prisma et Zod en AppError pour l'errorHandler
//? on peut aussi ajouter d'autres types d'erreurs au besoin

export const transformError = (error: unknown, req: Request) => {
  // ZOD (validation)
  if (error instanceof ZodError) {
    return new AppError({
      message: "Validation error",
      statusCode: 400,
      code: "VALIDATION_ERROR",
      details: error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
      path: req.originalUrl,
      method: req.method,
    });
  }

  // Prisma (erreurs de base)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
    case "P2002":
      return new AppError({
        message: "Resource already exists",
        statusCode: 409,
        code: "UNIQUE_CONSTRAINT",
        details: error.meta,
        path: req.originalUrl,
        method: req.method,
      });

    case "P2025":
      return new AppError({
        message: "Resource not found",
        statusCode: 404,
        code: "NOT_FOUND",
        path: req.originalUrl,
        method: req.method,
      });

    default:
      return new AppError({
        message: "Database error",
        statusCode: 400,
        code: error.code,
        path: req.originalUrl,
        method: req.method,
      });
    }
  }

  // Prisma (erreurs inconnues)
  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return new AppError({
      message: "Unknown database error",
      statusCode: 500,
      code: "DB_UNKNOWN_ERROR",
      path: req.originalUrl,
      method: req.method,
    });
  }

  // Si c'est déjàa une AppError, on la laisse filer à la suite
  if (error instanceof AppError) {
    return error;
  }

  // Sinon, c'est une erreur inconnue qu'on transforme en InternalServerError
  return new AppError({
    message: "Internal server error",
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    path: req.originalUrl,
    method: req.method,
  });
};