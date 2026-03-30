import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import * as libraryController from "../controllers/library.controller";
import { asyncWrapper } from "../errors/asyncWrapper";

export const router = Router(); 

router.get("/library", isAuthenticated, asyncWrapper(libraryController.getLibrary));
router.post("/library", isAuthenticated, asyncWrapper(libraryController.addBookToLibrary));
router.patch("/library/:id", isAuthenticated, asyncWrapper(libraryController.updateLibraryItem));
router.delete("/library/:id", isAuthenticated, asyncWrapper(libraryController.deleteBookFromLibrary));
