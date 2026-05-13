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

export async function getHomeHeroGridImages(max = 8): Promise<FeaturedWork[]> {
  const directory = path.join(process.cwd(), "public", "images", "home", "hero-grid");

  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b))
      .slice(0, max);

    return files.map((fileName) => ({
      src: `/images/home/hero-grid/${encodeURIComponent(fileName)}`,
      alt: altFromFilename(fileName)
    }));
  } catch {
    return [];
  }
}
