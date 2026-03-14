import { Router } from "express";
import * as booksController from "../controllers/book.controller.ts";

export const router = Router(); 

router.get("/books/:name", booksController.getBooks);
router.get("/books-by-title/:title", booksController.getBooksByTitle);
router.get("/books-by-author/:author", booksController.getBooksByAuthor);