"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function BookCover({ src, alt, className, priority }: Props) {
  // Image par défaut si src est null ou contient "undefined"
  const defaultFallback = "/default-cover.png";

  // Calcule de la source initiale à chaque rendu
  const resolvedSrc = src && !src.includes("undefined") ? src : defaultFallback;

  // On garde un état uniquement pour savoir si l'image a échoué
  // On utilise la clé "src" pour réinitialiser cet état si le livre change
  const [hasError, setHasError] = useState(false);

  // Si la prop src change (par exemple, lors de la navigation entre les livres), on réinitialise l'état d'erreur
  const currentImg = hasError ? defaultFallback : resolvedSrc;

  return (
    <Image
      key={src} //changer la clé pour forcer le rechargement de l'image lorsque la source change
      src={currentImg}
      alt={alt}
      width={200}
      height={300}
      className={className}
      onError={() => setHasError(true)}
      // Optimisation : charge les couvertures visibles plus rapidement
      priority={priority ?? false}
    />
  );
}
