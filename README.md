# Photographer Client-Conversion Website

Next.js + Tailwind multi-page marketing site for a photography business.

## Implemented

- Multi-page routes: `/`, `/about`, `/services`, `/contact`
- Sticky nav with prominent `Inquire` CTA
- Data-driven services, testimonials, and portfolio content
- Rich inquiry form with prefilled service support from query string
- API route `POST /api/inquiry` with:
  - zod validation
  - honeypot anti-spam field
  - in-memory rate limiting
  - email provider integration (Resend API format)
- SEO and trust signals:
  - per-page metadata
  - `ProfessionalService` JSON-LD
  - sitemap and robots routes
- Vercel Analytics integration

## Local Setup

1. Install Node.js 20+ and npm.
2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env.local
```

4. Start dev server:

```bash
npm run dev
```

## Required Environment Variables

- `INQUIRY_TO_EMAIL`
- `EMAIL_PROVIDER_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

## Notes

- Replace placeholder images in `public/images/` with real portfolio assets.
- For homepage Featured Works, drag and drop images into `public/images/featured/`.
  - Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`
  - Ordering prioritizes engaging/story-driven photos before artsy/detail images.
  - For exact manual order, prefix filenames like `01-hero.jpg`, `02-ceremony.jpg`, `03-dance.jpg`.
- For homepage "The Collections" cards, place one image per collection in `public/images/collections/`:
  - `weddings.jpg`
  - `engagements.jpg`
  - `adventure.jpg`
- For the full Gallery tab, drag and drop photos into:
  - `public/images/gallery/weddings/`
  - `public/images/gallery/engagements/`
  - `public/images/gallery/creative/`
  - The Gallery page auto-loads these images and supports sorting (newest, oldest, filename).
- Replace seed copy in `data/*.ts` and `lib/site.ts` with your brand content.
- The API route uses in-memory rate limiting, which resets per process instance.
