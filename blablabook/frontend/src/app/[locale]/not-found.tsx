import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
    const t = await getTranslations("common");

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-6">
            <h1 className="text-6xl font-bold text-foreground">{t("notFound.title")}</h1>
            <p className="text-lg text-muted-foreground">{t("notFound.description")}</p>
            <Link href="/" className="inline-flex items-center justify-center rounded-md bg-secondary px-3 py-1.5 text-xs font-medium hover:bg-(--color-btn-subtle-hover)">
                {t("notFound.backHome")}
            </Link>
        </div>
    );
}