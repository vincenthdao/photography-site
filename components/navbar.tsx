import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/site";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-oat/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-serif text-lg tracking-wide text-ink">
          {siteConfig.name}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-ink transition hover:text-pine">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="rounded-full bg-pine px-4 py-2 text-sm font-semibold text-oat transition hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
        >
          Inquire
        </Link>
      </div>
      <nav aria-label="Mobile" className="mx-auto flex w-full max-w-6xl gap-5 overflow-x-auto px-4 pb-3 text-sm md:hidden">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="whitespace-nowrap text-ink/90 transition hover:text-pine">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
