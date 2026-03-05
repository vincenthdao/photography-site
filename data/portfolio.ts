import { PortfolioItem } from "@/data/types";

export const portfolio: PortfolioItem[] = [
  { category: "weddings", image: "/images/weddings.jpg", alt: "Wedding couple embracing at sunset", featured: true, location: "Yosemite" },
  { category: "engagements", image: "/images/engagements.jpg", alt: "Engagement session on coastal cliff", featured: true, location: "Point Reyes" },
  { category: "adventure", image: "/images/adventure.jpg", alt: "Adventure session in mountain valley", featured: true, location: "Sierra Nevada" },
  { category: "portraits", image: "/images/portraits.jpg", alt: "Natural light portrait in studio", featured: true, location: "Oakland" },
  { category: "events", image: "/images/events.jpg", alt: "Crowd and stage moment at event", featured: true, location: "Los Angeles" },
  { category: "travel", image: "/images/travel.jpg", alt: "Travel story frame of market street", featured: false, location: "Lisbon" },
  { category: "street", image: "/images/street.jpg", alt: "Street portrait in city alley", featured: false, location: "New York" },
  { category: "landscape", image: "/images/landscape.jpg", alt: "Landscape vista at dawn", featured: true, location: "Iceland" }
];
