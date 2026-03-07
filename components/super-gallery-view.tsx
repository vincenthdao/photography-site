"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GalleryCategory, GalleryCollections, GalleryPhoto } from "@/lib/super-gallery";

interface SuperGalleryViewProps {
  collections: GalleryCollections;
  initialCategory?: GalleryCategory | null;
}

const sectionMeta: Record<GalleryCategory, { title: string; subtitle: string; background: string }> = {
  weddings: {
    title: "Weddings",
    subtitle: "Full-day narratives, quiet gestures, and lasting moments.",
    background: "bg-[linear-gradient(132deg,#f6eee7_0%,#e6d4c4_44%,#f5ece5_100%)]"
  },
  engagements: {
    title: "Engagements",
    subtitle: "Editorial portraits with softness, chemistry, and intention.",
    background: "bg-[linear-gradient(124deg,#eef4f1_0%,#d6e3db_46%,#f4f8f5_100%)]"
  },
  creative: {
    title: "Creative Work",
    subtitle: "Landscape, travel, portraiture, and personal visual studies.",
    background: "bg-[linear-gradient(125deg,#edf1ec_0%,#e3e8de_48%,#f5f4ef_100%)]"
  }
};

type FlowGroup = {
  id: string;
  title: string;
  subtitle: string;
  keywords: string[];
};

const weddingFlow: FlowGroup[] = [
  {
    id: "details",
    title: "Details",
    subtitle: "Rings, textures, florals, and quiet design elements.",
    keywords: ["detail", "ring", "flatlay", "invitation", "dress", "shoe", "bouquet", "table", "decor", "veil", "suite"]
  },
  {
    id: "prelude",
    title: "Prelude",
    subtitle: "The atmosphere and anticipation before the ceremony.",
    keywords: ["prep", "ready", "getting-ready", "bridal", "groom", "venue", "arrival"]
  },
  {
    id: "ceremony",
    title: "Ceremony",
    subtitle: "The vows, the stillness, and the turning point.",
    keywords: ["ceremony", "vow", "aisle", "kiss", "processional", "recessional"]
  },
  {
    id: "portraits",
    title: "Portraits",
    subtitle: "Composed moments with presence and intimacy.",
    keywords: ["portrait", "couple", "bride", "groom", "party", "family"]
  },
  {
    id: "reception",
    title: "Reception",
    subtitle: "Energy, movement, and celebration into the evening.",
    keywords: ["reception", "dance", "toast", "party", "night", "exit", "cake"]
  }
];

const engagementFlow: FlowGroup[] = [
  {
    id: "portraits",
    title: "Portraits",
    subtitle: "Intimate portraits with calm, editorial direction.",
    keywords: ["portrait", "close", "couple", "embrace", "look", "gaze"]
  },
  {
    id: "movement",
    title: "Movement",
    subtitle: "Natural interaction and in-between moments.",
    keywords: ["walk", "run", "laugh", "dance", "motion", "movement", "candid"]
  },
  {
    id: "place",
    title: "Place",
    subtitle: "Frames that anchor your story in landscape and atmosphere.",
    keywords: ["landscape", "wide", "sunset", "coast", "city", "mountain", "location"]
  },
  {
    id: "details",
    title: "Details",
    subtitle: "Selective detail frames that support the story without taking over.",
    keywords: ["texture", "hands", "close", "detail"]
  }
];

const PORTRAIT_KEYWORDS = ["portrait", "headshot", "model", "face", "self"] as const;

function hashString(value: string): number {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }
  return hash >>> 0;
}

function stableShuffle(items: GalleryPhoto[], seed: string): GalleryPhoto[] {
  return [...items].sort((a, b) => {
    const aHash = hashString(`${seed}:${a.fileName}`);
    const bHash = hashString(`${seed}:${b.fileName}`);
    return aHash - bHash;
  });
}

