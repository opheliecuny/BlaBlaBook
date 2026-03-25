export default function Loading() {
    return (
        <div className="flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center gap-6 px-4">
            <p className="text-2xl font-bold tracking-tight select-none">
                <span className="text-foreground">BlaBlaBook</span>
            </p>

            {/* Spinner */}
            <div className="relative h-10 w-10" aria-hidden="true">
                {/* contour static */}
                <div className="absolute inset-0 rounded-full border-4 border-border" />
                {/* arc qui tourne */}
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
            </div>

            {/* status pour l'accéssibilité (par défaut : aria-live="polite" pour attendre que l'action finisse avant de lire le div) */}
            <div role="status">
                <p className="text-muted-foreground text-sm animate-pulse">
                    Chargement en cours…
                </p>
            </div>
        </div>
    );
}