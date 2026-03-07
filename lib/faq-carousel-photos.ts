import galleryManifest from "@/data/gallery-manifest.json";

export interface FAQCarouselPhoto {
  src: string;
  alt: string;
}

type GalleryManifest = {
  weddings: FAQCarouselPhoto[];
  engagements: FAQCarouselPhoto[];
};

export async function getFAQCarouselPhotos(): Promise<FAQCarouselPhoto[]> {
  const data = galleryManifest as GalleryManifest;
  const weddings = data.weddings ?? [];
  const engagements = data.engagements ?? [];

  const interleaved: FAQCarouselPhoto[] = [];
  const max = Math.max(weddings.length, engagements.length);
  for (let i = 0; i < max; i += 1) {
    if (weddings[i]) interleaved.push(weddings[i]);
    if (engagements[i]) interleaved.push(engagements[i]);
  }

  return interleaved.slice(0, 120);
}
