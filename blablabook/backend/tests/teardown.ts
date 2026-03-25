import { prisma } from "../src/utils/prismaClient";

export async function teardown() {
  await prisma.$disconnect();
}
