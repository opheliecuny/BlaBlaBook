import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";
import z from "zod";

// GET /library ; bibliohtèque de l'utilisateur connecté

export async function getLibrary(req: Request, res: Response) {
  const userId = req.user.id;
  const library = await prisma.library_item.findMany({
    where: { userId },
    include: { book: true }
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
  const book = await prisma.book.upsert({
    where: {
      isbn: bookData.isbn
    },
    update: {},
    create: {
      isbn: bookData.isbn,
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

//! le front devra gérer la récupéartion et le stockage de l'id du livre lors de la récupération de la bibliothèque
// PATCH /library/:id ; modifier le statut de lecture d'un livre de la bibliothèque de l'utilisateur connecté

export async function updateReadingStatus(req: Request, res: Response) {
  try {
    const userId = req.user.id;
  
    const paramsSchema = z.object({
      id: z.string().min(1)
    });
  
    const bodySchema = z.object({
      status: z.enum(["TO_READ", "READING", "READ"])
    });
  
    const { id: bookId } = paramsSchema.parse(req.params);
    const { status } = bodySchema.parse(req.body);
  
    const libraryItem = await prisma.library_item.update({
      where: {
        userId_bookId: {
          userId,
          bookId
        }
      },
      data: {
        status
      }
    });
  
    return res.status(200).json(libraryItem);
  } catch (error) {
    console.error("Error updating reading status:", error);
    return res.status(400).json({ error: "Invalid request data" });
  }
}

// DELETE /library/:id ; supprimer un livre de la bibliothèque de l'utilisateur connecté

export async function deleteBookFromLibrary(req: Request, res: Response) {
  const userId = req.user.id;

  const paramsSchema = z.object({
    id: z.string().min(1)
  });

  const { id: bookId } = paramsSchema.parse(req.params);

  await prisma.library_item.delete({
    where: {
      userId_bookId: {
        userId,
        bookId
      }
    }
  });

  return res.status(204).send();
}