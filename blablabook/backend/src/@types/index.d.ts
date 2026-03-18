import { user } from "../../generated/prisma/client";

export interface IBook {
  id: string;
  isbn: string;
  openLibraryId: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  thumbnail: string;
  publisher: string;
  pageCount: number;
  language: string;
  publishedYear: number;
}

declare global {
    namespace Express {
        interface Request {
            user : user
        }
    }
}