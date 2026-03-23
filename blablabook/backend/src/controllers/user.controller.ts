import type { Request, Response } from "express";
import z from "zod";
import { prisma } from "../utils/prismaClient";
import argon2 from "argon2";

export async function updateUser(req: Request, res: Response) {

  const updateUserBodySchema = z.object({
    email: z.email().optional(),
    password: z.string()
      .min(8, "password should have at least 8 caracters") // CNIL recommande plutôt 12 caractères
      .max(100, "password should have at most 100 caracters")
      .regex(/[a-z]/, "password should contain at least a lowercase caracter")
      .regex(/[A-Z]/, "password should contain at least a uppercase caracter")
      .optional(),
    username: z.string().min(1).optional()
  });

  try {
    const data = await updateUserBodySchema.parseAsync(req.body);

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        // Le NOT pour que l'utilisateur ne trouve pas son propre compte et stop tout le process
        where: { email: data.email, NOT: {id: userId} }
      });
      if (existingUser) {
        return res.status(400).json("Email already in use by another account");
      }
    }

    if (data.password) {
      data.password = await argon2.hash(data.password);
    }

    const updatedUser = await prisma.user.update({ where: { id: userId }, data });

    return res.status(200).json({ message: "User updated successfully", user: updatedUser });
  }


  catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }

}

export async function deleteUser(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Supprimer les refresh tokens de l'utilisateur
    await prisma.refresh_token.deleteMany({
      where: { userId }
    });

    // Supprimer l'utilisateur (les library_items seront supprimés en cascade)
    await prisma.user.delete({
      where: { id: userId }
    });

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}