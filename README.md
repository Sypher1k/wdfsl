# WDF Hambantota — Next.js + Sanity

Production-oriented rebuild of the Women's Development Federation website.

## Architecture

- `src/app/` — real Next.js App Router routes. Each public page has its own `page.tsx`.
- `src/components/` — shared layout, navigation, footer and UI components.
- `src/lib/site.ts` — source-derived static site content.
- `src/sanity/` — Sanity client, GROQ queries, image helpers and schemas.
- `src/app/news-media/page.tsx` — newsroom index.
- `src/app/news-media/[slug]/page.tsx` — individual article pages.
- `src/app/studio/[[...tool]]/page.tsx` — embedded Sanity Studio.
- `public/reports/` — supplied WDF annual reports.

## Sanity setup

1. Create a Sanity project and a `production` dataset.
2. Copy `.env.example` to `.env.local` and add the project ID.
3. Run `npm install`.
4. Start the app with `npm run dev`.
5. Open `/studio` to manage News Articles.
6. Add your production Vercel URL to Sanity API CORS origins.

The `newsArticle` schema supports title, slug, excerpt, category, publication date, author, featured flag, main image and Portable Text body.

Published articles automatically appear on `/news-media`. Clicking an article opens `/news-media/[slug]`.

## Vercel

Set these environment variables in the Vercel project:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `SANITY_API_VERSION=2026-09-01`

Then deploy normally from GitHub.

## Content policy

No current WDF news stories are seeded because no verified article content was supplied. The newsroom displays an empty publishing state until real Sanity articles are created.
