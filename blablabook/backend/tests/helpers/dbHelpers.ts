import { prisma } from "../../src/utils/prismaClient";
import argon2 from "argon2";

/**
 * Nettoie toutes les tables de la base de données de test
 */
export async function cleanDatabase() {
  await prisma.refresh_token.deleteMany();
  await prisma.library_item.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();
}

/**
 * Crée un utilisateur de test
 */
export async function createTestUser(data?: {
  email?: string;
  password?: string;
  username?: string;
}) {
  const hashedPassword = await argon2.hash(data?.password || "TestPassword123!");

  return prisma.user.create({
    data: {
      email: data?.email || "test@example.com",
      password: hashedPassword,
      username: data?.username || "testuser",
    },
  });
}
