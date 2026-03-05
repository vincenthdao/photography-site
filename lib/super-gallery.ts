import { promises as fs } from "fs";
import path from "path";

export type GalleryCategory = "weddings" | "engagements" | "creative";

export interface GalleryPhoto {
  src: string;
  alt: string;
  category: GalleryCategory;
  fileName: string;
  mtimeMs: number;
}

export interface GalleryCollections {
  weddings: GalleryPhoto[];
  engagements: GalleryPhoto[];
  creative: GalleryPhoto[];
}

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function altFromFilename(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function loadCategory(category: GalleryCategory): Promise<GalleryPhoto[]> {
  const baseDir = path.join(process.cwd(), "public", "images", "gallery", category);

  try {
    const entries = await fs.readdir(baseDir, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => entry.name);

    const photos = await Promise.all(
      files.map(async (fileName) => {
        const stats = await fs.stat(path.join(baseDir, fileName));
        return {
          src: `/images/gallery/${category}/${encodeURIComponent(fileName)}`,
          alt: altFromFilename(fileName),
          category,
          fileName,
          mtimeMs: stats.mtimeMs
        } satisfies GalleryPhoto;
      })
    );

    return photos.sort((a, b) => b.mtimeMs - a.mtimeMs);
  } catch {
    return [];
  }
}

export async function getGalleryCollections(): Promise<GalleryCollections> {
  const [weddings, engagements, creative] = await Promise.all([
    loadCategory("weddings"),
    loadCategory("engagements"),
    loadCategory("creative")
  ]);

  return { weddings, engagements, creative };
}