function deCluster(items: GalleryPhoto[]): GalleryPhoto[] {
  // Spread neighboring filenames apart to reduce near-duplicate adjacency.
  const bucketCount = 3;
  const buckets: GalleryPhoto[][] = Array.from({ length: bucketCount }, () => []);
  items.forEach((photo, index) => {
    buckets[index % bucketCount].push(photo);
  });

  const output: GalleryPhoto[] = [];
  let index = 0;
  while (buckets.some((bucket) => index < bucket.length)) {
    for (const bucket of buckets) {
      if (index < bucket.length) {
        output.push(bucket[index]);
      }
    }
    index += 1;
  }
  return output;
}

function matchesKeywords(fileName: string, keywords: string[]): boolean {
  const lower = fileName.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword));
}

function splitByFlow(photos: GalleryPhoto[], flow: FlowGroup[]): Array<{ group: FlowGroup; photos: GalleryPhoto[] }> {
  const used = new Set<string>();
  const sections = flow.map((group) => {
    const groupPhotos = photos.filter((photo) => !used.has(photo.src) && matchesKeywords(photo.fileName, group.keywords));
    groupPhotos.forEach((photo) => used.add(photo.src));
    return { group, photos: groupPhotos };
  });

  const uncategorized = photos.filter((photo) => !used.has(photo.src));
  if (uncategorized.length > 0) {
    sections.push({
      group: {
        id: "story",
        title: "Story",
        subtitle: "Additional frames completing the visual narrative.",
        keywords: []
      },
      photos: uncategorized
    });
  }

  return sections.filter((section) => section.photos.length > 0);
}

function sampleEvenly(items: GalleryPhoto[], count: number): GalleryPhoto[] {
  if (items.length <= count) return items;
  if (count <= 1) return [items[0]];

  const sampled: GalleryPhoto[] = [];
  const used = new Set<string>();
  const step = (items.length - 1) / (count - 1);

  for (let i = 0; i < count; i += 1) {
    const index = Math.round(i * step);
    const photo = items[index];
    if (photo && !used.has(photo.src)) {
      sampled.push(photo);
      used.add(photo.src);
    }
  }

  if (sampled.length < count) {
    for (const photo of items) {
      if (!used.has(photo.src)) {
        sampled.push(photo);
        used.add(photo.src);
      }
      if (sampled.length >= count) break;
    }
  }

  return sampled.slice(0, count);
}

function buildNarrativePreview(photos: GalleryPhoto[], flow: FlowGroup[], seed: string, count = 24): GalleryPhoto[] {
  const base = deCluster(stableShuffle(photos, seed));
  const grouped = splitByFlow(base, flow);

  const sequence = grouped.flatMap(({ group, photos: groupPhotos }) =>
    deCluster(stableShuffle(groupPhotos, `${seed}-${group.id}`))
  );

  return sampleEvenly(sequence, count);
}

function buildCreativePreview(photos: GalleryPhoto[], seed: string, count = 24): GalleryPhoto[] {
  const portraitKeywords = ["portrait", "headshot", "model", "face", "self"];
  const nonPortrait = photos.filter((photo) =>
    !portraitKeywords.some((keyword) => photo.fileName.toLowerCase().includes(keyword))
  );
  const source = nonPortrait.length >= count ? nonPortrait : photos;
  const sequence = deCluster(stableShuffle(source, seed));
  return sampleEvenly(sequence, count);
}

function buildEngagementPreview(photos: GalleryPhoto[]): GalleryPhoto[] {
  const preferred = [
    "Big Bear Engagement-48.jpg",
    "_B8A7052.jpg",
    "LB Engagement-30.jpg",
    "_B8A8606.jpg",
    "Big Bear Engagement-63.jpg",
    "Engagement-33.JPG"
  ];
  const preferredMapped = preferred
    .map((fileName) => photos.find((photo) => photo.fileName === fileName))
    .filter((photo): photo is GalleryPhoto => Boolean(photo));

  const base = buildNarrativePreview(photos, engagementFlow, "engagements-preview-grid-v2");
  const blockedKeywords = ["ring", "detail", "close", "hands"];
  const filteredBase = base.filter(
    (photo) => !blockedKeywords.some((keyword) => photo.fileName.toLowerCase().includes(keyword))
  );

  const combined: GalleryPhoto[] = [];
  const used = new Set<string>();
  for (const photo of [...preferredMapped, ...filteredBase]) {
    if (!used.has(photo.src)) {
      combined.push(photo);
      used.add(photo.src);
    }
  }

  if (combined.length >= 3) return combined;
  return filteredBase.length > 0 ? filteredBase : base;
}

