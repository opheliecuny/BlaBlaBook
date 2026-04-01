import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../../config";
import { UnauthorizedError } from "@/errors";

/**
 * Middleware optionnel : si un token valide est présent, req.user est peuplé.
 * Sinon, on passe sans erreur (l'endpoint gère les deux cas).
 */
export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.accessToken;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = { id: payload.userId };
  } catch {
    // Token invalide/expiré — on continue sans user
  }

  next();
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.accessToken;

  if (typeof token === "undefined") {
    throw new UnauthorizedError("No token provided");
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;

    req.user = {
      id: payload.userId,
    };

    next();
  } catch (_error) {
    throw new UnauthorizedError("Token is not valid or expired");
  }
}
