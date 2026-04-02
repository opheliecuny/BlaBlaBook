"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 6000);

      toast.success("Lien copié dans le presse-papiers.");
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Échec de la copie du lien.");
    }
  };

  return (
    <button
      className="text-primary hover:text-primary/80 rounded px-4 py-2"
      onClick={handleCopy}
      aria-label="Copier le lien"
    >
      {copied ? (
        <Check className="h-5 w-5 sm:h-6 sm:w-6" />
      ) : (
        <Share2 className="h-5 w-5 sm:h-6 sm:w-6" />
      )}
      <span className="sr-only">{copied ? "Lien copié" : "Partager"}</span>
    </button>
  );
}
