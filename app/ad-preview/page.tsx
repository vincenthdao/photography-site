import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { testimonials } from "@/data/testimonials";
import { getFeaturedWorks } from "@/lib/featured-works";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ad Preview",
  description: "Conversion-focused landing page concept for paid ad traffic."
};

export default async function AdPreviewPage() {
  const featured = await getFeaturedWorks();
  const hero = featured[0];
  const highlights = featured.slice(1, 7);
  const proof = testimonials.slice(0, 2);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
      <section className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-soft">
        <div className="relative">
          <Image
            src={hero?.src ?? "/images/hero.jpg"}
            alt={hero?.alt ?? "Wedding couple at sunset"}
            width={2200}
            height={1300}
            priority
            className="h-[58vh] w-full object-cover sm:h-[66vh]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-white/85">Ad Landing Preview</p>
            <h1 className="mt-2 max-w-3xl font-serif text-4xl leading-tight text-white sm:text-5xl">
              You live the day. I protect the feeling of it.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/90 sm:text-base">
              Elegant, natural wedding and engagement photography with calm direction and story-first intent.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/#inquire"
                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-ink transition hover:bg-[#f4eee6]"
              >
                Inquire
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-white/70 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                About Vincent
              </Link>
            </div>
          </div>
        </div>
        <div className="grid gap-3 border-t border-black/10 bg-[#f7f1e8] p-4 text-sm text-ink/85 sm:grid-cols-3">
          <p><strong className="text-ink">Photographer:</strong> 10+ years of experience</p>
          <p><strong className="text-ink">Availability:</strong> {siteConfig.location}</p>
          <p><strong className="text-ink">Response:</strong> {siteConfig.responseTime}</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-3xl text-ink">Recent Highlights</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <figure key={item.src} className="overflow-hidden rounded-2xl border border-black/10 bg-[#efe5d8]">
              <Image
                src={item.src}
                alt={item.alt || "Wedding highlight"}
                width={1200}
                height={900}
                loading="lazy"
                quality={60}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
                className="h-64 w-full object-cover"
              />
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-soft sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-pine/80">What Couples Say</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {proof.map((item) => (
            <blockquote key={`${item.name}-${item.location}`} className="rounded-2xl border border-black/10 bg-[#f7f1e8] p-4">
              <p className="text-sm leading-relaxed text-ink/85">“{item.quote}”</p>
              <footer className="mt-3 text-xs uppercase tracking-[0.14em] text-ink/65">
                {item.name} · {item.location}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-6 text-center shadow-soft sm:p-8">
        <h2 className="font-serif text-3xl text-ink">If this feels like your story, let&apos;s talk.</h2>
        <p className="mt-3 text-sm text-ink/80">Share your date and vision. I&apos;ll guide you through next steps with clarity.</p>
        <Link
          href="/#inquire"
          className="mt-5 inline-block rounded-full bg-ink px-7 py-2.5 text-sm font-semibold text-oat transition hover:bg-black"
        >
          Inquire
        </Link>
      </section>
    </main>
  );
}
