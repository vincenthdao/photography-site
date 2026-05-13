"use client";

import Link from "next/link";
import { useState } from "react";

type HeroTarget = "inquire" | "gallery";

export function HeroCtaSwitcher() {
  const [active, setActive] = useState<HeroTarget>("inquire");

  return (
    <div className="mt-6 inline-flex rounded-full border border-white/30 bg-black/25 p-1 backdrop-blur-sm">
      <Link
        href="/#inquire"
        onMouseEnter={() => setActive("inquire")}
        onFocus={() => setActive("inquire")}
        onTouchStart={() => setActive("inquire")}
        className={`rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300 ${
          active === "inquire" ? "bg-white text-ink shadow-sm" : "text-white/92 hover:text-white"
        }`}
      >
        Inquire
      </Link>
      <Link
        href="/gallery"
        onMouseEnter={() => setActive("gallery")}
        onFocus={() => setActive("gallery")}
        onTouchStart={() => setActive("gallery")}
        className={`rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300 ${
          active === "gallery" ? "bg-white text-ink shadow-sm" : "text-white/92 hover:text-white"
        }`}
      >
        View Gallery
      </Link>
    </div>
  );
}
