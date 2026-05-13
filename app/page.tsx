import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Hero } from "@/components/hero";
import { HomeGalleryExplorer } from "@/components/home-gallery-explorer";
import { InquiryForm } from "@/components/inquiry-form";
import { SectionHeader } from "@/components/section-header";
import { testimonials } from "@/data/testimonials";
import { ServiceType } from "@/data/types";
import { services } from "@/data/services";
import { FeaturedWork, getFeaturedWorks } from "@/lib/featured-works";
import { getMeetArtistPreviews } from "@/lib/meet-artist-previews";
import { getHomeHeroGridImages } from "@/lib/home-hero-grid";
import { siteConfig } from "@/lib/site";
import { getGalleryCollections } from "@/lib/super-gallery";
import { getTestimonialAlbumPreviews } from "@/lib/testimonial-albums";

function hashString(value: string): number {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }
  return hash >>> 0;
}

function seededShuffle<T>(items: T[], seed: string): T[] {
  return [...items].sort((a, b) => {
    const aKey = hashString(`${seed}:${JSON.stringify(a)}`);
    const bKey = hashString(`${seed}:${JSON.stringify(b)}`);
    return aKey - bKey;
  });
}

const emotionalKeywords = [
  "embrace",
  "kiss",
  "vow",
  "ceremony",
  "dance",
  "hands",
  "tears",
  "laugh",
  "joy",
  "portrait",
  "couple",
  "sunset",
  "light"
];

function emotionalScore(alt: string): number {
  const lower = alt.toLowerCase();
  return emotionalKeywords.reduce((score, keyword) => (lower.includes(keyword) ? score + 2 : score), 0);
}

