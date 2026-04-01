"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
    description: string;
}

export default function ExpandableDescription({ description }: Props) {
    const [expanded, setExpanded] = useState(false);
    const t = useTranslations("components.expandableDescription");

    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold">{t("title")}</h2>
            <p className={`text-sm leading-relaxed [overflow-wrap:anywhere] ${expanded ? "" : "line-clamp-4 md:line-clamp-none"}`}>
                {description}
            </p>
            <button
                onClick={() => setExpanded(!expanded)}
                className="md:hidden mt-1 w-full flex items-center justify-center gap-2 border border-[var(--accent-alt)] rounded-lg py-2 text-sm text-muted-foreground bg-muted hover:bg-muted/80 transition-colors"
            >
                {expanded ? t("readLess") : t("readMore")}
                <span className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
                    ↓
                </span>
            </button>
        </div>
    );
};