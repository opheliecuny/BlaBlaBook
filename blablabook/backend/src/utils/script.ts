// vérifie la connexion à la bdd
// pour exécuter ce script : npx tsx chemin/vers/script.ts

// imports à utiliser pour se connecter à la bdd et faire des requêtes
import "dotenv/config";
import { prisma } from "./prismaClient";

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());