import type { Request, Response } from "express";
import z from "zod";
import { prisma } from "../utils/prismaClient";
import argon2 from "argon2";
import { ConflictError, UnauthorizedError } from "@/errors";

export async function getUserProfile(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) throw new UnauthorizedError("User is not authenticated");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  if (!user) {
    throw new UnauthorizedError("User does not exist");
  }

  return res.status(200).json(user);
}

export async function updateUser(req: Request, res: Response) {

  const updateUserBodySchema = z.object({
    email: z.email().optional(),
    password: z.string()
      .min(8, "password should have at least 8 caracters") // CNIL recommande plutôt 12 caractères
      .max(100, "password should have at most 100 caracters")
      .regex(/[a-z]/, "password should contain at least a lowercase caracter")
      .regex(/[A-Z]/, "password should contain at least a uppercase caracter")
      .optional(),
    currentPassword: z.string().optional(),
    username: z.string().min(1).optional()
  }).refine(
    (data) => !data.password || data.currentPassword,
    { message: "Current password is required to set a new password", path: ["currentPassword"] }
  );

  const data = await updateUserBodySchema.parseAsync(req.body);

  const userId = req.user?.id;
  if (!userId) throw new UnauthorizedError("User is not authenticated");

  if (data.email) {
    const existingUser = await prisma.user.findFirst({
      // Le NOT pour que l'utilisateur ne trouve pas son propre compte et stop tout le process
      where: { email: data.email, NOT: {id: userId} }
    });
    if (existingUser) {
      throw new ConflictError("Email already in use by another account");
    }
  }

  if (data.password) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isCurrentPasswordValid = await argon2.verify(user.password, data.currentPassword!);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    data.password = await argon2.hash(data.password);
  }

  const { currentPassword: _currentPassword, ...updateData } = data;

  const updatedUser = await prisma.user.update({ where: { id: userId }, data: updateData });

  return res.status(200).json({ message: "User updated successfully", user: updatedUser });

}

export async function deleteUser(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) throw new UnauthorizedError("User is not authenticated");

  // Supprimer les refresh tokens de l'utilisateur
  await prisma.refresh_token.deleteMany({
    where: { userId }
  });

  // Supprimer l'utilisateur (les library_items seront supprimés en cascade)
  await prisma.user.delete({
    where: { id: userId }
  });

  return res.status(204).send();
}