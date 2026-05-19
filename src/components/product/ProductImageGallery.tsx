"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selected, setSelected] = useState(0);
  const displayImages = images.length > 0
    ? images
    : ["https://placehold.co/800x800?text=No+Image"];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={displayImages[selected] ?? displayImages[0] ?? ""}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                selected === i ? "border-brand-600" : "border-gray-200 hover:border-gray-400"
              )}
              aria-label={`View image ${i + 1} of ${displayImages.length}`}
              aria-pressed={selected === i}
              type="button"
            >
              <Image src={img} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
