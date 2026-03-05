import { promises as fs } from "fs";
import path from "path";

export interface FeaturedWork {
  src: string;
  alt: string;
}

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const engagingKeywords = [
  "wedding",
  "couple",
  "kiss",
  "embrace",
  "portrait",
  "vow",
  "dance",
  "ceremony",
  "moment",
  "joy"
];
const artsyKeywords = [
  "abstract",
  "blur",
  "bokeh",
  "texture",
  "shadow",
  "silhouette",
  "grain",
  "detail",
  "artsy",
  "moody"
];

function altFromFilename(fileName: string): string {
  const withoutExt = fileName.replace(/\.[^.]+$/, "");
  return withoutExt
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseManualOrder(fileName: string): number | null {
  const match = fileName.match(/^(\d{1,3})[-_ ]/);
  return match ? Number(match[1]) : null;
}

function scoreFileName(fileName: string): number {
  const lower = fileName.toLowerCase();
  let score = 0;

  for (const keyword of engagingKeywords) {
    if (lower.includes(keyword)) score += 3;
  }
  for (const keyword of artsyKeywords) {
    if (lower.includes(keyword)) score -= 2;
  }

  return score;
}

export async function getFeaturedWorks(): Promise<FeaturedWork[]> {
  const featuredDir = path.join(process.cwd(), "public", "images", "featured");

  try {
    const entries = await fs.readdir(featuredDir, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => entry.name);

    const filesWithStats = await Promise.all(
      files.map(async (name) => {
        const stats = await fs.stat(path.join(featuredDir, name));
        return {
          name,
          mtimeMs: stats.mtimeMs,
          manualOrder: parseManualOrder(name),
          score: scoreFileName(name)
        };
      })
    );

    return filesWithStats
      .sort((a, b) => {
        // If prefixed numbers exist (e.g. 01-hero.jpg), honor those first.
        if (a.manualOrder !== null || b.manualOrder !== null) {
          if (a.manualOrder === null) return 1;
          if (b.manualOrder === null) return -1;
          if (a.manualOrder !== b.manualOrder) return a.manualOrder - b.manualOrder;
        }

        // Otherwise, show more engaging frames first, then newer images.
        if (a.score !== b.score) return b.score - a.score;
        return b.mtimeMs - a.mtimeMs;
      })
      .map(({ name }) => ({
        src: `/images/featured/${encodeURIComponent(name)}`,
        alt: altFromFilename(name)
      }));
  } catch {
    return [];
  }
}
