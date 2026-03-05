import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Cormorant_Garamond, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PageTransition } from "@/components/page-transition";
import { siteConfig } from "@/lib/site";

const serif = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-serif", weight: ["400", "500", "600", "700"] });
const sans = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans", weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: "Vincent Dao Photography",
    template: "%s | Vincent Dao Photography"
  },
  description:
    "Wedding, engagement, portrait, event, travel, street, and landscape photographer creating cinematic, emotionally honest imagery.",
  openGraph: {
    title: "Vincent Dao Photography",
    description:
      "Cinematic and documentary-driven photography for weddings, portraits, events, and travel stories.",
    url: siteConfig.domain,
    siteName: siteConfig.name,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Vincent Dao Photography",
    description: "Story-first photography for people and places that matter."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-[var(--font-sans)] text-ink antialiased">
        <Navbar />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