function rgbToHue(r: number, g: number, b: number): { hue: number; saturation: number; lightness: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === rn) {
      hue = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      hue = (bn - rn) / delta + 2;
    } else {
      hue = (rn - gn) / delta + 4;
    }
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;
  }

  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  return { hue, saturation, lightness };
}

async function getDominantHue(src: string): Promise<{ hue: number; saturation: number; lightness: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 24;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve({ hue: 361, saturation: 0, lightness: 0.5 });
        return;
      }

      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;

      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha < 20) continue;
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count += 1;
      }

      if (count === 0) {
        resolve({ hue: 361, saturation: 0, lightness: 0.5 });
        return;
      }

      resolve(rgbToHue(r / count, g / count, b / count));
    };
    img.onerror = () => resolve({ hue: 361, saturation: 0, lightness: 0.5 });
    img.src = src;
  });
}

type CreativeColorEntry = {
  photo: GalleryPhoto;
  color: {
    hue: number;
    saturation: number;
    lightness: number;
  };
  drama?: number;
};

function creativeTileClasses(index: number, isLandscape: boolean, isFocused: boolean): string {
  const layout = isLandscape ? "sm:col-span-2 lg:col-span-2" : "sm:col-span-1 lg:col-span-1";
  const drift = index % 7 === 2 ? "lg:translate-y-1" : index % 7 === 5 ? "lg:-translate-y-1" : "";
  return `group relative isolate overflow-hidden rounded-[18px] transition ${layout} ${drift} ${
    isFocused ? "z-20 shadow-[0_28px_62px_rgba(0,0,0,0.22)]" : "z-10 shadow-soft"
  }`;
}

function cinematicCreativeOrder(entries: CreativeColorEntry[]): GalleryPhoto[] {
  if (entries.length <= 2) return entries.map((entry) => entry.photo);

  const withScore = entries.map((entry, index) => {
    const normalizedHue = entry.color.saturation < 0.12 ? 361 : entry.color.hue;
    const contrast = Math.abs(entry.color.lightness - 0.5);
    const punch = entry.color.saturation * 1.55 + contrast * 1.05 + (entry.drama ?? 0) * 0.9;
    const warmth = normalizedHue === 361 ? 0 : Math.cos(((normalizedHue - 20) * Math.PI) / 180);
    return { ...entry, normalizedHue, contrast, punch, warmth, index };
  });

  // Chapter 1: strongest attention frames first (alternating warm/cool for visual tension).
  const highImpact = [...withScore].sort((a, b) => b.punch - a.punch).slice(0, Math.min(12, withScore.length));
  const warmImpact = highImpact.filter((entry) => entry.warmth > 0.15);
  const coolImpact = highImpact.filter((entry) => entry.warmth <= 0.15);
  const opener: GalleryPhoto[] = [];
  const used = new Set<string>();
  for (let i = 0; i < highImpact.length; i += 1) {
    const source = i % 2 === 0 ? warmImpact : coolImpact;
    const pick = source.find((entry) => !used.has(entry.photo.src))
      ?? highImpact.find((entry) => !used.has(entry.photo.src));
    if (pick) {
      opener.push(pick.photo);
      used.add(pick.photo.src);
    }
  }

  // Chapter 2: a smoother color journey to feel curated rather than shuffled.
  const remaining = withScore.filter((entry) => !used.has(entry.photo.src));
  const chromatic = remaining
    .filter((entry) => entry.normalizedHue !== 361)
    .sort((a, b) => {
      if (a.normalizedHue !== b.normalizedHue) return a.normalizedHue - b.normalizedHue;
      return b.punch - a.punch;
    });
  const neutral = remaining
    .filter((entry) => entry.normalizedHue === 361)
    .sort((a, b) => b.contrast - a.contrast);

  // Chapter 3: close on quieter/neutral frames to leave a cinematic aftertaste.
  const closer = neutral.slice(0, Math.min(6, neutral.length)).map((entry) => entry.photo);
  const body = [...chromatic.map((entry) => entry.photo), ...neutral.slice(6).map((entry) => entry.photo)];
  const cinematic = [...opener, ...body, ...closer];
  const deClustered = deCluster(cinematic);

  return deClustered;
}

