export const siteConfig = {
  name: "Vincent Dao Photography",
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "vdaophotos@gmail.com",
  instagram: "https://instagram.com/vdao",
  location: "Based in California, Available Worldwide",
  responseTime: "Replies within 24-48 hours"
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/services", label: "Services" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
] as const;
