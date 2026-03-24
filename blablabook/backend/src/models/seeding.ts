import { prisma } from "../utils/prismaClient";
import { ReadingStatus } from "../../generated/prisma/enums";
import argon2 from "argon2";

async function main() {

  const hashedPassword = await argon2.hash("password123");

  // USERS
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      password: hashedPassword,
      username: 'alice',
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      password: hashedPassword,
      username: 'bob',
    },
  });

  // BOOKS
  const book1 = await prisma.book.create({
    data: {
      isbn: '9782070368228',
      openLibraryId: 'OL1M',
      title: "L'Étranger",
      author: 'Albert Camus',
      genre: 'Roman',
      description: 'Un classique de la littérature française.',
      publisher: 'Gallimard',
      pageCount: 185,
      language: 'fr',
      publishedYear: 1942,
    },
  });

  const book2 = await prisma.book.create({
    data: {
      isbn: '9780747532699',
      openLibraryId: 'OL2M',
      title: "Harry Potter à l'école des sorciers",
      author: 'J.K. Rowling',
      genre: 'Fantasy',
      description: 'Un jeune sorcier découvre ses pouvoirs.',
      publisher: 'Bloomsbury',
      pageCount: 223,
      language: 'fr',
      publishedYear: 1997,
    },
  });

  const book3 = await prisma.book.create({
    data: {
      isbn: '9780553380163',
      openLibraryId: 'OL3M',
      title: 'A Game of Thrones',
      author: 'George R. R. Martin',
      genre: 'Fantasy',
      description: 'Intrigues politiques et dragons.',
      publisher: 'Bantam Books',
      pageCount: 694,
      language: 'en',
      publishedYear: 1996,
    },
  });

  // LIBRARY ITEMS
  await prisma.library_item.createMany({
    data: [
      {
        userId: alice.id,
        bookId: book1.id,
        status: ReadingStatus.READ,
        rating: 5,
        review: 'Très marquant',
      },
      {
        userId: alice.id,
        bookId: book2.id,
        status: ReadingStatus.READING,
        rating: 4,
      },
      {
        userId: bob.id,
        bookId: book3.id,
        status: ReadingStatus.TO_READ,
      },
    ],
  });
}

main()
  .then(() => {
    console.log('🌱 Seeding terminé');
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });