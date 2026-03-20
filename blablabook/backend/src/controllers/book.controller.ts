import type { Request, Response } from "express";
import { OpenLibraryResponse } from "../../@types/express";

export async function getRandomBooks(req: Request, res: Response) {
  try {
    const page = Math.floor(Math.random() * 50);
    const limit = 4;

    const result = await fetch(
      `https://openlibrary.org/search.json?q=novel&page=${page}&limit=${limit}&fields=key,title,author_name,author_key,cover_i,first_publish_year,isbn`,
      { headers: { "User-Agent": "MyAppName/1.0 (myemail@example.com)" } }
    );

    const data: OpenLibraryResponse = await result.json();
    const { docs } = data;

    const selectedDatas = docs.map((doc) => ({
      author: doc.author_name?.[0] ?? null,
      authorId: doc.author_key?.[0] ?? null,
      title: doc.title,
      id: doc.key,
      isbn: doc.isbn?.[0] ?? null,
      coverThumbnail: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : null,
    }));

    return res.send(selectedDatas);
  } catch (err) {
    console.error(err);
  }
}

export async function searchBooks(req: Request, res: Response) {
  const query = req.query.q as string;
  const limit = 15;

  try {
    // Un seul fetch, tout est dedans
    const result = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=key,title,author_name,author_key,cover_i,first_publish_year,subject,isbn`,
      { headers: { "User-Agent": "MyAppName/1.0 (myemail@example.com)" } }
    );

    const data: OpenLibraryResponse = await result.json();
    const { docs } = data;

    const selectedDatas = docs.map((doc) => ({
      id: doc.key,
      title: doc.title,
      author: doc.author_name?.[0] ?? null,
      authorId: doc.author_key?.[0] ?? null,
      publishedYear: doc.first_publish_year ?? null,
      coverThumbnail: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : null,
      category: doc.subject?.[0] ?? null,
      isbn: doc.isbn?.[0] ?? null,
    }));

    return res.send(selectedDatas);
  } catch (err) {
    console.error("Error searchBooks:", err);
    return res.status(500).send({ error: "Error happened during the search" });
  }
}
export async function getBookById(req: Request, res: Response) {
  const id = req.params.openLibraryId;
  if (!id) return;

  try {
    const result = await fetch(
      `https://openlibrary.org/search.json?q=key:/works/${id}&fields=key,title,first_publish_year,subject,isbn,author_key,author_name,description`,
      { headers: { "User-Agent": "MyAppName/1.0 (contact@example.com)" } }
    );

    const data = await result.json();
    const doc = data.docs?.[0];

    if (!doc) {
      return res.status(404).send({ error: "Book not found" });
    }

    const selectedDatas = {
      title: doc.title,
      publishedYear: doc.first_publish_year ?? null,
      category: doc.subject?.[0] ?? null,
      description: doc.description ?? null,
      authorId: doc.author_key?.[0] ?? null,
      author: doc.author_name?.[0] ?? null,
      isbn: doc.isbn?.[0] ?? null,
    };

    return res.send(selectedDatas);
  } catch (err) {
    console.error(err);
  }
}