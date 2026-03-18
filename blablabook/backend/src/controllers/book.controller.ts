import type { Request, Response } from "express";
import { OpenLibraryResponse } from "../../@types/express";

export async function getRandomBooks(req: Request, res: Response) {

  // TODO: fonction à peaufiner pour recherche aléatoire optimisée (date ou note par exemple)

  try {

    const page = Math.floor(Math.random() * 50);
    const limit = 4;
    const result = await fetch(`https://openlibrary.org/search.json?q=novel&page=${page}&limit=${limit}`, {
      headers: { "User-Agent": "MyAppName/1.0 (myemail@example.com)" }
    });

    const data: OpenLibraryResponse = await result.json();
    const { docs } = data;

    const selectedDatas = docs.map((doc) => ({
      author: doc.author_name?.[0] ?? null,
      authorId: doc.author_key?.[0] ?? null,
      title: doc.title,
      id: doc.key,
      coverThumbnail: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : null,
    }));

    return res.send(selectedDatas);

  } catch (err) {
    console.error(err);
  }
}


// TODO: fonction de recherche à optimiser par la suite (très lente pour le moment)
// TODO: Problème du au fait que "search?q=" ne renvoie pas subject (category)
export async function searchBooks(req: Request, res: Response) {
  const query = req.query.q as string;
  const limit = 15;

  try {
    const result = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`,
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
        : null
    }));

    const selectedDatasWithCategory = await Promise.all(
      selectedDatas.map(async (book) => {
        try {
          const url = `https://openlibrary.org${book.id}.json`;
          const resBook = await fetch(url, {
            headers: { "User-Agent": "MyAppName/1.0 (myemail@example.com)" }
          });
          const bookData = await resBook.json();

          return {
            ...book,
            category: bookData.subjects?.[0] ?? null
          };
        } catch (err) {
          console.error(`Error on fetching category for ${book.id}:`, err);
          return { ...book, category: null };
        }
      })
    );

    return res.send(selectedDatasWithCategory);
  } catch (err) {
    console.error("Error searchBooks:", err);
    return res.status(500).send({ error: "Error happened during the search" });
  }
}


export async function getBookById(req: Request, res: Response) {
  const id = req.params.openLibraryId;

  // Warning: la "key" renvoyée par l'api est sous la forme "work/id"
  const apiPath = `works/${id}`;
  if (!apiPath) return;

  try {

    const url = `https://openlibrary.org/${apiPath}.json`;
    const result = await fetch(url, {
      headers: { "User-Agent": "MyAppName/1.0 (contact@example.com)" }
    });
    const data = await result.json();

    const selectedDatas = {
      title: data.title,
      publishedYear: data.first_publish_date,
      category: data.subjects[0],
      description: data.description,
      authorId: data.authors[0].author.key.split("/")?.[2]
    };

    return res.send(selectedDatas);

  } catch (err) {
    console.error(err);
  }
}