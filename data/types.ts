export const serviceTypes = [
  "weddings",
  "engagements",
  "adventure",
  "portraits",
  "events",
  "travel",
  "street",
  "landscape"
] as const;

export type ServiceType = (typeof serviceTypes)[number];

export interface Service {
  slug: ServiceType;
  title: string;
  summary: string;
  details: string;
  startingPrice: string;
  heroImage: string;
  featuredImages: string[];
}

export interface Testimonial {
  name: string;
  serviceType: ServiceType;
  quote: string;
  location: string;
}

export interface PortfolioItem {
  category: ServiceType;
  image: string;
  alt: string;
  featured: boolean;
  location: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
