import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-6">
            <h1 className="text-6xl font-bold text-foreground">404</h1>
            <p className="text-lg text-muted-foreground">La page que vous cherchez n&apos;existe pas.</p>
            <Link href="/" className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium bg-[var(--color-btn-subtle)] hover:bg-[var(--color-btn-subtle-hover)] active:bg-[var(--color-btn-subtle-active)">
                Retour à l&apos;accueil
            </Link>
        </div>
    );
}