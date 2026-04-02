"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("components.shareButton");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 6000);
      toast.success(t("toastSuccess"));
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error(t("toastError"));
    }
  };

  return (
    <button
      className="text-primary hover:text-primary/80 rounded px-4 py-2"
      onClick={handleCopy}
      aria-label={t("ariaLabel")}
    >
      {copied ? (
        <Check className="h-5 w-5 sm:h-6 sm:w-6" />
      ) : (
        <Share2 className="h-5 w-5 sm:h-6 sm:w-6" />
      )}
      <span className="sr-only">{copied ? t("copied") : t("share")}</span>
    </button>
  );
}
