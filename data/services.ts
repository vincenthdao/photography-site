import { Service } from "@/data/types";

export const services: Service[] = [
  {
    slug: "weddings",
    title: "Weddings",
    summary: "Refined documentary coverage for wedding days and weekends.",
    details:
      "For couples who value imagery that is both emotive and timeless. Includes planning consultation, timeline guidance, and a complete online gallery.",
    startingPrice: "$3,600",
    heroImage: "/images/weddings.jpg",
    featuredImages: ["/images/weddings.jpg", "/images/engagements.jpg"]
  },
  {
    slug: "engagements",
    title: "Engagements",
    summary: "Intentional engagement sessions with a clean, editorial sensibility.",
    details:
      "Designed as a focused portrait experience before your wedding day, with gentle direction and a natural pace that feels true to you.",
    startingPrice: "$1,000",
    heroImage: "/images/engagements.jpg",
    featuredImages: ["/images/engagements.jpg", "/images/adventure.jpg"]
  },
  {
    slug: "adventure",
    title: "Adventure Sessions",
    summary: "Crafted destination sessions for couples drawn to wild, meaningful places.",
    details:
      "Each adventure is tailored around your story. I guide location strategy, timing, trail flow, and light as your navigator, tour guide, and photographer.",
    startingPrice: "$1,200",
    heroImage: "/images/adventure.jpg",
    featuredImages: ["/images/adventure.jpg", "/images/landscape.jpg"]
  },
  {
    slug: "portraits",
    title: "Portraits",
    summary: "Personal and editorial portraits with quiet confidence.",
    details:
      "Ideal for artists, founders, graduates, and families seeking polished yet natural portraits. Includes styling guidance and optional studio session.",
    startingPrice: "$550",
    heroImage: "/images/portraits.jpg",
    featuredImages: ["/images/portraits.jpg", "/images/street.jpg"]
  },
  {
    slug: "events",
    title: "Events",
    summary: "Event coverage with discreet presence and editorial polish.",
    details:
      "For launches, private gatherings, and conferences requiring polished visual documentation. Expedited highlights are available on request.",
    startingPrice: "$900",
    heroImage: "/images/events.jpg",
    featuredImages: ["/images/events.jpg", "/images/travel.jpg"]
  },
  {
    slug: "travel",
    title: "Travel Stories",
    summary: "Location-driven visual narratives for editorial and brand work.",
    details:
      "Commissioned destination storytelling for hospitality, tourism, and creative campaigns. Includes pre-production and shot planning.",
    startingPrice: "Custom Quote",
    heroImage: "/images/travel.jpg",
    featuredImages: ["/images/travel.jpg", "/images/landscape.jpg"]
  },
  {
    slug: "street",
    title: "Street",
    summary: "Urban stories observed with restraint, mood, and rhythm.",
    details:
      "Street-focused sessions and commissioned city narratives emphasizing texture, atmosphere, and candid energy.",
    startingPrice: "$600",
    heroImage: "/images/street.jpg",
    featuredImages: ["/images/street.jpg", "/images/portraits.jpg"]
  },
  {
    slug: "landscape",
    title: "Landscape",
    summary: "Fine-art landscape imagery for publication and print.",
    details:
      "High-resolution landscape work for collectors, editorial features, and interior environments. Licensing is available.",
    startingPrice: "Custom Quote",
    heroImage: "/images/landscape.jpg",
    featuredImages: ["/images/landscape.jpg", "/images/adventure.jpg"]
  }
];
