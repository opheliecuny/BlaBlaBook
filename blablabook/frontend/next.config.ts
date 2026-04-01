import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Le proxy /api/* est géré par src/app/api/[...path]/route.ts (Route Handler)
  // qui utilise API_URL (interne Docker) ou NEXT_PUBLIC_API_URL en fallback.
  // Les rewrites next.config.ts ont été supprimés car ils prenaient priorité
  // sur le Route Handler et utilisaient localhost (inaccessible en Docker).

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
        pathname: "/b/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
