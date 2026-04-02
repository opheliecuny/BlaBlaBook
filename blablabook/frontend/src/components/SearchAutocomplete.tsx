"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Suggestion {
  id: string;
  title: string;
  author: string | null;
  coverThumbnail: string | null;
}

interface Props {
  defaultValue?: string;
}

export default function SearchAutocomplete({ defaultValue = "" }: Props) {
  const t = useTranslations("search");
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const fetchSuggestions = useCallback(async (value: string, id: number) => {
    // Abort previous request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/books/suggest?q=${encodeURIComponent(value)}`,
        { signal: controller.signal },
      );
      if (id !== requestIdRef.current) return;
      if (!res.ok) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }
      const results: Suggestion[] = await res.json();
      if (id !== requestIdRef.current) return;

      setSuggestions(results);
      setIsOpen(results.length > 0);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (id === requestIdRef.current) {
        setSuggestions([]);
        setIsOpen(false);
      }
    } finally {
      if (id === requestIdRef.current) setIsLoading(false);
    }
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    setActiveIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = value.trim();
    if (trimmed.length < 4) {
      // Cancel any pending request
      if (abortRef.current) abortRef.current.abort();
      requestIdRef.current++;
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    const id = ++requestIdRef.current;
    debounceRef.current = setTimeout(() => fetchSuggestions(trimmed, id), 300);
  }

  function handleSelect(suggestion: Suggestion) {
    const bookId = suggestion.id.split("/").pop() ?? suggestion.id;
    setIsOpen(false);
    setQuery(suggestion.title);
    router.push(`/book/${bookId}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <label htmlFor="search-input" className="sr-only">
        {t("labelSearch")}
      </label>
      <Search
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <input
        id="search-input"
        name="q"
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        placeholder={t("placeholderSearch")}
        className="border-border focus:border-primary h-10 w-full rounded-full border pr-4 pl-9 text-sm outline-none"
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        aria-controls="search-suggestions"
        aria-activedescendant={
          activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
        }
      />
      {isLoading && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <div className="border-muted-foreground/30 border-t-primary h-4 w-4 animate-spin rounded-full border-2" />
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          className="border-border absolute top-full z-50 mt-1 w-full overflow-hidden rounded-xl border bg-white shadow-lg dark:bg-gray-900"
        >
          {suggestions.map((s, i) => {
            const bookId = s.id.split("/").pop() ?? s.id;
            const coverUrl =
              s.coverThumbnail ??
              (bookId.startsWith("OL")
                ? `https://covers.openlibrary.org/b/olid/${bookId}-S.jpg`
                : null);
            return (
              <li
                key={s.id}
                id={`suggestion-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm ${
                  i === activeIndex ? "bg-primary/10" : "hover:bg-muted"
                }`}
                onMouseDown={() => handleSelect(s)}
                onMouseEnter={() => setActiveIndex(i)}
              >
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt="{s.title}"
                    width={28}
                    height={40}
                    className="h-10 w-7 shrink-0 rounded object-cover"
                  />
                ) : (
                  <div className="bg-muted h-10 w-7 shrink-0 rounded" />
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium">{s.title}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {s.author ?? t("unknownAuthor")}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
