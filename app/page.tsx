import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { CTASection } from "@/components/cta-section";
import { FeaturedWorksGallery } from "@/components/featured-works-gallery";
import { Hero } from "@/components/hero";
import { SectionHeader } from "@/components/section-header";
import { testimonials } from "@/data/testimonials";
import { ServiceType } from "@/data/types";
import { services } from "@/data/services";
import { FeaturedWork, getFeaturedWorks } from "@/lib/featured-works";
import { siteConfig } from "@/lib/site";
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
  const curated = seededShuffle(pool, "artist-block-v6").slice(0, 3);
  return curated.length >= 3 ? curated : works.slice(0, 3);
}

const collectionPreviewBySlug: Partial<Record<ServiceType, string>> = {
  weddings: "/images/gallery/weddings/Arakaki-562.jpg",
  engagements: "/images/gallery/engagements/Big%20Bear%20Engagement-57.jpg"
};

export default async function HomePage() {
  const featuredWorks = await getFeaturedWorks();
  const storyFrames = selectArtistFrames(featuredWorks);
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

      <section className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-black/10 bg-white/90 p-5 shadow-soft sm:p-7 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-pine/80">Start with the artist</p>
              <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight text-ink sm:text-4xl">
                Before the packages and timelines, get to know who is behind the camera.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/80 sm:text-base">
                A calm documentary eye, a human-centered approach, and images built around feeling. If that resonates, this is the best place to begin.
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

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Specialties"
          title="The Collections"
          subtitle="Weddings, engagements, and adventure sessions are the heart of my work."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {primaryServices.map((service) => (
            <div key={service.slug} className="rounded-2xl border border-black/10 bg-white/95 p-5 shadow-soft transition hover:-translate-y-1">
              <div className="overflow-hidden rounded-xl border border-black/10">
                <Image
                  src={collectionPreviewBySlug[service.slug] ?? `/images/collections/${service.slug}.jpg`}
                  alt={`${service.title} collection preview`}
                  width={1200}
                  height={900}
                  className="h-44 w-full object-cover"
                />
              </div>
              <h3 className="font-serif text-2xl leading-tight text-ink">{service.title}</h3>
              <p className="mt-2 text-sm text-ink/80">{service.summary}</p>
              <Link
                href="/services"
                className="mt-4 inline-block rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine"
              >
                Explore Services
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Featured Works"
          title="Wedding highlights curated as a visual gallery"
          subtitle="A cinematic collection designed to be felt as much as seen."
        />
        <FeaturedWorksGallery items={featuredWorks} />
        <div className="mt-6">
          <Link
            href="/gallery"
            className="inline-block rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine"
          >
            View Gallery
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-black/10 bg-white/92 p-6 shadow-soft sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-pine/80">Trusted Experience</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {testimonialWithPreviews.map((item) => (
              <blockquote key={`${item.name}-${item.location}`} className="rounded-2xl border border-black/10 bg-[#f7f1e8] p-4">
                {item.previewImages.length > 0 ? (
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    {item.previewImages.map((src, index) => (
                      <figure key={`${item.name}-${src}-${index}`} className="overflow-hidden rounded-lg border border-black/10 bg-[#efe5d8]">
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
                    {item.featuredImages.slice(0, 4).map((src, index) => (
                      <figure key={`${item.name}-${src}-${index}`} className="overflow-hidden rounded-lg border border-black/10 bg-[#efe5d8]">
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

          <div className="mt-5 grid gap-3 rounded-2xl border border-black/10 bg-white p-4 text-sm text-ink/80 md:grid-cols-2">
            <p>
              <strong className="text-ink">Response time:</strong> {siteConfig.responseTime}
            </p>
            <p>
              <strong className="text-ink">Process:</strong> Inquiry → Planning → Coverage → Curated Gallery
            </p>
          </div>
        </div>
      </section>

      <CTASection
        title="If this season of life matters to you, I would be honored to document it."
        description="Share your plans, your date, and the feeling you want your photographs to hold."
      />

      <Script id="professional-service-schema" type="application/ld+json">
        {JSON.stringify(professionalServiceJsonLd)}
      </Script>
    </>
  );
}
