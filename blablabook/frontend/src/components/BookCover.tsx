"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string | null;
  alt: string;
  className?: string;
}

export default function BookCover({ src, alt, className }: Props) {
  const resolvedSrc = src && !src.includes("undefined") ? src : "/default-cover.png";
  const [imgSrc, setImgSrc] = useState(resolvedSrc);

  const isExternal = imgSrc.startsWith("http");

  if (isExternal) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onError={() => setImgSrc("/default-cover.png")}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={200}
      height={300}
      className={className}
      onError={() => setImgSrc("/default-cover.png")}
    />
  );
}
