import { Router } from "express"; 
import { router as booksRouter } from "./book.service.ts"

export const router = Router(); 

router.use(booksRouter);