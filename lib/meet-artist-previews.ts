import { promises as fs } from "fs";
import path from "path";
import type { FeaturedWork } from "@/lib/featured-works";

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function altFromFilename(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getMeetArtistPreviews(): Promise<FeaturedWork[]> {
  const directory = path.join(process.cwd(), "public", "images", "home", "meet-artist");

  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));

    return files.map((fileName) => ({
      src: `/images/home/meet-artist/${encodeURIComponent(fileName)}`,
      alt: altFromFilename(fileName)
    }));
  } catch {
    return [];
  }
}
