"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { GalleryCategory, GalleryCollections } from "@/lib/super-gallery";

interface HomeGalleryExplorerProps {
  collections: GalleryCollections;
}

const categories: Array<{ key: GalleryCategory; label: string }> = [
  { key: "weddings", label: "Weddings" },
  { key: "engagements", label: "Engagements" },
  { key: "creative", label: "Creative Work" }
];

export function HomeGalleryExplorer({ collections }: HomeGalleryExplorerProps) {
  const [active, setActive] = useState<GalleryCategory>("weddings");

  const photos = useMemo(() => collections[active], [active, collections]);
  const previewPhotos = useMemo(() => photos.slice(0, 12), [photos]);

  return (
    <div className="rounded-3xl border border-black/10 bg-white/95 p-4 shadow-soft sm:p-5">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = category.key === active;
          return (
            <button
              key={category.key}
              type="button"
              onClick={() => setActive(category.key)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                isActive
                  ? "bg-ink text-oat"
                  : "border border-ink/20 bg-white text-ink hover:border-pine hover:text-pine"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 max-h-[40vh] overflow-y-auto rounded-2xl border border-black/10 bg-[#f7f5f2] p-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {previewPhotos.map((photo, index) => (
            <figure key={`${photo.src}-${index}`} className="overflow-hidden rounded-xl border border-black/10 bg-[#efe5d8]">
              <Image
                src={photo.src}
                alt={photo.alt || `${active} photograph`}
                width={photo.width ?? 1200}
                height={photo.height ?? 1600}
                loading="lazy"
                quality={52}
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 50vw"
                className="block aspect-[4/5] h-full w-full object-cover"
              />
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link href="/gallery" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-oat transition hover:bg-black">
          Open Full Gallery
        </Link>
        <Link
          href={`/gallery?category=${active}`}
          className="rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink transition hover:border-pine hover:text-pine"
        >
          Open {categories.find((category) => category.key === active)?.label}
        </Link>
      </div>
    </div>
  );
}
