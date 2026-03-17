import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../../config";

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (typeof token === 'undefined') {
    return res.status(401).json({message: "Token is missing"}); 
  }

  const accessToken = token.split(" ")[1];

  try {
    console.log(config.jwtSecret);
    const payload = jwt.verify(accessToken, config.jwtSecret) as JwtPayload;

    req.user = {
      id: payload.userId
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid or expired", error: error.message });
  }
}