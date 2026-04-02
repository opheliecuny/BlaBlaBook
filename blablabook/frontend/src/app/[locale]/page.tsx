import Image from "next/image";
import { cookies } from "next/headers";
import { Bookmark } from "lucide-react";
import HeroCTAs from "@/components/HeroCTAs";
import { getTranslations } from "next-intl/server";
import RandomBooksSection from "@/components/RandomBooksSection";
import type { BookSearchResult } from "@/types/book";

async function fetchRandomBooks(): Promise<BookSearchResult[]> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

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
  const randomBooks = await fetchRandomBooks();
  const t = await getTranslations("home");

  return (
    <div>
      {/* Hero */}
      <section className="relative mx-auto flex flex-col items-center gap-12 overflow-hidden px-6 py-10 sm:max-w-7xl sm:flex-row sm:px-12">
        <div className="bg-card/60 relative z-10 mt-6 max-w-[83%] flex-1 rounded-xl p-6 backdrop-blur-sm sm:mt-0 sm:bg-transparent sm:px-0">
          <span
            className="tag-terracotta-filled mb-4 hidden items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold sm:inline-flex dark:bg-secondary">
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
        <div className="min-h-220px absolute inset-0 z-0 mx-6 mt-6 self-stretch overflow-hidden rounded-xl sm:relative sm:mx-0 sm:mt-0 sm:flex-1 sm:shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
          <Image
            src="/book-pile.jpg"
            alt="Pile de livres"
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            priority
            className="object-cover sm:opacity-100"
          />
        </div>
      </section>

      {/* Livres du moment — Version Feature (plus propre) */}
      <RandomBooksSection initialBooks={randomBooks} />

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
              className="h-10 w-full rounded-full bg-(--accent-alt) px-8 text-sm font-semibold text-white hover:bg-(--accent-alt-hover) sm:w-auto"
            >
              {t("cta.search.button")}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
