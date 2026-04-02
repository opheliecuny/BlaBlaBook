import { Router } from "express";
import * as booksController from "../controllers/book.controller";
import { asyncWrapper } from "../errors/asyncWrapper";
import { searchRateLimit } from "../middlewares/rateLimit.middleware";
import { optionalAuth } from "../middlewares/auth.middleware";

export const router = Router();

router.get("/books", optionalAuth, asyncWrapper(booksController.getRandomBooks));
router.get("/books/search", searchRateLimit, asyncWrapper(booksController.searchBooks));
router.get("/books/suggest", asyncWrapper(booksController.suggestBooks));
router.get("/books/:openLibraryId", asyncWrapper(booksController.getBookById));