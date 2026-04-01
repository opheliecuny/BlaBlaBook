import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import { router as authRouter } from "../../src/routes/auth.router";
import { router as userRouter } from "../../src/routes/user.router";
import { router as libraryRouter } from "../../src/routes/library.router";
import { router as bookRouter } from "../../src/routes/book.router";
import { errorHandler } from "../../src/middlewares/errorHandler";

/**
 * Crée une application Express de test avec toutes les routes
 */
export function createTestServer(): Express {
  const app = express();

  // Middlewares
  app.use(express.json());
  app.use(cookieParser());

  // Routes
  app.use(authRouter);
  app.use(userRouter);
  app.use(libraryRouter);
  app.use(bookRouter);

  // Error handler (doit être après les routes)
  app.use(errorHandler);

  return app;
}

/**
 * Instance unique de l'application de test
 */
export const app = createTestServer();
