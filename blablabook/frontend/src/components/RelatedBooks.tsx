// components/RelatedBooks.tsx
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { getTranslations } from "next-intl/server";

interface RelatedBook {
  id: string;
  title: string;
  author: string | null;
  coverThumbnail: string | null;
}

async function fetchRelatedBooks(
  authorId: string | null,
): Promise<RelatedBook[]> {
  try {
    const query = authorId ? `?authorId=${authorId}` : "";
    const res = await fetch(`${process.env.API_URL}/books${query}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function RelatedBooks({
  authorId,
}: {
  authorId: string | null;
}) {
  const tBooks = await getTranslations("book");
  const relatedBooks = await fetchRelatedBooks(authorId);

  if (!relatedBooks.length) {
    return (
      <div className="text-muted-foreground pt-10 text-center">
        {tBooks("error.loadingBooks")}
      </div>
    );
  }

  return (
    <div className="relative">
      <ul className="flex gap-10 overflow-x-auto scroll-smooth pt-8 pb-4">
        {relatedBooks.length > 0 ? (
          relatedBooks.map((book, i) => {
            const bookId = book.id?.split("/").pop() ?? null;
            return (
              <li key={i} className="w-40 shrink-0 sm:w-48">
                <BookCover
                  src={book.coverThumbnail}
                  alt={`Couverture de ${book.title}`}
                  className="aspect-2/3 w-full rounded-xl object-cover shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                />
                <div className="mt-3 flex flex-1 flex-col">
                  <h3 className="font-playfair text-base leading-snug font-bold">
                    {book.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {book.author ?? tBooks("unknownAuthor")}
                  </p>
                  <div className="mt-auto pt-4">
                    <Link
                      href={
                        bookId
                          ? `/book/${bookId}`
                          : `/search?q=${encodeURIComponent(book.title)}`
                      }
                      className="inline-flex w-full items-center justify-center rounded-md bg-(--color-btn-subtle) px-3 py-1.5 text-xs font-medium hover:bg-(--color-btn-subtle-hover) active:bg-(--color-btn-subtle-active) dark:bg-gray-800"
                      aria-label={tBooks("book.viewDetailAriaLabel", {
                        title: book.title,
                      })}
                    >
                      {tBooks("book.viewDetail")}
                    </Link>
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <div
            className="border-border col-span-full my-17 flex flex-col items-center rounded-xl border p-12"
            role="status"
          >
            <p className="text-muted-foreground col-span-full text-center">
              {tBooks("error.loadingBooks")}
            </p>
            <p className="text-muted-foreground col-span-full text-center">
              {tBooks("error.tryAgain")}
            </p>
          </div>
        )}
      </ul>
      <div className="from-background pointer-events-none absolute top-0 right-0 h-full w-12 bg-linear-to-l to-transparent" />
    </div>
  );
}
