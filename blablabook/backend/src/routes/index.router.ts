import { Router } from "express"; 
import { router as userRouter } from "./user.router";
import { router as authRouter } from "./auth.router"; 
import { router as booksRouter } from "./book.router";
import { router as libraryRouter } from "./library.router";

export const router = Router(); 

router.use(userRouter);
router.use(authRouter);
router.use(booksRouter);
router.use(libraryRouter);