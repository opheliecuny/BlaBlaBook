import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour les images distantes
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

export default nextConfig;