function GalleryLightbox({
  photos,
  activeIndex,
  onClose,
  onPrev,
  onNext
}: {
  photos: GalleryPhoto[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[activeIndex];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!photo) return null;
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[140] animate-[fadeIn_220ms_ease-out] bg-black/88 backdrop-blur-sm"
      onPointerDown={onClose}
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <div className="relative w-[min(92vw,1500px)] pointer-events-none">
          <button
            type="button"
            onClick={onClose}
            onPointerDown={(event) => event.stopPropagation()}
            className="pointer-events-auto absolute right-2 top-2 z-20 rounded-full border border-white/40 bg-black/45 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-black/70 sm:right-3 sm:top-3"
            aria-label="Close fullscreen image"
          >
            X
          </button>

          <button
            type="button"
            onClick={onPrev}
            onPointerDown={(event) => event.stopPropagation()}
            className="pointer-events-auto absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/55 bg-black/65 p-3 text-xl font-semibold text-white shadow-[0_10px_26px_rgba(0,0,0,0.42)] transition hover:scale-105 hover:bg-black/80 sm:left-5 sm:p-3.5"
            aria-label="Previous image"
          >
            ←
          </button>

          <figure className="pointer-events-none relative mx-auto w-full select-none" onContextMenu={(event) => event.preventDefault()}>
            <div className="pointer-events-auto mx-auto w-fit" onPointerDown={(event) => event.stopPropagation()}>
              <Image
                src={photo.src}
                alt={photo.alt || "Fullscreen gallery image"}
                width={2800}
                height={1900}
                priority
                draggable={false}
                className="h-[76vh] w-auto max-w-[92vw] rounded-xl object-contain sm:h-[82vh]"
              />
            </div>
            <figcaption className="mt-2 text-center text-[11px] uppercase tracking-[0.16em] text-white/80">
              {activeIndex + 1} / {photos.length}
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={onNext}
            onPointerDown={(event) => event.stopPropagation()}
            className="pointer-events-auto absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/55 bg-black/65 p-3 text-xl font-semibold text-white shadow-[0_10px_26px_rgba(0,0,0,0.42)] transition hover:scale-105 hover:bg-black/80 sm:right-5 sm:p-3.5"
            aria-label="Next image"
          >
            →
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          onPointerDown={(event) => event.stopPropagation()}
          className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/35 bg-black/45 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-black/70 sm:bottom-5"
        >
          Close Viewer
        </button>
      </div>
    </div>,
    document.body
  );
}

