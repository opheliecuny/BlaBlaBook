import type { Request, Response } from "express"; 

export async function getBooks(req: Request, res: Response) {

    const name = req.params.name; 

    try {
    const result = await fetch(`https://openlibrary.org/search.json?q=${name}`, {
      headers: { "User-Agent": "MyAppName/1.0 (myemail@example.com)" }
    });

    const data = await result.json()
    console.log(await data);
    res.send(data)

  } catch (err) {
    console.error(err);
  }
};

export async function getBooksByTitle(req: Request, res: Response) {

    const title = req.params.title; 

    try {
    const result = await fetch(`https://openlibrary.org/search.json?title=${title}`, {
      headers: { "User-Agent": "MyAppName/1.0 (myemail@example.com)" }
    });

    const data = await result.json()
    console.log(await data);
    res.send(data)

  } catch (err) {
    console.error(err);
  }
};

export async function getBooksByAuthor(req: Request, res: Response) {

    const author = req.params.author; 

    try {
    const result = await fetch(`https://openlibrary.org/search.json?author=${author}`, {
      headers: { "User-Agent": "MyAppName/1.0 (myemail@example.com)" }
    });

    const data = await result.json()
    console.log(await data);
    res.send(data)

  } catch (err) {
    console.error(err);
  }
};