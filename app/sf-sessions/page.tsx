import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SFSessionsForm } from "@/components/sf-sessions-form";
import { SectionHeader } from "@/components/section-header";
import { getSFSessionPhotos } from "@/lib/sf-session-photos";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "San Francisco Engagement & Portrait Sessions",
  description:
    "Limited Bay Area sessions from June through August for engagements, portraits, SF City Hall elopements, and intimate weddings."
};

const availableDates = [
  "June: Limited weekday + weekend openings",
  "July: Select sunset and golden-hour sessions",
  "August: Final Bay Area openings before travel"
];

const startingPrices = [
  { label: "Portrait Sessions", value: "Starting at $900" },
  { label: "Engagement Sessions", value: "Starting at $1,000" },
  { label: "SF City Hall Elopements/Engagements", value: "Starting at $1,600" },
  { label: "Intimate Weddings", value: "Starting at $3,600" }
];

export default async function SFSessionsPage() {
  const photos = await getSFSessionPhotos(12);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
      <SectionHeader
        eyebrow="Limited Bay Area Sessions"
        title="San Francisco Engagement & Portrait Sessions"
        subtitle="I’ll be based in the Bay Area from June through August and opening a limited number of sessions for couples, engagements, portraits, and intimate weddings."
      />

      <div className="rounded-3xl border border-black/10 bg-white/95 p-5 shadow-soft sm:p-7">
        <p className="text-base leading-relaxed text-ink/85 sm:text-lg">
          My style is natural, editorial, emotional, and location-driven, ideal for people who want images that feel cinematic without feeling overly posed.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {startingPrices.map((item) => (
          <article key={item.label} className="rounded-2xl border border-black/10 bg-white/95 p-4 shadow-soft">
            <p className="text-xs uppercase tracking-[0.14em] text-pine">{item.label}</p>
            <p className="mt-2 font-serif text-2xl text-ink">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-black/10 bg-white/95 p-5 shadow-soft sm:p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-pine">Dates Available</p>
          <ul className="mt-3 space-y-2 text-sm text-ink/85 sm:text-base">
            {availableDates.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/95 p-5 shadow-soft sm:p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-pine">Instagram</p>
          <p className="mt-3 text-sm text-ink/85 sm:text-base">Follow along and DM if you want to talk ideas before submitting the form.</p>
          <Link
            href={siteConfig.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine"
          >
            {siteConfig.instagram}
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <SectionHeader
          eyebrow="Selected Work"
          title="Portrait, couple, and human-centered frames"
          subtitle="Drop 8-12 of your strongest images in this section to shape the first impression of this campaign page."
        />

        <div className="columns-2 gap-2 sm:columns-3 sm:gap-3 lg:columns-4">
          {photos.map((photo, index) => (
            <figure key={`${photo.src}-${index}`} className="mb-2 break-inside-avoid overflow-hidden rounded-xl sm:mb-3">
              <Image
                src={photo.src}
                alt={photo.alt || "San Francisco session preview"}
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
          Folder: <code>/public/images/sf-sessions</code>
        </p>
      </div>

      <div className="mt-10" id="sf-inquire">
        <SectionHeader
          eyebrow="Inquire"
          title="Tell me what you’re envisioning"
          subtitle="Share your ideas below and I’ll reach out with next steps, availability, and the best approach for your session."
        />
        <SFSessionsForm />
      </div>
    </section>
  );
}
