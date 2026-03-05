import Image from "next/image";
import { PortfolioItem } from "@/data/types";

interface ImageMasonryProps {
  items: PortfolioItem[];
  showLocation?: boolean;
}

export function ImageMasonry({ items, showLocation = true }: ImageMasonryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <figure key={`${item.category}-${item.image}`} className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-soft">
          <Image src={item.image} alt={item.alt} width={900} height={1100} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
          <figcaption className="flex items-center justify-between px-4 py-3 text-xs uppercase tracking-[0.18em] text-ink/70">
            <span>{item.category}</span>
            {showLocation ? <span>{item.location}</span> : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
