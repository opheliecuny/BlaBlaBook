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
            user: { id: string }
            locale: string
        }
    }
}

interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  author_key?: string[];
  cover_i?: number;
  first_publish_year?: number;
  cover_edition_key?: string; 
  lending_edition_s?: string;
  subject?: string[];
  isbn?: number[];
}

export interface OpenLibraryResponse {
  numFound: number;
  start: number;
  numFoundExact?: boolean;
  num_found?: number;
  documentation_url?: string;
  q?: string;
  offset?: number | null;
  docs: OpenLibraryDoc[];
}


export interface Token {
  token: string;
  type: string;
  expiresInMS: number;
}

