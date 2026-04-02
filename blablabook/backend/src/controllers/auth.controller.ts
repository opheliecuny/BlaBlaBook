import type { Request, Response } from "express";
import z from "zod";
import argon2 from "argon2";
import { generateAuthenticationTokens, saveRefreshTokenInDatabase, setAccessTokenCookie, setRefreshTokenCookie, replaceRefreshTokenInDatabase } from "../utils/token";
import { prisma } from "../utils/prismaClient";
import { ConflictError, UnauthorizedError } from "../errors";

export async function registerUser(req: Request, res: Response) {

  const registerUserBodySchema = z.object({
    email: z.email(),
    password: z.string()
      .min(8, "password should have at least 8 caracters") // CNIL recommande plutôt 12 caractères
      .max(100, "password should have at most 100 caracters")
      .regex(/[a-z]/, "password should contain at least a lowercase character")
      .regex(/[A-Z]/, "password should contain at least an uppercase character")
      .regex(/[0-9]/, "password should contain at least a digit")
      .regex(/[^a-zA-Z0-9]/, "password should contain at least a special character"),
    confirm: z.string(),
    username: z.string().min(1)
  }).refine(data => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"]
  });

  const { email, password, username } = await registerUserBodySchema.parseAsync(req.body);

  const alreadyExistingUser = await prisma.user.findUnique({ where: { email } });

  if (alreadyExistingUser) {
    throw new ConflictError("Email already token");
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

  await saveRefreshTokenInDatabase(refreshToken, user);

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  return res.status(201).json({
    id: user.id,
    email: user.email,
    username: user.username,
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
    throw new UnauthorizedError("User does not exist");
  }
  const isMatching = await argon2.verify(user.password, password);
  if (!isMatching) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const { accessToken, refreshToken } = generateAuthenticationTokens(user);

  await replaceRefreshTokenInDatabase(refreshToken, user);

  // Nettoyage global des tokens expirés (fire & forget — n'impacte pas la réponse)
  prisma.refresh_token.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  }).catch(() => {}); // silencieux : non bloquant

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  return res.status(200).json({
    message: "Login successful",
    id: user.id,
    email: user.email,
    username: user.username
  });
}

export async function logoutUser(req: Request, res: Response) {
  const userId = req.user?.id;

  if (userId) {
    await prisma.refresh_token.deleteMany({ where: { userId: userId } });
  }

  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("accessToken", "", { httpOnly: true, maxAge: 0, secure: isProduction, sameSite: "lax" });
  res.cookie("refreshToken", "", { httpOnly: true, maxAge: 0, secure: isProduction, sameSite: "lax", path: isProduction ? "/api/auth/refresh" : "/auth/refresh" });

  res.status(204).send({ message: "Successfully logged out" });
}

export async function refreshUserToken(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new UnauthorizedError("No refresh token provided");
  }

  const storedToken = await prisma.refresh_token.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!storedToken) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refresh_token.delete({ where: { id: storedToken.id } });
    throw new UnauthorizedError("Refresh token expired");
  }

  const { user } = storedToken;
  const { accessToken, refreshToken } = generateAuthenticationTokens(user);

  await replaceRefreshTokenInDatabase(refreshToken, user);

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  return res.status(200).json({
    id: user.id,
    email: user.email,
    username: user.username,
  });
}

export async function getMe(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, username: true },
  });

  if (!user) throw new UnauthorizedError("User does not exist");

  return res.status(200).json(user);
}