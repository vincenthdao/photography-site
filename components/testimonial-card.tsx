import { Testimonial } from "@/data/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="animate-rise rounded-2xl border border-black/10 bg-[#fff9f1] p-6 shadow-soft">
      <p className="font-serif text-3xl leading-none text-pine">“</p>
      <p className="text-lg leading-relaxed text-ink/90">{testimonial.quote}</p>
      <p className="mt-4 text-sm font-semibold text-ink">{testimonial.name}</p>
      <p className="text-xs uppercase tracking-[0.2em] text-pine">{testimonial.serviceType} • {testimonial.location}</p>
    </article>
  );
}
