import { ThemeProvider } from "next-themes";

// Ce layout racine contient html/body pour satisfaire l'App Router de Next.js.
// ThemeProvider est ici pour appliquer la classe "dark" sur <html>.
// Navbar, Footer, AuthProvider et Toaster sont dans [locale]/layout.tsx.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=inter:400,500,600,700|lora:500|playfair-display:400,600,700"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
