import crypto from "node:crypto";
import jwt from "jsonwebtoken"; 
import { config } from "../../config";
import { prisma } from "../utils/prismaClient";
import { user } from "../../generated/prisma/client"; 
import type { Response } from "express";
import type { Token } from "../@types/index";


export function generateAuthenticationTokens(user: user): { accessToken: Token, refreshToken: Token} {
  const payload = {
    userId: user.id,
  };
  
  const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" }); 

  const refreshToken = crypto.randomBytes(128).toString("base64"); 

  return {
    accessToken: {
      token: accessToken,
      type: "Bearer",
      expiresInMS: 1 * 60 * 60 * 1000 // 1h
    },
    refreshToken: {
      token: refreshToken,
      type: "Bearer",
      expiresInMS: 7 * 24 * 60 * 60 * 1000 // 7j
    }
  };
}

export async function saveRefreshTokenInDatabase(refreshToken: Token, user: user) {
  await prisma.refresh_token.create({ data: {
    token: refreshToken.token,
    userId: user.id,
    issuedAt: new Date(),
    expiresAt: new Date(new Date().valueOf() + refreshToken.expiresInMS)
  }});
}

export function setAccessTokenCookie(res: Response, accessToken: Token) {
  res.cookie("accessToken", accessToken.token, {
    httpOnly: true,
    maxAge: accessToken.expiresInMS, // 1h

    // Pour des cookies sécurisés cross-origin il faut :
    secure: process.env.NODE_ENV === "production", // HTTPS uniquement en prod, HTTP autorisé en dev
    sameSite: "lax" // same-site via le proxy Next.js → lax suffisant (plus compatible Safari que "none")
    // Et ne pas oublier de faire en sorte que les CORS autorise l'envoie de "credentials"
  });
}

export function setRefreshTokenCookie(res: Response, refreshToken: Token) {
  res.cookie("refreshToken", refreshToken.token, {
    httpOnly: true,
    maxAge: refreshToken.expiresInMS, // 7j
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // En production, les appels passent par le proxy Next.js (/api/auth/refresh)
    // → le path doit correspondre au chemin vu par le navigateur, pas celui du backend
    path: process.env.NODE_ENV === "production" ? "/api/auth/refresh" : "/auth/refresh"
  });
}

export async function replaceRefreshTokenInDatabase(refreshToken: Token, user: user) {
  await prisma.refresh_token.deleteMany({ where: { userId: user.id } });
  await prisma.refresh_token.create({
    data: {
      token: refreshToken.token,
      userId: user.id,
      issuedAt: new Date(),
      expiresAt: new Date(new Date().valueOf() + refreshToken.expiresInMS)
    }
  });
};