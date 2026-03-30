import { notFound } from "next/navigation";

export default function CatchAll() {
  // Déclenche automatiquement [locale]/not-found.tsx
  notFound();
}