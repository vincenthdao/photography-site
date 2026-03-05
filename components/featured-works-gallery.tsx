"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FeaturedWork } from "@/lib/featured-works";

interface FeaturedWorksGalleryProps {
  items: FeaturedWork[];
}

export function FeaturedWorksGallery({ items }: FeaturedWorksGalleryProps) {
  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const fadeTimerRef = useRef<number | null>(null);

  const total = items.length;
  const current = items[index];
  const prev = useMemo(() => (total > 1 ? items[(index - 1 + total) % total] : null), [index, items, total]);
  const next = useMemo(() => (total > 1 ? items[(index + 1) % total] : null), [index, items, total]);

  const transitionBy = useCallback((delta: number) => {
    if (isFading || total <= 1) return;
    setIsFading(true);
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = window.setTimeout(() => {
      setIndex((prevIndex) => (prevIndex + delta + total) % total);
      setIsFading(false);
      fadeTimerRef.current = null;
    }, 260);
  }, [isFading, total]);

  const goNext = useCallback(() => transitionBy(1), [transitionBy]);

  const goPrev = useCallback(() => transitionBy(-1), [transitionBy]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        goNext();
      } else if (event.key === "ArrowLeft") {
        goPrev();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [goNext, goPrev]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    };
  }, []);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/20 bg-white/80 p-6 text-sm text-ink/70">
        Add featured images to <code>public/images/featured</code> to populate this gallery.
      </div>
    );
  }

  return (
    <div
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden bg-[#121212] py-8 sm:py-10"
      role="region"
      aria-label="Featured works carousel"
    >
      <div className="relative mx-auto flex w-full max-w-[1800px] items-center justify-center px-2 sm:px-4">
        {prev ? (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-0 top-1/2 z-20 hidden w-[20vw] min-w-[120px] -translate-y-1/2 overflow-hidden rounded-r-2xl sm:block"
            aria-label="Previous photo"
          >
            <Image
              src={prev.src}
              alt={prev.alt || "Previous featured photo"}
              width={1400}
              height={900}
              className="h-[52vh] w-full object-cover opacity-45 blur-[2px] saturate-0"
            />
          </button>
        ) : null}

        <button
          type="button"
          onClick={goPrev}
          className="absolute left-2 z-30 rounded-full border border-white/30 bg-black/35 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur hover:bg-black/55"
          aria-label="Previous photo"
        >
          Prev
        </button>

        <figure className="relative z-10 mx-auto w-[96vw] max-w-[1200px] overflow-hidden rounded-2xl border border-white/15 shadow-[0_30px_70px_rgba(0,0,0,0.45)]">
          <Image
            src={current.src}
            alt={current.alt || "Featured photography work"}
            width={2200}
            height={1400}
            priority
            className={`h-[56vh] w-full bg-black object-contain transition-opacity duration-500 ease-out sm:h-[68vh] lg:h-[74vh] ${
              isFading ? "opacity-0" : "opacity-100"
            }`}
            onClick={(event) => {
              const rect = (event.currentTarget as HTMLImageElement).getBoundingClientRect();
              const clickX = event.clientX - rect.left;
              if (clickX < rect.width / 2) goPrev();
              else goNext();
            }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-5 pb-4 pt-12 text-center text-white/90">
            <p className="text-xs uppercase tracking-[0.2em]">
              Featured Work {index + 1} / {total}
            </p>
          </div>
        </figure>

        <button
          type="button"
          onClick={goNext}
          className="absolute right-2 z-30 rounded-full border border-white/30 bg-black/35 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur hover:bg-black/55"
          aria-label="Next photo"
        >
          Next
        </button>

        {next ? (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-0 top-1/2 z-20 hidden w-[20vw] min-w-[120px] -translate-y-1/2 overflow-hidden rounded-l-2xl sm:block"
            aria-label="Next photo"
          >
            <Image
              src={next.src}
              alt={next.alt || "Next featured photo"}
              width={1400}
              height={900}
              className="h-[52vh] w-full object-cover opacity-45 blur-[2px] saturate-0"
            />
          </button>
        ) : null}
      </div>
    </div>
  );
}
