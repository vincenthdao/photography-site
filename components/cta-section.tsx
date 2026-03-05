import Link from "next/link";

interface CTASectionProps {
  title: string;
  description: string;
  buttonText?: string;
}

export function CTASection({ title, description, buttonText = "Begin Inquiry" }: CTASectionProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-[#25392f] bg-[#18231d] px-6 py-12 text-oat sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">Ready When You Are</p>
        <h2 className="mt-3 font-serif text-4xl leading-[0.95] sm:text-5xl">{title}</h2>
        <p className="mt-4 max-w-3xl text-base text-oat/90 sm:text-lg">{description}</p>
        <Link
          href="/contact"
          className="mt-7 inline-block rounded-full bg-oat px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
