import galleryManifest from "@/data/gallery-manifest.json";

export type GalleryCategory = "weddings" | "engagements" | "creative";

export interface GalleryPhoto {
  src: string;
  alt: string;
  category: GalleryCategory;
  fileName: string;
  mtimeMs: number;
  width?: number;
  height?: number;
  orientation?: "landscape" | "portrait";
}

export interface GalleryCollections {
  weddings: GalleryPhoto[];
  engagements: GalleryPhoto[];
  creative: GalleryPhoto[];
}

type GalleryManifest = {
  weddings: GalleryPhoto[];
  engagements: GalleryPhoto[];
  creative: GalleryPhoto[];
};

export async function getGalleryCollections(): Promise<GalleryCollections> {
  const data = galleryManifest as GalleryManifest;
  return {
    weddings: [...data.weddings],
    engagements: [...data.engagements],
    creative: [...data.creative]
  };
}
