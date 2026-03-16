import type { Request, Response } from "express";

export async function getRandomBooks(req: Request, res: Response) {

  // TODO: fonction à peaufiner pour recherche aléatoire optimisée (date ou note par exemple)

  try {

    const page = Math.floor(Math.random() * 50);
    const limit = 4;
    const result = await fetch(`https://openlibrary.org/search.json?q=novel&page=${page}&limit=${limit}`, {
      headers: { "User-Agent": "MyAppName/1.0 (myemail@example.com)" }
    });

    const data = await result.json();
    const { docs } = data;

    const selectedDatas = docs.map((doc) => ({ author: doc.author_name, authorId: doc.author_key, title: doc.title }));

    res.send(selectedDatas);

  } catch (err) {
    console.error(err);
  }
}


// TODO: fonction de recherche à optimiser par la suite pour plus de précision si possible
export async function searchBooks(req: Request, res: Response) {

  const query = req.query.q;
  const limit = 100;

  try {
    const result = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=${limit}`, {
      headers: { "User-Agent": "MyAppName/1.0 (myemail@example.com)" }
    });

    const data = await result.json();
    const { docs } = data;

    const selectedDatas = docs.map((doc) => ({
      id: doc.key,
      title: doc.title,
      author: doc.author_name?.[0],
      authorId: doc.author_key?.[0],
      publishedYear: doc.first_publish_year,
      coverThumbnail: `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`

      // TODO: genre à prendre depuis le fetch par ID car pas dispo dans le resultat ci-dessus

    }));

    res.send(selectedDatas);

  } catch (err) {
    console.error(err);
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

    const selectedDatas = {title: data.title, 
      publishedYear: data.first_publish_date,
      categories: data.subjects,
      description: data.description,
      authorId: data.authors[0].author.key.split("/")?.[2]
    };

    res.send(selectedDatas);

  } catch (err) {
    console.error(err);
  }
}