function GallerySection({ category, photos }: { category: GalleryCategory; photos: GalleryPhoto[] }) {
  const meta = sectionMeta[category];
  const [displayPhotos, setDisplayPhotos] = useState<GalleryPhoto[]>(photos);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [isCreativePreparing, setIsCreativePreparing] = useState(false);
  const creativeSortCacheRef = useRef<Map<string, GalleryPhoto[]>>(new Map());

  function getPhotoOrientation(photo: GalleryPhoto): "landscape" | "portrait" {
    if (photo.orientation) return photo.orientation;
    if (photo.width && photo.height) {
      return photo.width >= photo.height ? "landscape" : "portrait";
    }
    const lower = photo.fileName.toLowerCase();
    const likelyLandscape =
      lower.includes("landscape") ||
      lower.includes("sunset") ||
      lower.includes("bridge") ||
      lower.includes("mountain") ||
      lower.includes("coast") ||
      lower.includes("city") ||
      lower.includes("wide") ||
      lower.includes("street");
    if (likelyLandscape) return "landscape";
    return "portrait";
  }

  const weddingEngagementSections = useMemo(() => {
    if (category !== "weddings" && category !== "engagements") return [];
    return splitByFlow(displayPhotos, category === "weddings" ? weddingFlow : engagementFlow);
  }, [category, displayPhotos]);

  const creativePhotosForFlow = useMemo(() => {
    if (category !== "creative") return [];
    const nonPortrait = displayPhotos.filter(
      (photo) => !PORTRAIT_KEYWORDS.some((keyword) => photo.fileName.toLowerCase().includes(keyword))
    );
    return nonPortrait.length > 0 ? nonPortrait : displayPhotos;
  }, [category, displayPhotos]);

  const orderedPhotos = useMemo(() => {
    if (category === "weddings" || category === "engagements") {
      return weddingEngagementSections.flatMap((section) => section.photos);
    }
    return creativePhotosForFlow;
  }, [category, weddingEngagementSections, creativePhotosForFlow]);

  useEffect(() => {
    if (category !== "creative") {
      setIsCreativePreparing(false);
      setDisplayPhotos(photos);
      return;
    }

    const cacheKey = photos.map((photo) => photo.src).join("|");
    const cached = creativeSortCacheRef.current.get(cacheKey);
    if (cached) {
      setIsCreativePreparing(false);
      setDisplayPhotos(cached);
      return;
    }

    setIsCreativePreparing(true);
    const dramaticKeywords = [
      "sunset", "storm", "night", "moody", "shadow", "silhouette", "dramatic", "cinematic",
      "mountain", "ocean", "desert", "fog", "mist", "light", "flare", "city", "street", "architecture"
    ];
    const syntheticColorData = photos.map((photo) => {
      const base = hashString(photo.fileName);
      const lower = photo.fileName.toLowerCase();
      const dramaFromName = dramaticKeywords.reduce((score, keyword) => (lower.includes(keyword) ? score + 0.22 : score), 0);
      const dramaFromContrast = ((base >> 5) % 100) / 220;
      return {
        photo,
        color: {
          hue: base % 360,
          saturation: 0.28 + ((base >> 7) % 52) / 100,
          lightness: 0.3 + ((base >> 13) % 45) / 100
        },
        drama: dramaFromName + dramaFromContrast
      };
    });

    const sorted = cinematicCreativeOrder(syntheticColorData);
    creativeSortCacheRef.current.set(cacheKey, sorted);
    setDisplayPhotos(sorted);
    setIsCreativePreparing(false);
  }, [category, photos]);

  useEffect(() => {
    setActivePhotoIndex(null);
  }, [category, photos]);

  useEffect(() => {
    if (activePhotoIndex === null) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActivePhotoIndex(null);
      else if (event.key === "ArrowRight") setActivePhotoIndex((prev) => (prev === null ? 0 : (prev + 1) % orderedPhotos.length));
      else if (event.key === "ArrowLeft") setActivePhotoIndex((prev) => (prev === null ? 0 : (prev - 1 + orderedPhotos.length) % orderedPhotos.length));
    }
    window.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [activePhotoIndex, orderedPhotos.length]);

  function openLightbox(photoSrc: string) {
    const index = orderedPhotos.findIndex((photo) => photo.src === photoSrc);
    if (index >= 0) setActivePhotoIndex(index);
  }

  function goPrev() {
    setActivePhotoIndex((prev) => (prev === null ? 0 : (prev - 1 + orderedPhotos.length) % orderedPhotos.length));
  }

  function goNext() {
    setActivePhotoIndex((prev) => (prev === null ? 0 : (prev + 1) % orderedPhotos.length));
  }

  return (
    <section
      className={`min-h-screen rounded-[28px] border border-black/10 p-6 shadow-soft sm:p-8 ${meta.background}`}
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <div className="mb-6">
        <h3 className="font-serif text-4xl text-ink">{meta.title}</h3>
        <p className="mt-2 text-sm text-ink/75 sm:text-base">{meta.subtitle}</p>
      </div>

      {displayPhotos.length === 0 ? (
        <p className="rounded-xl bg-white/70 p-4 text-sm text-ink/70">
          Add photos to <code>public/images/gallery/{category}</code> and refresh.
        </p>
      ) : (
        <>
          {category === "weddings" || category === "engagements" ? (
            <div className="space-y-8">
              {weddingEngagementSections.map(({ group, photos }) => (
                <div key={group.id}>
                  <h4 className="font-serif text-2xl text-ink">{group.title}</h4>
                  <p className="mt-1 text-sm text-ink/70">{group.subtitle}</p>
                  <div className="mt-3 grid grid-flow-row-dense grid-cols-1 items-start gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5">
                    {photos.map((photo, index) => {
                      const orientation = getPhotoOrientation(photo);
                      const isLandscape = orientation === "landscape";
                      return (
                      <figure
                        key={photo.src}
                        className={`${creativeTileClasses(index, isLandscape, false)} select-none`}
                        onContextMenu={(event) => event.preventDefault()}
                        onDragStart={(event) => event.preventDefault()}
                      >
                        <Link
                          href={photo.src}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => {
                            event.preventDefault();
                            openLightbox(photo.src);
                          }}
                          className="block w-full cursor-zoom-in"
                        >
                          <Image
                            src={photo.src}
                            alt={photo.alt || `${meta.title} photo`}
                            width={2600}
                            height={1700}
                            loading="lazy"
                            quality={72}
                            draggable={false}
                            sizes={isLandscape
                              ? "(min-width: 1536px) 38vw, (min-width: 1280px) 44vw, (min-width: 1024px) 50vw, (min-width: 640px) 92vw, 100vw"
                              : "(min-width: 1536px) 18vw, (min-width: 1280px) 22vw, (min-width: 1024px) 24vw, (min-width: 640px) 46vw, 100vw"}
                            className={`w-full rounded-[14px] bg-[#f2eade] object-contain transition-transform duration-700 ease-out ${
                              isLandscape ? "aspect-[16/10]" : "aspect-[4/5]"
                            } group-hover:scale-[1.04]`}
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/15 mix-blend-soft-light" />
                        </Link>
                      </figure>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h4 className="font-serif text-2xl text-ink">Landscape, Travel, and Street Studies</h4>
              <p className="mt-1 text-sm text-ink/70">A tonal sequence curated for atmosphere, place, and movement.</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-ink/55">Click any image to open fullscreen</p>
              {isCreativePreparing ? (
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {Array.from({ length: 15 }).map((_, index) => (
                    <div key={`creative-loading-${index}`} className="h-64 animate-pulse rounded-[16px] border border-black/10 bg-white/65" />
                  ))}
                </div>
              ) : (
                <div className="mt-3 grid grid-flow-row-dense grid-cols-1 items-start gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5">
                  {creativePhotosForFlow.map((photo, index) => {
                    const orientation = getPhotoOrientation(photo);
                    const isLandscape = orientation === "landscape";
                    return (
                      <figure
                        key={photo.src}
                        className={`${creativeTileClasses(index, isLandscape, false)} select-none`}
                        onContextMenu={(event) => event.preventDefault()}
                        onDragStart={(event) => event.preventDefault()}
                      >
                        <Link
                          href={photo.src}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => {
                            event.preventDefault();
                            openLightbox(photo.src);
                          }}
                          className="block w-full cursor-zoom-in"
                        >
                          <Image
                            src={photo.src}
                            alt={photo.alt || `${meta.title} photo`}
                            width={2600}
                            height={1700}
                            loading={index < 8 ? "eager" : "lazy"}
                            quality={72}
                            draggable={false}
                            sizes={isLandscape
                              ? "(min-width: 1536px) 38vw, (min-width: 1280px) 44vw, (min-width: 1024px) 50vw, (min-width: 640px) 92vw, 100vw"
                              : "(min-width: 1536px) 18vw, (min-width: 1280px) 22vw, (min-width: 1024px) 24vw, (min-width: 640px) 46vw, 100vw"}
                            className={`w-full rounded-[14px] bg-[#f2eade] object-contain transition-transform duration-700 ease-out ${
                              isLandscape ? "aspect-[16/10]" : "aspect-[4/5]"
                            } group-hover:scale-[1.04]`}
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/15 mix-blend-soft-light" />
                        </Link>
                      </figure>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activePhotoIndex !== null ? (
        <GalleryLightbox
          photos={orderedPhotos}
          activeIndex={activePhotoIndex}
          onClose={() => setActivePhotoIndex(null)}
          onPrev={goPrev}
          onNext={goNext}
        />
      ) : null}
    </section>
  );
}

export function SuperGalleryView({ collections, initialCategory = null }: SuperGalleryViewProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | null>(initialCategory);

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const order: GalleryCategory[] = ["weddings", "engagements", "creative"];
  const randomized = useMemo(() => {
    return {
      weddings: stableShuffle(collections.weddings, "weddings-v3"),
      engagements: stableShuffle(collections.engagements, "engagements-v3"),
      creative: deCluster(stableShuffle(collections.creative, "creative-v3"))
    } satisfies GalleryCollections;
  }, [collections]);

  const previewGridSets = useMemo(
    () =>
      ({
        weddings: buildNarrativePreview(randomized.weddings, weddingFlow, "weddings-preview-grid-v2"),
        engagements: buildEngagementPreview(randomized.engagements),
        creative: buildCreativePreview(randomized.creative, "creative-preview-grid-v2")
      }) satisfies GalleryCollections,
    [randomized]
  );

  const pinnedPreviewCount = 3;

  if (!activeCategory) {
    return (
      <div className="space-y-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {order.map((category) => {
            const meta = sectionMeta[category];
            const previews = previewGridSets[category];
            return (
              <Link
                key={category}
                href={`/gallery?category=${category}`}
                onClick={() => setActiveCategory(category)}
                className={`group relative overflow-hidden rounded-[26px] border border-black/10 p-4 text-left shadow-soft transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_46px_rgba(28,20,12,0.14)] ${meta.background}`}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-pine">View Collection</p>
                <h3 className="mt-2 font-serif text-3xl text-ink">{meta.title}</h3>
                <p className="mt-2 text-sm text-ink/75">{meta.subtitle}</p>

                <div className="mt-4 h-[42vh] overflow-hidden rounded-2xl border border-black/10 bg-white/70 p-2 transition-all duration-500 group-hover:h-[50vh]">
                  {previews.length > 0 ? (
                    <div className="grid h-full grid-cols-2 gap-2">
                      {previews.slice(0, pinnedPreviewCount).map((photo, index) => (
                        <figure
                          key={photo.src}
                          className={`overflow-hidden rounded-xl border border-black/10 bg-white/80 transition duration-500 ${
                            index === 0 ? "row-span-2" : "row-span-1"
                          }`}
                        >
                          <Image
                            src={photo.src}
                            alt={photo.alt || `${meta.title} preview`}
                            width={900}
                            height={1200}
                            loading="lazy"
                            quality={68}
                            sizes="(min-width: 1024px) 14vw, (min-width: 640px) 28vw, 42vw"
                            className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] ${
                              category === "weddings" ? "object-left" : "object-center"
                            }`}
                          />
                        </figure>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-white/70 p-4 text-xs text-ink/60">Add photos to <code>public/images/gallery/{category}</code></div>
                  )}
                </div>

                <p className="mt-4 inline-flex items-center rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/70 transition group-hover:border-pine/40 group-hover:text-pine">
                  Open Collection
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[linear-gradient(180deg,#f6efe6_0%,#ecdfcf_100%)] py-4 sm:py-6 lg:py-8">
      <div className="mx-auto w-full max-w-[1700px] space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="sticky top-20 z-20 flex flex-col gap-4 rounded-2xl border border-black/10 bg-white/90 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/gallery"
              onClick={(event) => {
                event.preventDefault();
                setActiveCategory(null);
              }}
              className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:border-pine"
            >
              All Galleries
            </Link>
            {order.map((value) => (
              <Link
                key={value}
                href={`/gallery?category=${value}`}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveCategory(value);
                }}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                  activeCategory === value ? "bg-ink text-oat" : "border border-black/15 bg-white text-ink hover:border-pine"
                }`}
              >
                {sectionMeta[value].title}
              </Link>
            ))}
          </div>
          <Link
            href="/gallery"
            onClick={(event) => {
              event.preventDefault();
              setActiveCategory(null);
            }}
            className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:border-pine"
          >
            Close
          </Link>
        </div>

        <GallerySection category={activeCategory} photos={randomized[activeCategory]} />
      </div>
    </div>
  );
}
