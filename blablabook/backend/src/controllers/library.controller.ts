import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";
import z from "zod";

// GET /library ; bibliohtèque de l'utilisateur connecté

export async function getLibrary(req: Request, res: Response) {
  const userId = req.user.id; // TODO : s'assurer que ça colle avec l'authentification

  const library = await prisma.library_item.findMany({
    where: {
      userId
    },
    include: {
      // TODO : sélectionner les détails pertinents du livre (titre, auteur, etc.)
      book: true
    }
  });

  const books = library.map(item => ({
    ...item.book,
    status: item.status
  }));

  res.json(books);
}

// POST /library ; ajouter un livre à la bibliothèque de l'utilisateur connecté

export async function addBookToLibrary(req: Request, res: Response) {
  const userId = req.user.id;

  const postBookBodySchema = z.object({
    isbn: z.string(),
    openLibraryId: z.string().optional(),
    title: z.string(),
    author: z.string().optional(),
    genre: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    publisher: z.string().optional(),
    pageCount: z.number().optional(),
    language: z.string().optional(),
    publishedYear: z.number().optional(),
    status: z.enum(["TO_READ", "READING", "READ"]).optional()
  });

  const bookData = postBookBodySchema.parse(req.body);

  const book  = await prisma.book.upsert({
    where: {
      isbn: bookData.isbn
    },
    update: {},
    create: {
      isbn : bookData.isbn,
      openLibraryId: bookData.openLibraryId,
      title: bookData.title,
      author: bookData.author,
      genre: bookData.genre,
      description: bookData.description,
      thumbnail: bookData.thumbnail,
      publisher: bookData.publisher,
      pageCount: bookData.pageCount,
      language: bookData.language,
      publishedYear: bookData.publishedYear
    }
  });

  const libraryItem = await prisma.library_item.create({
    data: {
      userId,
      bookId: book.id,
      status: bookData.status || "TO_READ" // statut par défaut
    }
  });

  res.json(libraryItem);
}

// PATCH /library/:id ; modifier le statut de lecture d'un livre de la bibliothèque de l'utilisateur connecté
// DELETE /library/:id ; supprimer un livre de la bibliothèque de l'utilisateur connecté