import type { Metadata } from "next";
import Link from "next/link";
import { FAQSideCarousel } from "@/components/faq-side-carousel";
import { SectionHeader } from "@/components/section-header";
import { getFAQCarouselPhotos } from "@/lib/faq-carousel-photos";

type FAQ = {
  question: string;
  answer: string;
};

type FAQSection = {
  title: string;
  items: FAQ[];
};

const sections: FAQSection[] = [
  {
    title: "Getting to Know Me",
    items: [
      {
        question: "How would couples describe your energy on a wedding day?",
        answer:
          "Easygoing, respectful, and fully present. I stay calm in the middle of the chaos, and I naturally check in on people throughout the day. Couples often tell me they felt taken care of while everything was happening around them. My goal is to make you feel supported, not managed."
      },
      {
        question: "What matters most to you as a photographer?",
        answer:
          "I care most about the human element. Real emotion, subtle interactions, and moments that are easy to miss are what I’m always watching for. I want your images to feel lived-in and honest, not staged for appearance. The story matters more than perfection."
      },
      {
        question: "How would you describe your style?",
        answer:
          "Elegant, natural, and storytelling-focused. I work in a documentary way, but with intention in composition and light. The result is imagery that feels calm, emotional, and true to the day. You’ll see both the big moments and the quiet ones in between."
      },
      {
        question: "What makes working with you feel different?",
        answer:
          "I don’t just show up to photograph. I’m there with you as a steady presence, especially when the day feels fast and emotional. I pay attention to how everyone is doing and keep the experience grounded. You can trust me to capture the moment while also caring for the people in it."
      }
    ]
  },
  {
    title: "The Wedding Day Experience",
    items: [
      {
        question: "Do you pose us, or do you capture things naturally?",
        answer:
          "Both, in a balanced way. I use natural prompts and guide you with light in mind, so nothing feels forced. I also use visual references on-site when helpful, so you can quickly understand direction. The goal is natural photos with intention, not stiff poses."
      },
      {
        question: "We feel awkward in front of the camera. What should we do?",
        answer:
          "That feeling is completely normal. I believe everyone has something special, and my job is to create space for that to come through. I’ll guide you in a way that feels relaxed and personal to you. Once comfort builds, the photos start feeling like you."
      },
      {
        question: "How do you capture moments without interrupting them?",
        answer:
          "I observe first. I become part of the rhythm of the day and watch for the natural flow of people and events. With experience, I know when to stay invisible and when to step in lightly to guide. That balance helps moments stay real."
      },
      {
        question: "What if our timeline runs behind?",
        answer:
          "I stay calm and prioritize what matters most. I’m very comfortable adjusting in real time and making smart decisions quickly. You won’t get panic energy from me. You’ll get someone who keeps things moving with clarity and composure."
      },
      {
        question: "What if something goes wrong during the day?",
        answer:
          "Weddings are real life, and unexpected things happen. I stay steady, adapt quickly, and keep your experience centered. Even when plans shift, I’m focused on preserving what matters most. You can trust that your story is still being documented beautifully."
      },
      {
        question: "What if it rains or the weather changes?",
        answer:
          "Weather is part of the story, and we can still create strong images in it. I adjust approach, location, and timing based on light and comfort. Some of the most emotional photographs happen in imperfect conditions. Flexibility and calm always win."
      }
    ]
  },
  {
    title: "Your Photos",
    items: [
      {
        question: "What kinds of moments do you focus on most?",
        answer:
          "I look for both the unforgettable and the easily overlooked. The big milestones matter, but so do the quiet glances, breaths, and gestures in between. I’m always trying to capture the unseen and unnoticed with intention. That’s where so much feeling lives."
      },
      {
        question: "What can we expect from your final gallery?",
        answer:
          "A complete visual story of the day, not just a highlight reel. You’ll receive imagery with emotional range, thoughtful sequencing, and strong attention to detail. The goal is for you to relive not only what happened, but how it felt. Your gallery should feel timeless and personal."
      },
      {
        question: "Do you send previews before the full gallery?",
        answer:
          "Yes. I provide preview images before the full gallery is delivered. It gives you something meaningful to hold onto while the full story is being curated. Then your full gallery arrives with everything woven together intentionally."
      },
      {
        question: "What do couples usually say after receiving their photos?",
        answer:
          "A lot of couples say they’re surprised by how many moments were captured. They often tell me they didn’t even realize I was there for certain moments, but somehow those memories are now preserved. The most meaningful feedback is when they say they can truly relive the day."
      },
      {
        question: "Will our photos still feel like us?",
        answer:
          "Yes, that is always the goal. I guide where needed, but I never want you to feel like you’re performing. I pay attention to your natural dynamic and photograph from that place. Your gallery should feel like your story, not someone else’s template."
      }
    ]
  },
  {
    title: "Booking & Planning",
    items: [
      {
        question: "How does booking work?",
        answer:
          "You reach out to check availability, and we confirm your date and details. If we’re a good fit, I share pricing and next steps clearly. To secure your date, you sign the agreement and submit your deposit. Then we begin planning for the day."
      },
      {
        question: "How far in advance should we reach out?",
        answer:
          "As early as you can, especially for popular seasons and weekends. Dates can go quickly, so earlier is always better. Even if your timeline is shorter, it’s still worth reaching out. If I’m available, we can make it work."
      },
      {
        question: "Who are you the right fit for?",
        answer:
          "I’m the right fit for couples who care about real moments more than overly posed images. If you value calm energy, trust, and story-driven photographs, we’ll likely work very well together. I bring a respectful presence and intentional eye to the day. If that feels like you, we’re aligned."
      },
      {
        question: "What if we don’t know exactly what we need yet?",
        answer:
          "That’s completely okay. You don’t need to have everything figured out before reaching out. I’ll help you think through timing, priorities, and what matters most to you. The process is collaborative and human from the beginning."
      },
      {
        question: "What do you want us to feel while working with you?",
        answer:
          "Seen, reassured, and genuinely excited. I want you to feel like you’re in good hands and fully able to be present. My role is to care for the moment while you live it. When that happens, the photographs hold real meaning."
      }
    ]
  }
];

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common wedding photography questions answered with clarity, calm, and care."
};

