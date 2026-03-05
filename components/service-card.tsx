import Image from "next/image";
import Link from "next/link";
import { Service } from "@/data/types";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-black/10 bg-white shadow-soft transition hover:-translate-y-1">
      <div className="relative">
        <Image src={service.heroImage} alt={service.title} width={1200} height={900} className="h-56 w-full object-cover" />
      </div>
      <div className="p-6">
        <h3 className="font-serif text-2xl text-ink">{service.title}</h3>
        <p className="mt-2 text-sm text-ink/80">{service.summary}</p>
        <p className="mt-4 text-sm text-ink/85">{service.details}</p>
        <p className="mt-4 text-sm font-semibold text-pine">Starting at {service.startingPrice}</p>
        <Link
          href={`/contact?service=${service.slug}`}
          className="mt-5 inline-block rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine"
        >
          Let's Talk
        </Link>
      </div>
    </article>
  );
}
