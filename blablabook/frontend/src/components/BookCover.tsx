"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string | null;
  alt: string;
  className?: string;
}

export default function BookCover({ src, alt, className }: Props) {
  const [imgSrc, setImgSrc] = useState(
    src && !src.includes("undefined") ? src : "/default-cover.png"
  );

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={200}
      height={300}
      className={className}
      onError={() => setImgSrc("/default-cover.png")}
      unoptimized={imgSrc.startsWith("http")}
    />
  );
}
