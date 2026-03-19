import type { Request, Response } from "express";
import z from "zod";
import argon2 from "argon2";
import { generateAuthenticationTokens, saveRefreshTokenInDatabase, setAccessTokenCookie, setRefreshTokenCookie, replaceRefreshTokenInDatabase } from "../utils/token";
import { prisma } from "../utils/prismaClient";

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

  await saveRefreshTokenInDatabase(refreshToken, user);

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

// TODO Décider si on envoie le token dans le body ou les cookies (pas les deux) 

  return res.status(201).json({
    id: user.id,
    email: user.email,
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

export async function logoutUser(req: Request, res: Response) {
  const userId = req.user?.id; 

  if (userId) {
    await prisma.refresh_token.deleteMany({ where: {userId: userId }}); 
  }

  res.cookie("accessToken", "", { httpOnly: true, maxAge: 0 });
  res.cookie("refreshToken", "", { httpOnly: true, maxAge: 0 });

  res.status(204).json({ message: "Successfully logged out"}); 
}