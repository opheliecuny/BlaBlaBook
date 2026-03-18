import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import * as libraryController from "../controllers/library.controller";

export const router = Router(); 

router.get("/library", isAuthenticated, libraryController.getLibrary);
router.post("/library", isAuthenticated, libraryController.addBookToLibrary);
router.patch("/library/:id", isAuthenticated, libraryController.updateReadingStatus);
router.delete("/library/:id", isAuthenticated, libraryController.deleteBookFromLibrary);
