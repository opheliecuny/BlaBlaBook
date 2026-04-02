import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL!;
const LOCALES = ["fr", "en"];

const STATIC_ROUTES = [
  { path: "",         priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/search",  priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/cgu",     priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/legal",   priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.flatMap(({ path, priority, changeFrequency }) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }))
  );
}