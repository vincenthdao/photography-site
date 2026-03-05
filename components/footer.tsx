import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#eee2d5]">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-serif text-2xl text-ink">{siteConfig.name}</p>
          <p className="mt-3 max-w-sm text-sm italic text-ink/80">"Where light, presence, and memory meet."</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/70">Navigate</p>
          <ul className="mt-3 space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink transition hover:text-pine">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/70">Contact</p>
          <p className="mt-3 text-sm text-ink/90">{siteConfig.location}</p>
          <a className="mt-2 block text-sm text-ink hover:text-pine" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
          <a className="mt-1 block text-sm text-ink hover:text-pine" href={siteConfig.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
