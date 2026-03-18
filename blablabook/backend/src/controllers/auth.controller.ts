import type { Request, Response } from "express";
import z from "zod";
import argon2 from "argon2";
import { generateAuthenticationTokens } from "../utils/token";
import { prisma } from "../utils/prismaClient";
// !!TODO import types for User and Token 
// !!TODO Si stockage du refreshToken en bdd, il faudra le définir dans le schéma prisma
// !!TODO Fonction logout à mettre en place (une fois décidé sur jwt ou cookie)

export async function registerUser(req: Request, res: Response) {

  const registerUserBodySchema = z.object({
    email: z.email(),
    password: z.string()
      .min(8, "password should have at least 8 caracters") // CNIL recommande plutôt 12 caractères
      .max(100, "password should have at most 100 caracters")
      .regex(/[a-z]/, "password should contain at least a lowercase caracter")
      .regex(/[A-Z]/, "password should contain at least a uppercase caracter"),
    confirm: z.string(), 
    username: z.string().min(1)
  });

  const { email, password, confirm, username } = await registerUserBodySchema.parseAsync(req.body);

  if (password !== confirm) {
    return res.status(400).json("Password and confirmation do not match"); 
  }

  try {
    const alreadyExistingUser = await prisma.user.findFirst({ where: { email } });

    if (alreadyExistingUser) {
      return res.status(409).json({ message: "Email already taken" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" }); 
  }

  const hashedPassword = await argon2.hash(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username
    }
  });

  const { accessToken, refreshToken } = generateAuthenticationTokens(user);

  return res.status(201).json({
    id: user.id,
    email: user.email,
    username: user.username,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    accessToken, 
    refreshToken
  });
};

export async function loginUser(req: Request, res: Response) {

  const loginUserBodySchema = z.object({
    email: z.email(),
    password: z.string()
  });

  const { email, password } = await loginUserBodySchema.parseAsync(req.body);

  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Email and password do not match" });
  }
  const isMatching = await argon2.verify(user.password, password);
  if (!isMatching) {
    return res.status(401).json({ message: "Email and password do not match" });
  }

  const { accessToken, refreshToken } = generateAuthenticationTokens(user);

  await replaceRefreshTokenInDatabase(refreshToken, user);

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  return res.json({ accessToken, refreshToken });
}

async function replaceRefreshTokenInDatabase(refreshToken: Token, user: User) {
  await prisma.refreshToken.deleteMany({ where: { user_id: user.id } });
  await prisma.refreshToken.create({
    data: {
      token: refreshToken.token,
      user_id: user.id,
      issued_at: new Date(),
      expires_at: new Date(new Date().valueOf() + refreshToken.expiresInMS)
    }
  });
}

function setAccessTokenCookie(res: Response, accessToken: Token) {
  res.cookie("accessToken", accessToken.token, {
    httpOnly: true,
    maxAge: accessToken.expiresInMS, // 1h

    // Pour des cookies sécurisés cross-origin il faut :
    secure: true,     // les cookies cross-origin, c'est seulement en HTTPS !
    sameSite: "none"  // les cookies cross-origin, c'est forcement entre plusieurs origins
    // Et ne pas oublier de faire en sorte que les CORS autorise l'envoie de "credentials"
  });
}

function setRefreshTokenCookie(res: Response, refreshToken: Token) {
  res.cookie("refreshToken", refreshToken.token, {
    httpOnly: true,
    maxAge: refreshToken.expiresInMS, // 7j
    secure: true,
    sameSite: "none",
    path: "/api/auth/refresh" // Sécurité : le cookie s'enverra (front -> back) uniquement via cette route, pas les autres routes (limite les transferts de ce cookie)
  });
}