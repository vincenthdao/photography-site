import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { InquiryForm } from "@/components/inquiry-form";
import { SectionHeader } from "@/components/section-header";
import { getBayAreaSessionPhotos } from "@/lib/bay-area-session-photos";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Bay Area Sessions",
  description:
    "Natural, editorial Bay Area portrait, couples, and intimate elopement sessions. Limited June-August availability."
};

const pricing = [
  {
    title: "Portrait Sessions",
    price: "from $800"
  },
  {
    title: "Engagement / Couples Sessions",
    price: "from $1,000"
  },
  {
    title: "Extended Editorial Couples",
    price: "from $1,500"
  },
  {
    title: "City Hall / Intimate Elopements",
    price: "from $1,800"
  }
] as const;

const faqs = [
  {
    q: "We feel awkward in front of the camera. Do you guide us?",
    a: "Yes. I guide with simple prompts and direction that feels natural, so you never feel stiff or over-posed."
  },
  {
    q: "What areas do you cover?",
    a: "San Francisco, Oakland, Berkeley, Marin, and surrounding Bay Area locations."
  },
  {
    q: "What if we are unsure about location?",
    a: "I help you choose based on light, vibe, and how you want the images to feel."
  },
  {
    q: "How do we reserve a date?",
    a: "Submit the inquiry form with your preferred dates and session type. I will follow up with availability and next steps."
  }
] as const;

export default async function BayAreaSessionsPage() {
  const images = await getBayAreaSessionPhotos(12);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
      <SectionHeader
        eyebrow="Bay Area Sessions | June-August"
        title="Editorial, emotional photography for couples, portraits, and intimate celebrations"
        subtitle="Limited summer sessions across San Francisco, Oakland, Berkeley, Marin, and the surrounding Bay Area."
      />

      <div className="rounded-2xl border border-black/10 bg-white/95 p-5 shadow-soft sm:p-6">
        <p className="text-sm leading-relaxed text-ink/85 sm:text-base">
          Natural direction, cinematic locations, honest moments.
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-pine">Limited availability | June-August</p>
        <div className="mt-4">
          <Link
            href="#inquire"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-oat transition hover:bg-black"
          >
            Check Summer Availability
          </Link>
        </div>
      </div>

      <div id="session-work" className="mt-10">
        <SectionHeader
          eyebrow="Session Work"
          title="Selected frames"
          subtitle="A focused preview of portrait, couple, and human-centered imagery."
        />

        <div className="columns-2 gap-2 sm:columns-3 sm:gap-3 lg:columns-4">
          {images.map((image, index) => (
            <figure key={`${image.src}-${index}`} className="mb-2 break-inside-avoid overflow-hidden rounded-xl sm:mb-3">
              <Image
                src={image.src}
                alt={image.alt || "Bay Area session preview"}
                width={1600}
                height={2200}
                priority={index < 2}
                quality={58}
                sizes="(min-width: 1280px) 22vw, (min-width: 768px) 31vw, 48vw"
                className="block h-auto w-full"
              />
            </figure>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink/65">
          Bay Area gallery folder: <code>/public/images/bay-area-sessions</code>
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {pricing.map((item) => (
          <article key={item.title} className="rounded-2xl border border-black/10 bg-white/95 p-4 shadow-soft">
            <p className="text-xs uppercase tracking-[0.12em] text-pine">{item.title}</p>
            <p className="mt-2 font-serif text-2xl text-ink">{item.price}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white/95 p-5 shadow-soft sm:p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-pine">Ready to plan your session?</p>
        <p className="mt-2 text-sm text-ink/80">Share a few details and I will follow up with availability and next steps.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="#inquire"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-oat transition hover:bg-black"
          >
            Check Summer Availability
          </Link>
          <Link
            href="#session-work"
            className="rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine"
          >
            View Session Work
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-black/10 bg-white/95 p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.14em] text-pine">Locations</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/85">
            San Francisco, Oakland, Berkeley, Marin, and surrounding Bay Area.
          </p>
        </article>

        <article className="rounded-2xl border border-black/10 bg-white/95 p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.14em] text-pine">Instagram</p>
          <Link
            href={siteConfig.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm text-ink underline underline-offset-2 hover:text-pine"
          >
            {siteConfig.instagram}
          </Link>
        </article>
      </div>

      <div className="mt-10 rounded-2xl border border-black/10 bg-white/95 p-5 shadow-soft sm:p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-pine">FAQ</p>
        <div className="mt-4 space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="rounded-xl border border-black/10 bg-[#f8f4ef] p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-ink">{item.q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div id="inquire" className="mt-10">
        <SectionHeader
          eyebrow="Inquire"
          title="Request your date"
          subtitle="Tell me what you are planning, and I will follow up personally."
        />
        <Suspense fallback={<div className="rounded-3xl border border-black/10 bg-white p-6 shadow-soft sm:p-8">Loading form...</div>}>
          <InquiryForm submitLabel="Request My Date" />
        </Suspense>
      </div>
    </section>
  );
}
