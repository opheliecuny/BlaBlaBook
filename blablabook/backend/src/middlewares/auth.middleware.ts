import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../../config";
import { UnauthorizedError } from "@/errors";

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
