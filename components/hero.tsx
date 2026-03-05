import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="pb-12 pt-4 sm:pt-6 lg:pt-8">
      <div className="animate-rise relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="Couple walking through dramatic landscape during sunset"
          width={2200}
          height={1200}
          priority
          className="h-[58vh] w-full object-cover sm:h-[70vh] lg:h-[84vh]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8 lg:pb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/90">Wedding & Engagement Photography</p>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.02] text-white drop-shadow sm:text-5xl xl:text-6xl">
              Come as you are, and let the story unfold.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-white/90 sm:text-base">
              For promises spoken softly and glances that say everything, I create photographs that let you feel it all again.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-ink transition hover:bg-[#f4eee6]"
              >
                Inquire
              </Link>
              <Link
                href="/gallery"
                className="rounded-full border border-white/70 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
