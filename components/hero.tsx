import Image from "next/image";
import { HeroCtaSwitcher } from "@/components/hero-cta-switcher";

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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/90">Artist • Storyteller • Photographer</p>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.02] text-white drop-shadow sm:text-5xl xl:text-6xl">
              You live it. I preserve the feeling.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-white/90 sm:text-base">
              Creative, human-centered imagery with weddings and couples at the heart of my work.
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-white/80 sm:text-sm">
              10+ years behind the camera
            </p>
            <HeroCtaSwitcher />
          </div>
        </div>
      </div>
    </section>
  );
}
