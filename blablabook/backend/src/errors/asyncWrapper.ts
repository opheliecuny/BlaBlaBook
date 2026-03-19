import { Request, Response, NextFunction, RequestHandler } from "express";
import { transformError } from "./transformError";

// wrapper : attrape toutes les erreurs async et les transmet à transformError
export const asyncWrapper =
  (fn: RequestHandler): RequestHandler =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        next(transformError(error, req));
      }
    };