import { Router } from "express";
import * as booksController from "../controllers/book.controller";
import { asyncWrapper } from "../errors/asyncWrapper";

export const router = Router(); 

router.get("/books", asyncWrapper(booksController.getRandomBooks));
router.get("/books/search", asyncWrapper(booksController.searchBooks));
router.get("/books/:openLibraryId", asyncWrapper(booksController.getBookById));