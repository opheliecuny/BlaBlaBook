import { Router } from "express";
import * as libraryController from "../controllers/library.controller.ts";

export const router = Router(); 

router.get("/library", libraryController.getLibrary);
router.post("/library", libraryController.addBookToLibrary);
router.patch("/library/:id", libraryController.updateReadingStatus);
router.delete("/library/:id", libraryController.deleteBookFromLibrary);

