import crypto from "node:crypto";
import jwt from "jsonwebtoken"; 
import { config } from "../../config";
import { prisma } from "../utils/prismaClient";
import { user } from "../../generated/prisma/client"; 
import type { Response } from "express";
import { Token } from "../../@types/express";


export function generateAuthenticationTokens(user: user) {
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
    secure: true,     // les cookies cross-origin, c'est seulement en HTTPS !
    sameSite: "none"  // les cookies cross-origin, c'est forcement entre plusieurs origins
    // Et ne pas oublier de faire en sorte que les CORS autorise l'envoie de "credentials"
  });
}

export function setRefreshTokenCookie(res: Response, refreshToken: Token) {
  res.cookie("refreshToken", refreshToken.token, {
    httpOnly: true,
    maxAge: refreshToken.expiresInMS, // 7j
    secure: true,
    sameSite: "none",
    path: "/api/auth/refresh" // Sécurité : le cookie s'enverra (front -> back) uniquement via cette route, pas les autres routes (limite les transferts de ce cookie)
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