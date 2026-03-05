"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { FAQCarouselPhoto } from "@/lib/faq-carousel-photos";

interface FAQSideCarouselProps {
  photos: FAQCarouselPhoto[];
}

export function FAQSideCarousel({ photos }: FAQSideCarouselProps) {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const current = useMemo(() => photos[index], [photos, index]);

  useEffect(() => {
    photos.forEach((photo) => {
      const img = new window.Image();
      img.src = photo.src;
    });
  }, [photos]);

  useEffect(() => {
    if (photos.length <= 1) return;

    const id = window.setInterval(() => {
      setIndex((prev) => {
        setPrevIndex(prev);
        return (prev + 1) % photos.length;
      });
      setIsTransitioning(true);

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
        setPrevIndex(null);
      }, 700);
    }, 3800);

    return () => {
      window.clearInterval(id);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [photos.length]);

  if (photos.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white/80 p-5 text-sm text-ink/70">
        Add gallery photos to power this FAQ visual stream.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white/85 p-3 shadow-soft">
      <div className="relative overflow-hidden rounded-xl bg-[#f7f5f2]">
        <div className="h-[44vh] min-h-[300px] w-full sm:h-[54vh] lg:h-[70vh]" />
        {prevIndex !== null && photos[prevIndex] ? (
          <Image
            src={photos[prevIndex].src}
            alt={photos[prevIndex].alt || "Previous FAQ carousel image"}
            width={1200}
            height={1600}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          />
        ) : null}
        <Image
          src={current.src}
          alt={current.alt || "FAQ carousel image"}
          width={1200}
          height={1600}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
