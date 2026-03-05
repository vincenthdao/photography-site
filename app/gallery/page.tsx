import type { Metadata } from "next";
import { SectionHeader } from "@/components/section-header";
import { SuperGalleryView } from "@/components/super-gallery-view";
import { getGalleryCollections } from "@/lib/super-gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Explore full wedding, engagement, and creative galleries in an immersive viewing experience."
};

type GallerySearchParams = {
  category?: string;
};

function parseInitialCategory(value?: string): "weddings" | "engagements" | "creative" | null {
  if (value === "weddings" || value === "engagements" || value === "creative") {
    return value;
  }
  return null;
}

export default async function GalleryPage({ searchParams }: { searchParams: Promise<GallerySearchParams> }) {
  const collections = await getGalleryCollections();
  const resolvedParams = await searchParams;
  const initialCategory = parseInitialCategory(resolvedParams.category);

  return (
    <section className="w-full px-4 pb-16 pt-14 sm:px-6 lg:px-10 lg:pt-20">
      <SectionHeader
        eyebrow="Gallery"
        title="An immersive archive of recent work"
        subtitle="Choose a collection below to expand it full-screen. Add images into the gallery folders and they appear automatically."
      />

      <SuperGalleryView collections={collections} initialCategory={initialCategory} />
    </section>
  );
}
