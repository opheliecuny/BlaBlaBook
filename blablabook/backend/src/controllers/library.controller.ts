import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";
import z from "zod";

// GET /library ; bibliothèque de l'utilisateur connecté

const SORT_FIELDS = ["createdAt", "updatedAt", "title"] as const;

export async function getLibrary(req: Request, res: Response) {
  const userId = req.user.id;

  const querySchema = z.object({
    page:  z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sort:  z.enum(SORT_FIELDS).default("createdAt"),
    order: z.enum(["asc", "desc"]).default("desc"),
  });

  const { page, limit, sort, order } = querySchema.parse(req.query);
  const skip = (page - 1) * limit;

  const orderBy = sort === "title"
    ? { book: { title: order } }
    : { [sort]: order };

  const [library, total] = await Promise.all([
    prisma.library_item.findMany({
      where: { userId },
      include: { book: true },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.library_item.count({ where: { userId } }),
  ]);

  const books = library.map(item => ({
    ...item.book,
    bookId: item.bookId,
    status: item.status,
    rating: item.rating,
    review: item.review,
  }));

  res.json({ data: books, total, page, limit, totalPages: Math.ceil(total / limit) });
}

// POST /library ; ajouter un livre à la bibliothèque de l'utilisateur connecté

export async function addBookToLibrary(req: Request, res: Response) {
  const userId = req.user.id;
  const postBookBodySchema = z.object({
    openLibraryId: z.string().optional(),
    isbn: z.string().optional(),
    title: z.string(),
    author: z.string().optional(),
    genre: z.string().optional(),
    description: z.string().max(2000).optional(),
    thumbnail: z.string().optional(),
    publisher: z.string().optional(),
    pageCount: z.number().optional(),
    language: z.string().optional(),
    publishedYear: z.number().optional(),
    status: z.enum(["TO_READ", "READING", "READ"]).optional()
  }).refine(data => data.openLibraryId || data.isbn, {
    message: "openLibraryId or isbn is required"
  });

  const bookData = postBookBodySchema.parse(req.body);
  const resolvedIsbn = bookData.isbn ?? `ol-${bookData.openLibraryId}`;

  const bookCreateData = {
    isbn: resolvedIsbn,
    openLibraryId: bookData.openLibraryId,
    title: bookData.title,
    author: bookData.author,
    genre: bookData.genre,
    description: bookData.description,
    thumbnail: bookData.thumbnail,
    publisher: bookData.publisher,
    pageCount: bookData.pageCount,
    language: bookData.language,
    publishedYear: bookData.publishedYear,
  };

  const thumbnailUpdate = bookData.thumbnail ? { thumbnail: bookData.thumbnail } : {};

  const book = bookData.openLibraryId
    ? await prisma.book.upsert({
      where: { openLibraryId: bookData.openLibraryId },
      update: thumbnailUpdate,
      create: bookCreateData,
    })
    : await prisma.book.upsert({
      where: { isbn: bookData.isbn! },
      update: thumbnailUpdate,
      create: bookCreateData,
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

export async function updateLibraryItem(req: Request, res: Response) {
  const userId = req.user.id;

  const paramsSchema = z.object({
    id: z.string().min(1)
  });

  const bodySchema = z.object({
    status: z.enum(["TO_READ", "READING", "READ"]).optional(),
    rating: z.number().int().min(1).max(5).nullable().optional(),
    review: z.string().max(2000).nullable().optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field (status, rating, review) must be provided"
  });

  const { id: bookId } = paramsSchema.parse(req.params);
  const data = bodySchema.parse(req.body);

  const libraryItem = await prisma.library_item.update({
    where: {
      userId_bookId: {
        userId,
        bookId
      }
    },
    data
  });

  return res.status(200).json(libraryItem);
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
