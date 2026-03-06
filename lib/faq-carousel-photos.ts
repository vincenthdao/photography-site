import { promises as fs } from "fs";
import path from "path";

export interface FAQCarouselPhoto {
  src: string;
  alt: string;
}

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function altFromFileName(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function readCategory(category: string): Promise<FAQCarouselPhoto[]> {
  const dir = path.join(process.cwd(), "public", "images", "gallery", category);
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => ({
        src: `/images/gallery/${category}/${encodeURIComponent(entry.name)}`,
        alt: altFromFileName(entry.name)
      }));
  } catch {
    return [];
  }
}

export async function getFAQCarouselPhotos(): Promise<FAQCarouselPhoto[]> {
  const [weddings, engagements] = await Promise.all([
    readCategory("weddings"),
    readCategory("engagements")
  ]);

  const interleaved: FAQCarouselPhoto[] = [];
  const max = Math.max(weddings.length, engagements.length);
  for (let i = 0; i < max; i += 1) {
    if (weddings[i]) interleaved.push(weddings[i]);
    if (engagements[i]) interleaved.push(engagements[i]);
  }

  return interleaved.slice(0, 120);
}
