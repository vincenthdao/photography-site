import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const categories = ["weddings", "engagements", "creative"];
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function altFromFilename(fileName) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function loadCategory(category) {
  const dir = path.join(root, "public", "images", "gallery", category);
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => entry.name);

    const photos = await Promise.all(
      files.map(async (fileName) => {
        const stats = await fs.stat(path.join(dir, fileName));
        return {
          src: `/images/gallery/${category}/${encodeURIComponent(fileName)}`,
          alt: altFromFilename(fileName),
          category,
          fileName,
          mtimeMs: stats.mtimeMs
        };
      })
    );

    return photos.sort((a, b) => b.mtimeMs - a.mtimeMs);
  } catch {
    return [];
  }
}

async function main() {
  const [weddings, engagements, creative] = await Promise.all(categories.map((category) => loadCategory(category)));

  const manifest = {
    generatedAt: new Date().toISOString(),
    weddings,
    engagements,
    creative
  };

  const outputPath = path.join(root, "data", "gallery-manifest.json");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`Generated ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
