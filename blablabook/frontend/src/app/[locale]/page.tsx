import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { Bookmark } from "lucide-react";
import BookCover from "@/components/BookCover";
import HeroCTAs from "@/components/HeroCTAs";
import HomepageAddButton from "@/components/HomepageAddButton";
import { getTranslations } from "next-intl/server";

interface RandomBook {
  id: string;
  title: string;
  author: string | null;
  coverThumbnail: string | null;
}

async function fetchRandomBooks(accessToken?: string): Promise<RandomBook[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/books`, {
      cache: "no-store",
      headers: accessToken ? { Cookie: `accessToken=${accessToken}` } : {},
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const isLoggedIn = !!accessToken;
  const randomBooks = await fetchRandomBooks(accessToken);
  const t = await getTranslations("home");

  return (
    <div>
      {/* Hero */}
      <section className="relative mx-auto flex flex-col items-center gap-12 overflow-hidden px-6 py-10 sm:max-w-7xl sm:flex-row sm:px-12">
        <div className="bg-card/60 relative z-10 mt-6 max-w-[83%] flex-1 rounded-xl p-6 backdrop-blur-sm sm:mt-0 sm:bg-transparent sm:px-0">
          <span
            className="tag-terracotta-filled mb-4 hidden items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold sm:inline-flex dark:bg-gray-800"
            style={{ color: "#E8927A" }}
          >
            <Bookmark size={11} aria-hidden="true" />
            {t("hero.taglineShort")}
          </span>
          <h1 className="mt-3 mb-4 text-center text-4xl font-normal text-shadow-xs sm:text-left sm:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="font-inter mt-8 mb-8 max-w-md text-center text-[0.9375rem] leading-tight normal-case drop-shadow-[0_1px_2px_rgba(30,64,175,0.25)] sm:text-justify sm:drop-shadow-none">
            {t("hero.description")}
          </p>
          <HeroCTAs />
        </div>
        <div className="absolute inset-0 z-0 mx-6 mt-6 min-h-[220px] self-stretch overflow-hidden rounded-xl sm:relative sm:mx-0 sm:mt-0 sm:flex-1 sm:shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
          <Image
            src="/book-pile.jpg"
            alt="Pile de livres"
            fill
            sizes="(max-width: 640px) 100 vw, 50vw"
            priority
            className="object-cover sm:opacity-100"
          />
        </div>
      </section>

      {/* Livres du moment */}
      <section
        aria-labelledby="livres-du-moment"
        className="mx-auto px-5 py-8 sm:max-w-7xl sm:px-10"
      >
        <div className="mt-8 mb-8 px-2 sm:mt-0 sm:mb-0">
          <h2
            id="livres-du-moment"
            className="mb-1 text-center text-2xl font-bold sm:text-left"
          >
            {t("section.moment.title")}
          </h2>
          <p className="text-muted-foreground text-center text-xs tracking-widest sm:text-left">
            {isLoggedIn
              ? t("section.moment.subtitlePersonalized")
              : t("section.moment.subtitle")}
          </p>
        </div>
        <div className="mx-auto">
          <ul className="grid grid-cols-2 md:grid-cols-4">
            {randomBooks.length > 0 ? (
              randomBooks.map((book, i) => {
                const bookId = book.id?.split("/").pop() ?? null;
                return (
                  <li key={i} className="flex flex-col p-3 sm:p-8">
                    <BookCover
                      src={book.coverThumbnail}
                      alt={`Couverture de ${book.title}`}
                      className="aspect-[2/3] w-full rounded-xl object-cover shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                    />
                    <div className="mt-3 flex flex-1 flex-col">
                      <h3 className="font-playfair text-base leading-snug font-bold">
                        {book.title}
                      </h3>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {book.author ?? "Auteur inconnu"}
                      </p>
                      <div className="mt-auto pt-4 flex flex-col lg:flex-row gap-2 w-full">
                        <Link
                          href={
                            bookId
                              ? `/book/${bookId}`
                              : `/search?q=${encodeURIComponent(book.title)}`
                          }
                          className="flex items-center justify-center rounded-md bg-[var(--color-btn-subtle)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--color-btn-subtle-hover)] active:bg-[var(--color-btn-subtle-active)] dark:bg-gray-800 grow"
                          aria-label={t("book.viewDetailAriaLabel", { title: book.title })}
                        >
                          {t("book.viewDetail")}
                        </Link>
                        {bookId && (
                          <HomepageAddButton
                            bookId={bookId}
                            title={book.title}
                            author={book.author}
                            thumbnail={book.coverThumbnail}
                          />
                        )}
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
                  {t("error.loadingBooks")}
                </p>
                <p className="text-muted-foreground col-span-full text-center">
                  {t("error.tryAgain")}
                </p>
              </div>
            )}
          </ul>
        </div>
      </section>

      {/* CTA Recherche */}
      <section className="mx-auto px-6 py-8 sm:max-w-7xl sm:px-12">
        <div className="bg-primary/5 border-primary/20 flex w-full flex-col items-center gap-6 rounded-xl border p-12">
          <h2 className="text-center text-2xl font-bold">
            {t("cta.search.title")}
          </h2>
          <form
            role="search"
            action="/search"
            className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
          >
            <label htmlFor="search" className="sr-only">
              {t("cta.search.placeholder")}
            </label>
            <input
              id="search"
              name="q"
              type="text"
              placeholder={t("cta.search.placeholder")}
              className="border-border focus:border-primary bg-card h-10 w-full rounded-full border px-4 text-sm outline-none sm:flex-1"
              autoComplete="off"
            />
            <button
              type="submit"
              className="h-10 w-full rounded-full bg-[var(--accent-alt)] px-8 text-sm font-semibold text-white hover:bg-[var(--accent-alt-hover)] sm:w-auto"
            >
              {t("cta.search.button")}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
