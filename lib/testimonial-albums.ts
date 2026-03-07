import { promises as fs } from "fs";
import path from "path";

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function toWebPath(folderKey: string, fileName: string) {
  return `/images/testimonials/${folderKey}/${encodeURIComponent(fileName)}`;
}

export async function getTestimonialAlbumPreviews(folderKey?: string, max = 4): Promise<string[]> {
  if (!folderKey) return [];
  const dir = path.join(process.cwd(), "public", "images", "testimonials", folderKey);

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b))
      .slice(0, max)
      .map((fileName) => toWebPath(folderKey, fileName));
  } catch {
    return [];
  }
}
