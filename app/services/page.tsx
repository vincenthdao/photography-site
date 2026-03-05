import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { services } from "@/data/services";
import { ServiceType } from "@/data/types";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore wedding, engagement, adventure, portrait, event, travel, street, and landscape photography services."
};

function serviceBySlug(slug: ServiceType) {
  return services.find((service) => service.slug === slug);
}

export default function ServicesPage() {
  const engagements = serviceBySlug("engagements");
  const weddings = serviceBySlug("weddings");
  const adventure = serviceBySlug("adventure");

  const highlightedServices: ServiceType[] = ["engagements", "weddings", "adventure"];
  const additionalServices = services.filter((service) => !highlightedServices.includes(service.slug));

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-4 pb-8 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <SectionHeader
          eyebrow="Services"
          title="Signature Collections"
          subtitle="Elegant, story-first coverage for engagements and weddings, with bespoke adventure sessions for couples drawn to meaningful places."
        />
      </section>

      {engagements ? (
        <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
          <article className="grid gap-6 rounded-2xl border border-black/10 bg-white p-6 shadow-soft md:grid-cols-2 md:items-center">
            <div className="relative overflow-hidden rounded-2xl">
              <Image src={engagements.heroImage} alt="Engagement session" width={1200} height={900} className="h-[320px] w-full object-cover" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-pine">Engagement Sessions</p>
              <h3 className="mt-2 font-serif text-3xl text-ink">A quiet beginning to your story</h3>
              <p className="mt-3 text-sm text-ink/85">{engagements.summary}</p>
              <p className="mt-3 text-sm text-ink/85">{engagements.details}</p>
              <p className="mt-4 text-sm text-ink/70">Investment from $1,000</p>
              <Link
                href="/gallery?category=engagements"
                className="mt-5 mr-3 inline-block rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine"
              >
                View Gallery
              </Link>
              <Link
                href="/contact?service=engagements"
                className="mt-5 inline-block rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine"
              >
                Inquire
              </Link>
            </div>
          </article>
        </section>
      ) : null}

      {weddings ? (
        <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
          <article className="rounded-2xl border border-black/10 bg-white p-6 shadow-soft">
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-pine">Wedding Coverage</p>
                <h3 className="mt-2 font-serif text-3xl text-ink">Composed with care, documented with heart</h3>
                <p className="mt-3 text-sm text-ink/85">{weddings.summary}</p>
                <p className="mt-3 text-sm text-ink/85">{weddings.details}</p>
                <p className="mt-4 text-sm text-ink/70">Collections begin at $3,600</p>
              </div>
              <div className="relative overflow-hidden rounded-2xl">
                <Image src={weddings.heroImage} alt="Wedding coverage" width={1200} height={900} className="h-[320px] w-full object-cover" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-[#f6f0e8] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-pine">Collection I</p>
                <p className="mt-2 font-serif text-xl text-ink">6-8 Hours</p>
                <p className="mt-1 text-sm text-ink/80">1 photographer, 400+ edited photographs, and an online gallery.</p>
                <p className="mt-2 text-sm text-ink/70">from $3,600</p>
              </div>
              <div className="rounded-xl border border-dashed border-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-pine">Custom</p>
                <p className="mt-2 font-serif text-xl text-ink">Tailored Coverage</p>
                <p className="mt-1 text-sm text-ink/80">10-hour coverage and additional photographer options are available. If your plans are unique, I will help shape the right fit.</p>
              </div>
            </div>

            <Link
              href="/gallery?category=weddings"
              className="mt-6 mr-3 inline-block rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine"
            >
              View Gallery
            </Link>
            <Link
              href="/contact?service=weddings"
              className="mt-6 inline-block rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine"
            >
              Inquire
            </Link>
          </article>
        </section>
      ) : null}

      {adventure ? (
        <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
          <article className="grid gap-6 rounded-2xl border border-black/10 bg-white p-6 shadow-soft md:grid-cols-2 md:items-center">
            <div className="relative overflow-hidden rounded-2xl">
              <Image src={adventure.heroImage} alt="Adventure session" width={1200} height={900} className="h-[320px] w-full object-cover" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-pine">Adventure Sessions</p>
              <h3 className="mt-2 font-serif text-3xl text-ink">Bespoke sessions in meaningful landscapes</h3>
              <p className="mt-3 text-sm text-ink/85">
                Each session is carefully crafted for you. I shape the route, the pace, and the timing around your story and the light.
              </p>
              <p className="mt-3 text-sm text-ink/85">
                Throughout the experience, I work as your navigator, tour guide, and photographer so you can stay present while we create work that feels cinematic and personal.
              </p>
              <p className="mt-4 text-sm text-ink/70">Adventure sessions are tailored to each location and vision. Please reach out for custom planning and proposal details.</p>
              <Link
                href="/contact?service=adventure"
                className="mt-5 inline-block rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine"
              >
                Inquire
              </Link>
            </div>
          </article>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Additional Commissions"
          title="Additional assignments"
          subtitle="Portrait, event, and editorial commissions are available on a select basis."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {additionalServices.map((service) => (
            <article key={service.slug} className="rounded-2xl border border-black/10 bg-white p-5 shadow-soft">
              <h3 className="font-serif text-2xl text-ink">{service.title}</h3>
              <p className="mt-2 text-sm text-ink/80">{service.summary}</p>
              <p className="mt-3 text-sm text-ink/70">Custom quote based on scope and location.</p>
              <Link
                href={`/contact?service=${service.slug}`}
                className="mt-4 inline-block rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine"
              >
                Inquire
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-black/10 shadow-soft">
          <Image
            src="/images/gallery/creative/Bridge Shot.jpg"
            alt="Epic landscape scene from creative work"
            width={2200}
            height={1467}
            className="h-[46vh] w-full object-cover sm:h-[56vh] lg:h-[62vh]"
          />
        </div>
      </section>
    </>
  );
}
