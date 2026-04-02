import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { LibraryStatusProvider } from "@/contexts/LibraryStatusContext";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export const metadata: Metadata = {
  title: "BlaBlaBook",
  description: "La plateforme qui facilite votre gestion de lecture.",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <div lang={locale} className="flex min-h-screen flex-col antialiased">
      <NextIntlClientProvider messages={messages}>
        <AuthProvider>
          <LibraryStatusProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </LibraryStatusProvider>
        </AuthProvider>
        <Toaster />
      </NextIntlClientProvider>
    </div>
  );
}
