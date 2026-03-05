import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/section-header";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the photographer and learn the story-first process behind each session and event."
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-12 pt-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pt-20">
        <div>
          <SectionHeader
            eyebrow="About"
            title="A Passion for People and Place"
          />
          <div className="space-y-4 text-ink/85">
            <p>
              Photography began as a love for adventure and documenting the world around me, but it quickly became something more personal. It is how I connect with people, how I preserve moments, and how I tell stories that feel honest and lasting.
            </p>
            <p>
              I am drawn to portraiture because of the human element. The subtle expressions, the quiet energy, and the in-between moments often say more than words ever could. At the same time, my experience in landscape and street photography has shaped the way I see. I look for structure, detail, and intention in every frame, approaching each session with focus and care.
            </p>
            <p>
              Light is at the center of my work. I pay attention to how it falls, how it shapes a subject, and how it brings depth to a scene. Whether I am photographing a person or a place, my goal is the same: to create images that feel natural, thoughtful, and true to the moment.
            </p>
            <p>
              I invite you to{" "}
              <Link href="/gallery" className="text-pine underline-offset-2 hover:underline">
                explore my gallery
              </Link>
              {" "}to get a deeper sense of how I see and create.
            </p>
          </div>
          <Link
            href="/gallery"
            className="mt-6 inline-block rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine"
          >
            View Gallery
          </Link>
        </div>
        <div className="relative overflow-hidden rounded-3xl shadow-soft">
          <Image src="/images/about.jpg" alt="Photographer behind the scenes with camera" width={1200} height={1400} className="h-full min-h-[380px] w-full object-cover" />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Process" title="A signature experience, built around presence" />
        <div className="rounded-3xl border border-black/10 bg-white/92 p-6 shadow-soft sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-pine/85">How we work</p>
              <h3 className="mt-3 max-w-xl font-serif text-3xl leading-tight text-ink sm:text-4xl">
                Calm direction. Honest moments. Imagery that stays with you.
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/80 sm:text-base">
                From first conversation to final delivery, every step is designed to help you feel grounded and fully in the moment. You will always know where we are in the process, what comes next, and what matters most.
              </p>
              <div className="mt-6 rounded-2xl border border-black/10 bg-[#f7f1e8] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-pine">The Promise</p>
                <p className="mt-2 font-serif text-xl text-ink">
                  You live the day. I protect the feeling of it.
                </p>
              </div>
            </div>

            <ol className="grid gap-3 sm:grid-cols-2">
              <li className="rounded-2xl border border-black/10 bg-white p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-pine">01 / Discovery</p>
                <p className="mt-2 text-sm text-ink/80">We align on your story, priorities, and rhythm so coverage feels tailored and intentional.</p>
              </li>
              <li className="rounded-2xl border border-black/10 bg-white p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-pine">02 / Design</p>
                <p className="mt-2 text-sm text-ink/80">I shape a visual game plan around light, setting, and timing while keeping space for spontaneity.</p>
              </li>
              <li className="rounded-2xl border border-black/10 bg-white p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-pine">03 / Presence</p>
                <p className="mt-2 text-sm text-ink/80">On the day, I guide when needed and disappear when it matters, so emotion stays real.</p>
              </li>
              <li className="rounded-2xl border border-black/10 bg-white p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-pine">04 / Legacy</p>
                <p className="mt-2 text-sm text-ink/80">Your gallery is edited with depth, sequencing, and consistency to feel timeless for years to come.</p>
              </li>
            </ol>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-black/10 pt-6">
            <p className="text-sm text-ink/75">Curious about more?</p>
            <Link
              href="/faq"
              className="inline-block rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-black/10 shadow-soft">
          <Image
            src="/images/gallery/creative/Florence Sunset Landscape.jpg"
            alt="Landscape photo from creative work"
            width={2200}
            height={1238}
            className="h-[44vh] w-full object-cover sm:h-[54vh] lg:h-[60vh]"
          />
        </div>
      </section>
    </>
  );
}
