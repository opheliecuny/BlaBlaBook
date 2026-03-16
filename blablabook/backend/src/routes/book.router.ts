import { Router } from "express";
import * as booksController from "../controllers/book.controller.ts";

export const router = Router(); 

router.get("/books", booksController.getRandomBooks);
router.get("/books/search", booksController.searchBooks);
router.get("/books/:openLibraryId", booksController.getBookById);