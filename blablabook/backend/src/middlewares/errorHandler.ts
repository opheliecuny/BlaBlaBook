import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors";
import { randomUUID } from "crypto";

// type guard
function isAppError(err: Error | AppError): err is AppError {
  return err instanceof AppError;
}

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let traceId: string;

  if (isAppError(err)) {
    traceId = err.traceId || randomUUID();
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      code: err.code,
      traceId,
      path: err.path || req.originalUrl,
      method: err.method || req.method,
      ...(err.details !== undefined && { details: err.details }),
    });
  }

  // erreur inconnue au bataillon
  traceId = randomUUID();

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
    traceId,
    path: req.originalUrl,
    method: req.method,
  });
};