function selectArtistFrames(works: FeaturedWork[]): FeaturedWork[] {
  const ranked = works
    .map((work, index) => ({ work, score: emotionalScore(work.alt) + Math.max(0, 8 - Math.floor(index / 3)) }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.work);

  const pool = ranked.slice(0, Math.min(18, ranked.length));
  const curated = seededShuffle(pool, "artist-block-v8").slice(0, 3);
  return curated.length >= 3 ? curated : works.slice(0, 3);
}

const collectionPreviewBySlug: Partial<Record<ServiceType, string>> = {
  weddings: "/images/gallery/weddings/Arakaki-562.jpg",
  engagements: "/images/gallery/engagements/Big%20Bear%20Engagement-57.jpg",
  adventure: "/images/adventure.jpg"
};

const servicePriceOverride: Partial<Record<ServiceType, string>> = {
  adventure: "Custom quote"
};

export default async function HomePage() {
  const [featuredWorks, galleryCollections] = await Promise.all([getFeaturedWorks(), getGalleryCollections()]);

  const customHeroGrid = await getHomeHeroGridImages(8);
  const heroGridImages = customHeroGrid.slice(0, 8);

  const trustTestimonials = testimonials.slice(0, 2);
  const testimonialWithPreviews = await Promise.all(
    trustTestimonials.map(async (item) => ({
      ...item,
      previewImages: (await getTestimonialAlbumPreviews(item.albumKey, 4)).slice(0, 4)
    }))
  );

  const primaryServiceOrder: ServiceType[] = ["weddings", "engagements", "adventure"];
  const primaryServices = primaryServiceOrder
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  const curatedStoryFrames = selectArtistFrames(featuredWorks);
  const customStoryFrames = await getMeetArtistPreviews();
  const fallbackPool = curatedStoryFrames.filter(
    (item) => !customStoryFrames.some((custom) => custom.src === item.src)
  );
  const storyFrames = [...customStoryFrames, ...fallbackPool].slice(0, 3);

  const professionalServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    image: `${siteConfig.domain}/images/hero.jpg`,
    description:
      "Wedding, engagement, portrait, event, travel, street, and landscape photography services.",
    areaServed: "Worldwide",
    email: siteConfig.email,
    url: siteConfig.domain
  };

  return (
    <>
      <Hero />

      <section className="mx-auto mb-6 w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="A Warm Welcome"
          title="Start here, with the feeling"
          subtitle="A few of the moments I return to most often, honest, emotive, and rooted in the people at the heart of the story."
        />
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen px-2 sm:px-4 lg:static lg:left-auto lg:right-auto lg:mx-0 lg:w-full lg:px-0">
          <div className="columns-2 gap-2 sm:columns-3 sm:gap-3 lg:columns-4">
          {heroGridImages.map((image, index) => (
            <figure
              key={`${image.src}-${index}`}
              className="mb-2 break-inside-avoid overflow-hidden rounded-xl sm:mb-3"
            >
              <Image
                src={image.src}
                alt={image.alt || "Featured wedding photograph"}
                width={1600}
                height={2200}
                priority={index < 2}
                quality={56}
                sizes="(min-width: 1280px) 23vw, (min-width: 768px) 31vw, 48vw"
                className="block h-auto w-full"
              />
            </figure>
          ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-ink/65">
          Want to swap these images? Drop your favorites into <code>/public/images/home/hero-grid</code>.
        </p>
      </section>

      <section className="mx-auto mb-6 w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-black/10 bg-white/92 p-6 shadow-soft sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-pine/80">Trusted Experience</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {testimonialWithPreviews.map((item) => (
              <blockquote key={`${item.name}-${item.location}`} className="rounded-2xl border border-black/10 bg-[#f7f1e8] p-4">
                {item.previewImages.length > 0 ? (
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    {item.previewImages.map((src, imageIndex) => (
                      <figure key={`${item.name}-${src}-${imageIndex}`} className="overflow-hidden rounded-lg border border-black/10 bg-[#efe5d8]">
                        <Image
                          src={src}
                          alt={`${item.name} preview`}
                          width={700}
                          height={900}
                          loading="lazy"
                          quality={46}
                          sizes="(min-width: 1024px) 11vw, (min-width: 768px) 18vw, 42vw"
                          className="h-24 w-full object-cover sm:h-28"
                        />
                      </figure>
                    ))}
                  </div>
                ) : item.featuredImages?.length ? (
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    {item.featuredImages.slice(0, 4).map((src, imageIndex) => (
                      <figure key={`${item.name}-${src}-${imageIndex}`} className="overflow-hidden rounded-lg border border-black/10 bg-[#efe5d8]">
                        <Image
                          src={src}
                          alt={`${item.name} preview`}
                          width={700}
                          height={900}
                          loading="lazy"
                          quality={46}
                          sizes="(min-width: 1024px) 11vw, (min-width: 768px) 18vw, 42vw"
                          className="h-24 w-full object-cover sm:h-28"
                        />
                      </figure>
                    ))}
                  </div>
                ) : null}
                <p className="text-sm leading-relaxed text-ink/85">“{item.quote}”</p>
                <footer className="mt-3 text-xs uppercase tracking-[0.14em] text-ink/65">
                  {item.name} · {item.location}
                </footer>
                {item.pixiesetUrl ? (
                  <a
                    href={item.pixiesetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block rounded-full border border-ink/20 bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink transition hover:border-pine hover:text-pine"
                  >
                    View Album
                  </a>
                ) : null}
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mb-6 w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-black/10 bg-[linear-gradient(140deg,#f8f4ee_0%,#efe7dc_55%,#f9f6f1_100%)] p-6 shadow-soft sm:p-8 lg:p-10">
          <div className="grid items-start gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:gap-8">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/70">Philosophy</p>
            <p className="font-serif text-2xl leading-[1.4] text-ink sm:text-3xl lg:text-[2rem]">
              I photograph people as they truly are: calm, connected, and fully inside the day. The goal is not to stage a memory,
              but to preserve the feeling of it.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mb-6 w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Services"
          title="What you can book"
          subtitle="Clear starting points, tailored planning, and coverage built around your priorities."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {primaryServices.map((service) => (
            <article key={service.slug} className="rounded-2xl border border-black/10 bg-white/95 p-5 shadow-soft">
              <div className="overflow-hidden rounded-xl border border-black/10">
                <Image
                  src={collectionPreviewBySlug[service.slug] ?? service.heroImage}
                  alt={`${service.title} preview`}
                  width={1200}
                  height={900}
                  className="h-44 w-full object-cover"
                />
              </div>
              <h3 className="mt-4 font-serif text-2xl leading-tight text-ink">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">{service.summary}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-ink/70">
                {servicePriceOverride[service.slug] ? servicePriceOverride[service.slug] : `Starting at ${service.startingPrice}`}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/gallery?category=${service.slug === "adventure" ? "creative" : service.slug}`}
                  className="rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink transition hover:border-pine hover:text-pine"
                >
                  View Gallery
                </Link>
                <Link
                  href={`/?service=${service.slug}#inquire`}
                  className="rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-oat transition hover:bg-black"
                >
                  Let's Talk
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mb-6 w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-black/10 bg-white/92 p-5 shadow-soft sm:p-7 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-pine/80">About Vincent</p>
              <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight text-ink sm:text-4xl">
                A calm presence behind the camera, so you can stay fully in the moment.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/80 sm:text-base">
                My work is shaped by documentary intuition, clean composition, and sensitivity to light. I guide when needed,
                step back when it matters, and build imagery that feels true to your story.
              </p>
              <Link
                href="/about"
                className="mt-6 inline-block rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-oat transition hover:bg-black"
              >
                Meet Vincent
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <figure className="overflow-hidden rounded-2xl border border-black/10 bg-[#efe5d8]">
                <Image
                  src={storyFrames[0]?.src ?? "/images/about.jpg"}
                  alt={storyFrames[0]?.alt || "Wedding photography preview"}
                  width={1200}
                  height={1500}
                  className="h-44 w-full object-cover sm:h-52"
                />
              </figure>
              <figure className="overflow-hidden rounded-2xl border border-black/10 bg-[#efe5d8]">
                <Image
                  src={storyFrames[1]?.src ?? "/images/hero.jpg"}
                  alt={storyFrames[1]?.alt || "Engagement photography preview"}
                  width={1200}
                  height={1500}
                  className="h-44 w-full object-cover sm:h-52"
                />
              </figure>
              <figure className="col-span-2 overflow-hidden rounded-2xl border border-black/10 bg-[#efe5d8]">
                <Image
                  src={storyFrames[2]?.src ?? "/images/about.jpg"}
                  alt={storyFrames[2]?.alt || "Cinematic portrait preview"}
                  width={1600}
                  height={1000}
                  className="h-52 w-full object-cover sm:h-64"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Gallery"
          title="Explore deeper stories"
          subtitle="Switch collections right here, scroll through, then continue down the page when ready."
        />
        <HomeGalleryExplorer collections={galleryCollections} />
      </section>

      <section id="inquire" className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 pb-12 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <SectionHeader
            eyebrow="Inquire"
            title="If this feels like your kind of story, let's plan it together"
            subtitle="Share your date and vision. I will respond with thoughtful next steps."
          />
          <div className="space-y-3 rounded-2xl border border-black/10 bg-white p-5 text-sm text-ink/85 shadow-soft">
            <p>
              <strong>Availability:</strong> {siteConfig.location}
            </p>
            <p>
              <strong>Response Time:</strong> {siteConfig.responseTime}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a className="text-pine underline-offset-2 hover:underline" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </p>
          </div>
        </div>
        <div className="lg:col-span-3">
          <Suspense
            fallback={<div className="rounded-3xl border border-black/10 bg-white p-6 shadow-soft sm:p-8">Loading form...</div>}
          >
            <InquiryForm />
          </Suspense>
        </div>
      </section>

      <Script id="professional-service-schema" type="application/ld+json">
        {JSON.stringify(professionalServiceJsonLd)}
      </Script>
    </>
  );
}
