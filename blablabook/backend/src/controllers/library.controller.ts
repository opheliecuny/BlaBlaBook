import 'dotenv/config';
import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";

// GET /library ; bibliohtèque de l'utilisateur connecté

export async function getLibrary(req: Request, res: Response) {
  const userId = req.userId; // En supposant que l'ID de l'utilisateur est stocké dans req.userId après authentification

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
// PATCH /library/:id ; modifier le statut de lecture d'un livre de la bibliothèque de l'utilisateur connecté
// DELETE /library/:id ; supprimer un livre de la bibliothèque de l'utilisateur connecté