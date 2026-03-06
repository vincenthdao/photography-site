import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryForm } from "@/components/inquiry-form";
import { SectionHeader } from "@/components/section-header";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send an inquiry for weddings, portraits, events, adventure sessions, and destination storytelling."
};

export default function ContactPage() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-5 lg:px-8 lg:pt-20">
      <div className="lg:col-span-2">
        <SectionHeader
          eyebrow="Contact"
          title="Tell me about what you are planning"
          subtitle="Share your date, location, and priorities. I will follow up with thoughtful next steps."
        />
        <div className="space-y-3 rounded-2xl border border-black/10 bg-white p-5 text-sm text-ink/85 shadow-soft">
          <p>
            <strong>Availability:</strong> {siteConfig.location}
          </p>
          <p>
            <strong>Response Time:</strong> {siteConfig.responseTime}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a className="text-pine underline-offset-2 hover:underline" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
          </p>
          <p>
            <strong>Instagram:</strong>{" "}
            <a className="text-pine underline-offset-2 hover:underline" href={siteConfig.instagram} target="_blank" rel="noreferrer">
              {siteConfig.instagram}
            </a>
          </p>
        </div>
      </div>
      <div className="lg:col-span-3">
        <Suspense fallback={<div className="rounded-3xl border border-black/10 bg-white p-6 shadow-soft sm:p-8">Loading form...</div>}>
          <InquiryForm />
        </Suspense>
      </div>
    </section>
  );
}
