import { Router } from "express"; 
// import { router as userRouter } from "./user.router.ts";
// import { router as authRouter } from "./auth.router.ts"; 
import { router as booksRouter } from "./book.router.ts";
// import { router as libraryRouter } from "./library.router.ts";

export const router = Router(); 

// router.use(userRouter);
// router.use(authRouter);
router.use(booksRouter);
// router.use(libraryRouter);