export default async function FAQPage() {
  const carouselPhotos = await getFAQCarouselPhotos();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pt-20">
      <SectionHeader
        eyebrow="FAQ"
        title="Ahh, you want to get to know me? I'm glad you're here."
        subtitle="Here are the questions couples ask most often, answered the same way I show up on a wedding day: calm, honest, and fully present."
      />

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-black/10 bg-white/90 p-6 shadow-soft sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-serif text-3xl text-ink">{section.title}</h2>
              </div>

              <div className="mt-5 space-y-3">
                {section.items.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-xl border border-black/10 bg-[#f8f4ef] p-4 transition hover:border-[#c5a47e]/60 hover:bg-[#f5efe8]"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-3 [&::-webkit-details-marker]:hidden">
                      <span className="text-base font-semibold text-ink transition group-hover:text-black">{item.question}</span>
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c5a47e]/60 bg-[#c5a47e]/15 text-[#7c6345] transition duration-300 group-hover:bg-[#c5a47e]/30 group-open:rotate-180">
                        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 fill-current">
                          <path d="M5.2 7.5a1 1 0 0 1 1.4 0L10 10.9l3.4-3.4a1 1 0 1 1 1.4 1.4l-4.1 4.1a1 1 0 0 1-1.4 0L5.2 8.9a1 1 0 0 1 0-1.4Z" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-3 pr-8 text-sm leading-relaxed text-ink/80">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="mx-auto max-w-3xl rounded-2xl border border-black/10 bg-white/90 p-6 text-center shadow-soft">
            <p className="font-serif text-2xl text-ink">Still wondering about something?</p>
            <p className="mt-2 text-sm text-ink/80">If your question is not here, reach out directly. I am happy to walk through anything together.</p>
            <Link
              href="/contact"
              className="mt-4 inline-block rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine"
            >
              Inquire
            </Link>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <FAQSideCarousel photos={carouselPhotos} />
          <div className="mt-4 rounded-2xl border border-black/10 bg-white/90 p-4 text-center shadow-soft">
            <Link
              href="/gallery"
              className="inline-flex items-center rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-pine hover:text-pine"
            >
              View All Galleries
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
