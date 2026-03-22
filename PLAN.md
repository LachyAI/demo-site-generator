# Demo Site Generator — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** A Next.js app that generates live demo websites for local service businesses from a simple admin form, hosted on Vercel.

**Architecture:** Single Next.js app with two routes — `/admin` (PIN-protected form to create demos) and `/demo/[slug]` (renders a full single-page business site from JSON config stored in Vercel Blob). Images served from pre-curated AI library on `cdn.opscorescale.com`. No database, no auth beyond PIN.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 3, shadcn/ui, Vercel Blob, Zod, React Hook Form

---

## File Structure

```
demo-site-generator/
├── app/
│   ├── layout.tsx                    # Root layout (Inter + Montserrat fonts)
│   ├── page.tsx                      # Redirect to /admin
│   ├── globals.css                   # Tailwind + shadcn theme tokens
│   ├── admin/
│   │   └── page.tsx                  # Admin dashboard (PIN-gated form)
│   ├── demo/[slug]/
│   │   └── page.tsx                  # Dynamic demo site renderer
│   └── api/
│       ├── demos/route.ts            # GET (list) / POST (create) demo configs
│       └── demos/[slug]/route.ts     # GET (single) / DELETE demo config
├── components/
│   ├── admin/
│   │   ├── pin-gate.tsx              # PIN entry overlay
│   │   ├── demo-form.tsx             # Main form (all sections)
│   │   ├── review-parser.tsx         # Paste + auto-parse Google reviews
│   │   └── demo-list.tsx             # List existing demos with URLs
│   └── demo/
│       ├── navbar.tsx                # Sticky nav with logo + CTA
│       ├── hero.tsx                  # Dark blue hero with trust badges
│       ├── trust-bar.tsx             # Credential strip
│       ├── services.tsx              # Service cards grid
│       ├── how-it-works.tsx          # 3-step process (static)
│       ├── gallery.tsx               # Image grid with hover overlays
│       ├── reviews.tsx               # Review cards with star ratings
│       ├── about.tsx                 # Owner bio section
│       ├── service-areas.tsx         # Suburb tags
│       ├── quote-form.tsx            # Visual-only form
│       ├── footer.tsx                # Dark footer
│       ├── chat-widget.tsx           # Fake chat bubble + greeting
│       └── mobile-sticky-bar.tsx     # Fixed bottom CTA (mobile only)
├── lib/
│   ├── types.ts                      # DemoConfig type + Zod schema
│   ├── defaults.ts                   # Preset services, credentials, suburbs
│   ├── image-map.ts                  # Service category → CDN image URLs
│   ├── blob.ts                       # Vercel Blob CRUD helpers
│   └── utils.ts                      # cn() helper, slug generator
├── public/
│   └── placeholder-avatar.svg        # Default owner avatar
├── .env.local                        # BLOB_READ_WRITE_TOKEN, ADMIN_PIN
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

---

## Task 1: Project Scaffold

**Files:**
- Create: entire project via `create-next-app`
- Modify: `package.json`, `tailwind.config.ts`, `globals.css`

**Step 1: Create Next.js project**

```bash
cd C:/Dev/projects/active
npx create-next-app@latest demo-site-generator --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

**Step 2: Install dependencies**

```bash
cd demo-site-generator
npm install @vercel/blob zod react-hook-form @hookform/resolvers lucide-react
```

**Step 3: Init shadcn/ui**

```bash
npx shadcn@latest init
```
Select: New York style, Slate base color, CSS variables = yes.

**Step 4: Add shadcn components**

```bash
npx shadcn@latest add button card input label textarea select checkbox badge dialog sheet separator toast
```

**Step 5: Configure Tailwind theme**

Update `tailwind.config.ts` — add custom fonts and extend theme:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Montserrat", "system-ui", "sans-serif"],
      },
      colors: {
        // Demo site colors (navy/orange)
        navy: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#243b53",
          900: "#102a43",
        },
        accent: {
          DEFAULT: "#f59e0b",
          hover: "#d97706",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

**Step 6: Set up globals.css with theme tokens**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap');

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 215 25% 15%;
    --primary: 215 90% 32%;
    --primary-foreground: 0 0% 100%;
    --secondary: 25 95% 50%;
    --secondary-foreground: 0 0% 100%;
    --muted: 210 20% 96%;
    --muted-foreground: 220 10% 45%;
    --accent: 210 20% 96%;
    --accent-foreground: 215 25% 15%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 215 90% 32%;
    --radius: 0.5rem;
  }

  /* Admin dashboard dark theme */
  .dark {
    --background: 222 47% 11%;
    --foreground: 210 20% 98%;
    --primary: 215 90% 45%;
    --primary-foreground: 0 0% 100%;
    --secondary: 25 95% 55%;
    --secondary-foreground: 0 0% 100%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --accent: 217 33% 17%;
    --accent-foreground: 210 20% 98%;
    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --ring: 215 90% 45%;
  }
}
```

**Step 7: Commit**

```bash
git init && git add -A && git commit -m "feat: scaffold Next.js project with Tailwind + shadcn"
```

---

## Task 2: Types, Defaults & Utilities

**Files:**
- Create: `lib/types.ts`, `lib/defaults.ts`, `lib/image-map.ts`, `lib/utils.ts`

**Step 1: Create config types and Zod schema**

Create `lib/types.ts`:

```typescript
import { z } from "zod";

export const reviewSchema = z.object({
  name: z.string().min(1),
  rating: z.number().min(1).max(5),
  text: z.string().min(1),
  category: z.string().optional(),
});

export const serviceSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
});

export const demoConfigSchema = z.object({
  slug: z.string().min(1),
  businessName: z.string().min(1),
  ownerName: z.string().optional(),
  phone: z.string().min(1),
  suburb: z.string().min(1),
  serviceArea: z.string().default("Brisbane"),
  tagline: z.string().optional(),
  services: z.array(serviceSchema).min(1),
  reviews: z.array(reviewSchema).min(1),
  credentials: z.array(z.string()),
  suburbs: z.array(z.string()),
  createdAt: z.string().optional(),
});

export type Review = z.infer<typeof reviewSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type DemoConfig = z.infer<typeof demoConfigSchema>;
```

**Step 2: Create defaults**

Create `lib/defaults.ts`:

```typescript
import { Service } from "./types";

export const PRESET_SERVICES: Service[] = [
  { id: "fence-deck", name: "Fence & Deck Repairs", description: "Timber repairs, paling replacement, deck oiling and restoration" },
  { id: "gyprock", name: "Gyprock & Plaster", description: "Hole patching, crack repairs, seamless wall finish" },
  { id: "door-lock", name: "Door & Lock Fixes", description: "Sticky doors, new handles, lock replacements and upgrades" },
  { id: "flatpack", name: "Flatpack Assembly", description: "IKEA, Bunnings, and office furniture assembled fast" },
  { id: "painting", name: "Interior Painting", description: "Scuff repair, wall repainting, and trim refreshment" },
  { id: "silicone", name: "Bathroom & Kitchen Seals", description: "Waterproofing showers, sinks, and gaps to prevent leaks" },
  { id: "pressure-clean", name: "Pressure Cleaning", description: "Driveways, paths, and external wall cleaning" },
  { id: "hanging", name: "Hanging & Odd Jobs", description: "Pictures, shelves, curtain rods, TV mounting, and more" },
  { id: "cabinet", name: "Kitchen Cabinet Repairs", description: "Door adjustments, hinge replacement, soft-close upgrades" },
  { id: "maintenance", name: "General Maintenance", description: "Changing bulbs, fixing taps, adjusting doors, general upkeep" },
  { id: "tiling", name: "Tile Repairs", description: "Cracked tile replacement, re-grouting, waterproofing" },
  { id: "outdoor", name: "Outdoor Repairs", description: "Letterbox fixes, gate repairs, clothesline installation" },
];

export const PRESET_CREDENTIALS = [
  "Police Checked",
  "Fully Insured",
  "ABN Registered",
  "Licensed Builder",
  "Cert III Carpentry",
  "Safety Certified",
];

export const BRISBANE_SUBURBS = [
  "Albion", "Annerley", "Ascot", "Ashgrove", "Auchenflower",
  "Bardon", "Bulimba", "Camp Hill", "Cannon Hill", "Carina",
  "Clayfield", "Coorparoo", "East Brisbane", "Fortitude Valley",
  "Greenslopes", "Hamilton", "Hawthorne", "Highgate Hill",
  "Holland Park", "Indooroopilly", "Kangaroo Point", "Kelvin Grove",
  "Milton", "Morningside", "New Farm", "Newmarket", "Newstead",
  "Norman Park", "Nundah", "Paddington", "Red Hill", "South Brisbane",
  "Spring Hill", "St Lucia", "Taringa", "Toowong", "West End",
  "Wilston", "Woolloongabba", "Wynnum",
];
```

**Step 3: Create image map**

Create `lib/image-map.ts`:

```typescript
const CDN_BASE = "https://cdn.opscorescale.com/demo-images";

// Maps service IDs to arrays of CDN image URLs
// These will be populated after AI image generation
export const SERVICE_IMAGES: Record<string, string[]> = {
  "fence-deck": [
    `${CDN_BASE}/fence-deck-1.jpg`,
    `${CDN_BASE}/fence-deck-2.jpg`,
  ],
  "gyprock": [
    `${CDN_BASE}/gyprock-1.jpg`,
    `${CDN_BASE}/gyprock-2.jpg`,
  ],
  "door-lock": [
    `${CDN_BASE}/door-lock-1.jpg`,
    `${CDN_BASE}/door-lock-2.jpg`,
  ],
  "flatpack": [
    `${CDN_BASE}/flatpack-1.jpg`,
    `${CDN_BASE}/flatpack-2.jpg`,
  ],
  "painting": [
    `${CDN_BASE}/painting-1.jpg`,
    `${CDN_BASE}/painting-2.jpg`,
  ],
  "silicone": [
    `${CDN_BASE}/silicone-1.jpg`,
    `${CDN_BASE}/silicone-2.jpg`,
  ],
  "pressure-clean": [
    `${CDN_BASE}/pressure-clean-1.jpg`,
    `${CDN_BASE}/pressure-clean-2.jpg`,
  ],
  "hanging": [
    `${CDN_BASE}/hanging-1.jpg`,
    `${CDN_BASE}/hanging-2.jpg`,
  ],
  "cabinet": [
    `${CDN_BASE}/cabinet-1.jpg`,
    `${CDN_BASE}/cabinet-2.jpg`,
  ],
  "maintenance": [
    `${CDN_BASE}/maintenance-1.jpg`,
    `${CDN_BASE}/maintenance-2.jpg`,
  ],
  "tiling": [
    `${CDN_BASE}/tiling-1.jpg`,
    `${CDN_BASE}/tiling-2.jpg`,
  ],
  "outdoor": [
    `${CDN_BASE}/outdoor-1.jpg`,
    `${CDN_BASE}/outdoor-2.jpg`,
  ],
};

// Gallery images — picks from client's selected services
export function getGalleryImages(serviceIds: string[]): { src: string; caption: string }[] {
  const images: { src: string; caption: string }[] = [];
  for (const id of serviceIds) {
    const srcs = SERVICE_IMAGES[id] || [];
    const serviceName = id.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    srcs.forEach((src, i) => {
      images.push({ src, caption: `${serviceName} — Project ${i + 1}` });
    });
  }
  return images.slice(0, 6); // Max 6 gallery images
}

// Hero/service card images — first image per service
export function getServiceImage(serviceId: string): string {
  const srcs = SERVICE_IMAGES[serviceId];
  return srcs?.[0] || `${CDN_BASE}/placeholder.jpg`;
}
```

**Step 4: Create utils**

Create `lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
```

**Step 5: Commit**

```bash
git add lib/ && git commit -m "feat: add types, defaults, image map, and utils"
```

---

## Task 3: Vercel Blob Helpers

**Files:**
- Create: `lib/blob.ts`
- Create: `.env.local` (manual — not committed)

**Step 1: Create blob helpers**

Create `lib/blob.ts`:

```typescript
import { put, list, del, head } from "@vercel/blob";
import { DemoConfig, demoConfigSchema } from "./types";

const BLOB_PREFIX = "demos/";

export async function saveDemo(config: DemoConfig): Promise<string> {
  const validated = demoConfigSchema.parse(config);
  const json = JSON.stringify(validated, null, 2);
  const blob = await put(`${BLOB_PREFIX}${config.slug}.json`, json, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  return blob.url;
}

export async function getDemo(slug: string): Promise<DemoConfig | null> {
  try {
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}${slug}.json` });
    if (blobs.length === 0) return null;
    const response = await fetch(blobs[0].url);
    const data = await response.json();
    return demoConfigSchema.parse(data);
  } catch {
    return null;
  }
}

export async function listDemos(): Promise<{ slug: string; url: string; createdAt: string }[]> {
  const { blobs } = await list({ prefix: BLOB_PREFIX });
  return blobs.map((blob) => ({
    slug: blob.pathname.replace(BLOB_PREFIX, "").replace(".json", ""),
    url: blob.url,
    createdAt: blob.uploadedAt.toISOString(),
  }));
}

export async function deleteDemo(slug: string): Promise<boolean> {
  try {
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}${slug}.json` });
    if (blobs.length === 0) return false;
    await del(blobs[0].url);
    return true;
  } catch {
    return false;
  }
}
```

**Step 2: Create .env.local (manual)**

```
BLOB_READ_WRITE_TOKEN=vercel_blob_xxx  # Get from Vercel dashboard after linking
ADMIN_PIN=1234                          # Change to your preferred PIN
```

**Step 3: Commit (blob.ts only, not .env)**

```bash
git add lib/blob.ts && git commit -m "feat: add Vercel Blob CRUD helpers"
```

---

## Task 4: API Routes

**Files:**
- Create: `app/api/demos/route.ts`
- Create: `app/api/demos/[slug]/route.ts`

**Step 1: Create list/create endpoint**

Create `app/api/demos/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { saveDemo, listDemos } from "@/lib/blob";
import { demoConfigSchema } from "@/lib/types";
import { generateSlug } from "@/lib/utils";

export async function GET() {
  const demos = await listDemos();
  return NextResponse.json(demos);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Auto-generate slug if not provided
    if (!body.slug && body.businessName) {
      body.slug = generateSlug(body.businessName);
    }

    // Auto-generate tagline if not provided
    if (!body.tagline && body.businessName && body.suburb) {
      body.tagline = `Reliable ${body.businessName} in ${body.suburb}`;
    }

    body.createdAt = new Date().toISOString();

    const config = demoConfigSchema.parse(body);
    const blobUrl = await saveDemo(config);

    return NextResponse.json({
      slug: config.slug,
      demoUrl: `/demo/${config.slug}`,
      blobUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid config" },
      { status: 400 }
    );
  }
}
```

**Step 2: Create single demo endpoint**

Create `app/api/demos/[slug]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getDemo, deleteDemo } from "@/lib/blob";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const demo = await getDemo(slug);
  if (!demo) {
    return NextResponse.json({ error: "Demo not found" }, { status: 404 });
  }
  return NextResponse.json(demo);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const deleted = await deleteDemo(slug);
  if (!deleted) {
    return NextResponse.json({ error: "Demo not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
```

**Step 3: Commit**

```bash
git add app/api/ && git commit -m "feat: add demo CRUD API routes"
```

---

## Task 5: Demo Site Components (The Main Build)

This is the largest task — 13 components that render the client-facing demo site. Each component receives the `DemoConfig` as props and renders a section.

**Reference architecture:** Single-page Replit site (handyman-page-single.replit.app) — navy/orange, Inter+Montserrat, frosted glass nav, dark hero, mobile sticky bar.

**Files:**
- Create: all files in `components/demo/`

**Step 1: Navbar**

Create `components/demo/navbar.tsx` — sticky frosted glass nav with:
- Business name as logo (font-heading, font-bold)
- Nav anchors: Services, Our Work, Reviews, Areas
- "Get a Free Quote" button (scrolls to #quote)
- "Call Now" button with phone link
- Mobile: hamburger → Sheet with nav links
- Style: `bg-slate-50/95 backdrop-blur-md shadow-lg border-b`

**Step 2: Hero**

Create `components/demo/hero.tsx`:
- Dark blue background (`bg-navy-900 text-white`)
- Trust badge pill: "TRUSTED LOCAL HANDYMAN" in `bg-blue-100 text-navy-900`
- H1: "Reliable Handyman in {suburb}" (font-heading, text-4xl md:text-5xl font-extrabold)
- Subtitle: "Fast, clean, and done right. Repairs, installs & maintenance with clear pricing. Book this week."
- Two CTAs: "Get a Free Quote" (orange) + "Call {phone}" (outline white)
- Credential pills below: each credential as a small badge
- Decorative blurred circle bg element

**Step 3: Trust Bar**

Create `components/demo/trust-bar.tsx`:
- `bg-slate-50 border-y border-slate-100 py-6`
- Horizontal flex of credential badges with checkmark icons
- Responsive: wrap on mobile, single row on desktop

**Step 4: Services**

Create `components/demo/services.tsx`:
- Section heading: "What We Do" with subtitle
- `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- Each card: icon (from lucide-react, mapped by service ID), name, description
- Card style: `rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow p-6`
- Service image from CDN as card background/header

**Step 5: How It Works**

Create `components/demo/how-it-works.tsx`:
- Fully static content (no config needed)
- 3 numbered steps with connecting line
- Step 1: "Fill out the form" — "Upload photos for an accurate estimate"
- Step 2: "Get a quote" — "Clear pricing before we start"
- Step 3: "Job done" — "We arrive on time, complete the work, and clean up"
- Number circles: `h-16 w-16 rounded-2xl bg-white shadow-lg border flex items-center justify-center text-2xl font-bold text-navy-800`
- Connector: `hidden md:block absolute h-0.5 bg-slate-200`

**Step 6: Gallery**

Create `components/demo/gallery.tsx`:
- Section heading: "Our Recent Work"
- `grid grid-cols-2 md:grid-cols-3 gap-4`
- Each image: `aspect-square rounded-xl overflow-hidden bg-slate-100 relative group`
- Hover overlay: `bg-black/20 transition-colors` with frosted caption pill
- Images from `getGalleryImages()` based on config services
- Lightbox dialog on click (shadcn Dialog)

**Step 7: Reviews**

Create `components/demo/reviews.tsx`:
- Section heading: "Trusted by Your Neighbours in {suburb}"
- Grid of review cards (2 cols on desktop)
- Each card: reviewer name, star rating (green stars), review text
- Card style: `bg-white rounded-xl border border-slate-100 p-6 shadow-sm`
- Star rendering: filled/unfilled star icons

**Step 8: About**

Create `components/demo/about.tsx`:
- `bg-slate-50 rounded-2xl p-8 border border-slate-200`
- Owner avatar circle (placeholder SVG) with green "online" dot
- "A Note From {ownerName || 'the Owner'}"
- Generic bio: "I started {businessName} to provide {suburb} homeowners with reliable, quality service they can trust."
- Credential list below bio

**Step 9: Service Areas**

Create `components/demo/service-areas.tsx`:
- Section heading: "Areas We Serve"
- Suburb tags: `inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm`
- Footer text: "{businessName} proudly serves homeowners across {serviceArea}"

**Step 10: Quote Form**

Create `components/demo/quote-form.tsx`:
- Section heading with anchor `id="quote"`
- Form fields: Name, Mobile, Suburb, Job Type (Select from config services), Description (Textarea)
- Urgency radio: Standard / Emergency
- Checkbox: "I agree to be contacted"
- Submit button: orange, "Request Quote"
- On submit: show success toast "Thanks! We'll be in touch shortly." — no actual submission
- Trust copy below: "No hidden fees", "Pricing based on the job", "Final price confirmed after photos"

**Step 11: Footer**

Create `components/demo/footer.tsx`:
- `bg-slate-900 text-slate-400 py-12`
- Business name, tagline
- Quick links (anchor scroll)
- Phone number
- Social icons (Facebook, Instagram — placeholder href="#")
- "© {year} {businessName}"

**Step 12: Chat Widget**

Create `components/demo/chat-widget.tsx`:
- Floating button: bottom-right, `bg-navy-800 text-white rounded-full p-4 shadow-lg`
- MessageCircle icon from lucide-react
- On click: opens chat panel (fixed, bottom-right, 350px wide)
- Chat header: `bg-navy-900 text-white` with owner name + "Online now" green dot
- Single fake message: "Hey! Thanks for checking us out. If you need a quote, fill out the form above or give us a call. Happy to help! 👋"
- Input field (disabled, placeholder "Type a message...")
- Close button

**Step 13: Mobile Sticky Bar**

Create `components/demo/mobile-sticky-bar.tsx`:
- `md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-3 z-50 flex gap-3`
- "Call Now" button (green, `tel:{phone}`)
- "Get a Quote" button (orange, scrolls to #quote)
- Shadow: `shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]`

**Step 14: Commit**

```bash
git add components/demo/ && git commit -m "feat: add all demo site section components"
```

---

## Task 6: Demo Page (Dynamic Route)

**Files:**
- Create: `app/demo/[slug]/page.tsx`

**Step 1: Create the demo renderer**

```typescript
import { getDemo } from "@/lib/blob";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/demo/navbar";
import { Hero } from "@/components/demo/hero";
import { TrustBar } from "@/components/demo/trust-bar";
import { Services } from "@/components/demo/services";
import { HowItWorks } from "@/components/demo/how-it-works";
import { Gallery } from "@/components/demo/gallery";
import { Reviews } from "@/components/demo/reviews";
import { About } from "@/components/demo/about";
import { ServiceAreas } from "@/components/demo/service-areas";
import { QuoteForm } from "@/components/demo/quote-form";
import { Footer } from "@/components/demo/footer";
import { ChatWidget } from "@/components/demo/chat-widget";
import { MobileStickyBar } from "@/components/demo/mobile-sticky-bar";

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = await getDemo(slug);

  if (!config) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar config={config} />
      <Hero config={config} />
      <TrustBar config={config} />
      <Services config={config} />
      <HowItWorks />
      <Gallery config={config} />
      <Reviews config={config} />
      <About config={config} />
      <ServiceAreas config={config} />
      <QuoteForm config={config} />
      <Footer config={config} />
      <ChatWidget config={config} />
      <MobileStickyBar config={config} />
    </div>
  );
}
```

**Step 2: Add metadata generation**

Add to the same file:

```typescript
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = await getDemo(slug);
  if (!config) return { title: "Demo Not Found" };
  return {
    title: `${config.businessName} — ${config.suburb}`,
    description: config.tagline || `Professional handyman services in ${config.suburb}`,
  };
}
```

**Step 3: Commit**

```bash
git add app/demo/ && git commit -m "feat: add dynamic demo page renderer"
```

---

## Task 7: Admin Dashboard

**Files:**
- Create: `components/admin/pin-gate.tsx`
- Create: `components/admin/demo-form.tsx`
- Create: `components/admin/review-parser.tsx`
- Create: `components/admin/demo-list.tsx`
- Create: `app/admin/page.tsx`
- Create: `app/page.tsx` (redirect)

**Step 1: PIN Gate component**

Create `components/admin/pin-gate.tsx`:
- Dark full-screen overlay (matches time-guide style)
- 4-6 digit PIN input (centered, large font)
- Validates against `ADMIN_PIN` env var via API call
- On success: stores PIN in sessionStorage, shows dashboard
- Style: `bg-slate-950 min-h-screen flex items-center justify-center`

**Step 2: Review parser component**

Create `components/admin/review-parser.tsx`:
- Large textarea: "Paste Google reviews here"
- Parse button: extracts reviewer name, star rating, review text
- Regex patterns for common Google review copy-paste formats
- Shows parsed reviews in editable cards below
- Each card: name input, rating select (1-5), text textarea, delete button

**Step 3: Demo form component**

Create `components/admin/demo-form.tsx`:
- Dark themed form (matches time-guide dashboard)
- Sections with clear headings:
  - **Business Info:** name, owner name, phone, suburb, service area
  - **Services:** checkbox grid of PRESET_SERVICES (editable descriptions)
  - **Credentials:** checkbox grid of PRESET_CREDENTIALS
  - **Service Suburbs:** tag-style multi-select from BRISBANE_SUBURBS
  - **Reviews:** review-parser component embedded
- "Generate Demo" button → POST to `/api/demos` → shows success with copy-able URL
- Form validation via react-hook-form + zod resolver
- Style: cards with `bg-slate-800/50 border-slate-700 rounded-xl`

**Step 4: Demo list component**

Create `components/admin/demo-list.tsx`:
- Lists existing demos fetched from `/api/demos`
- Each row: business name, suburb, created date, "Open" link, "Delete" button
- "Copy URL" button per demo
- Style: dark table/list matching dashboard theme

**Step 5: Admin page**

Create `app/admin/page.tsx`:
- Client component (`"use client"`)
- Wraps PIN gate → on success shows dashboard with DemoForm + DemoList side by side
- Header: "Demo Site Generator" with subtitle "Create live demo websites for prospects"

**Step 6: Root redirect**

Create `app/page.tsx`:
```typescript
import { redirect } from "next/navigation";
export default function Home() {
  redirect("/admin");
}
```

**Step 7: Commit**

```bash
git add components/admin/ app/admin/ app/page.tsx && git commit -m "feat: add admin dashboard with PIN gate and demo form"
```

---

## Task 8: Deploy to Vercel

**Step 1: Link to Vercel**

```bash
cd C:/Dev/projects/active/demo-site-generator
npx vercel link
```

**Step 2: Add Vercel Blob storage**

```bash
npx vercel integration add blob
```

Or via Vercel dashboard: Storage → Create → Blob → Connect to project.

**Step 3: Set environment variables**

```bash
npx vercel env add ADMIN_PIN
```
Enter your chosen PIN.

BLOB_READ_WRITE_TOKEN will be auto-provisioned by the Blob integration.

**Step 4: Pull env vars locally**

```bash
npx vercel env pull
```

**Step 5: Test locally**

```bash
npm run dev
```
- Visit `http://localhost:3000/admin` → enter PIN → fill form → generate demo
- Visit the generated demo URL → verify all sections render

**Step 6: Deploy**

```bash
npx vercel --prod
```

**Step 7: Commit any config changes**

```bash
git add -A && git commit -m "feat: add Vercel deployment config"
```

---

## Task 9: AI Image Library (Separate Deliverable)

**Image dimensions needed:**

| Placement | Dimensions | Aspect Ratio | Count per Service |
|-----------|-----------|-------------|-------------------|
| Gallery grid | 800×800px | 1:1 square | 2 images |
| Service card header | 800×450px | 16:9 landscape | 1 image |
| Hero background | 1920×800px | ~2.4:1 ultrawide | 3 generic (not per-service) |

**Total images needed:** 12 services × 2 gallery + 12 service headers + 3 hero = **39 images**

**Leonardo AI prompts (per service category):**

Format: `[service] — [scene description], professional photography, natural lighting, Australian suburban home, clean modern finish, no text or watermarks`

1. **fence-deck-1.jpg** (800×800): "Freshly repaired timber paling fence in an Australian backyard, new timber blending with existing, sunny day, green lawn visible, professional photography, natural lighting"
2. **fence-deck-2.jpg** (800×800): "Restored hardwood timber deck with fresh oil finish, outdoor furniture visible, suburban Brisbane home, professional photography, warm afternoon light"
3. **gyprock-1.jpg** (800×800): "Seamless plaster wall repair on interior white wall, smooth finish ready for paint, close-up showing professional quality, soft natural window light"
4. **gyprock-2.jpg** (800×800): "Handyman applying plaster to repair hole in wall, work in progress, drop sheets on floor, neat and professional workspace"
5. **door-lock-1.jpg** (800×800): "New brushed nickel door handle installed on white interior door, close-up detail shot, modern Australian home, clean and bright"
6. **door-lock-2.jpg** (800×800): "Handyman adjusting a wooden front door with tools, residential entrance, Australian home exterior, professional workwear"
7. **flatpack-1.jpg** (800×800): "Assembled white IKEA bookshelf in a modern living room, books neatly arranged, clean bright interior, professional photography"
8. **flatpack-2.jpg** (800×800): "Assembled wooden desk and office chair in a home office, cable management visible, clean and organized, natural light from window"
9. **painting-1.jpg** (800×800): "Freshly painted white interior wall with crisp edges at ceiling line, roller and tray visible, drop sheets, professional finish"
10. **painting-2.jpg** (800×800): "Interior room with one wall freshly painted in warm gray, painter's tape being removed, clean lines, bright natural light"
11. **silicone-1.jpg** (800×800): "Fresh white silicone sealant applied around modern bathroom shower screen, clean grout lines, tiled wall, professional finish"
12. **silicone-2.jpg** (800×800): "Kitchen sink with fresh silicone seal around edges, stainless steel tap, stone benchtop, clean and bright"
13. **pressure-clean-1.jpg** (800×800): "Half-cleaned concrete driveway showing before and after, pressure washer visible, suburban Australian home, dramatic difference"
14. **pressure-clean-2.jpg** (800×800): "Clean brick pathway after pressure washing, suburban garden visible, bright sunny day, wet gleaming surface"
15. **hanging-1.jpg** (800×800): "Gallery wall of framed pictures hung in a grid pattern on white wall, modern living room, clean and level arrangement"
16. **hanging-2.jpg** (800×800): "Wall-mounted flat screen TV with hidden cables, floating shelf below with devices, modern living room, clean installation"
17. **cabinet-1.jpg** (800×800): "Open kitchen cabinet with new soft-close hinges, white shaker-style doors, organized interior, modern Australian kitchen"
18. **cabinet-2.jpg** (800×800): "Handyman adjusting kitchen cabinet door alignment, screwdriver in hand, white modern kitchen, professional and neat"
19. **maintenance-1.jpg** (800×800): "Modern pendant light fixture installed above kitchen island, warm LED glow, contemporary Australian home interior"
20. **maintenance-2.jpg** (800×800): "Handyman replacing tap washer on bathroom faucet, tools neatly laid out, clean workspace, close-up professional shot"
21. **tiling-1.jpg** (800×800): "Repaired bathroom floor tile seamlessly matching existing pattern, grout lines clean, wet-look finish, overhead shot"
22. **tiling-2.jpg** (800×800): "Fresh white subway tile splashback in kitchen, neat grout lines, stainless steel fixtures, bright modern kitchen"
23. **outdoor-1.jpg** (800×800): "New letterbox installed at front of Australian suburban home, neat garden bed, concrete path, sunny day"
24. **outdoor-2.jpg** (800×800): "Repaired side gate with new latch hardware, timber fence, suburban backyard, professional finish"

**Service card headers (800×450 landscape) — same scenes but wider crop:**

25-36: Same prompts as above but one per service, 800×450 dimensions, suffix `-header.jpg`

**Hero images (1920×800 ultrawide):**

37. **hero-1.jpg**: "Professional handyman in blue polo shirt carrying toolbox walking toward Australian suburban home front door, warm morning light, confident and friendly demeanor"
38. **hero-2.jpg**: "Wide shot of handyman working on timber deck restoration, Brisbane suburban backyard, tools laid out, sunny day, professional workwear"
39. **hero-3.jpg**: "Clean and organized tradesman's van and tools outside a modern Australian home, professional branding-ready, morning light"

**Generation settings for Leonardo AI:**
- Model: Leonardo Kino XL or Phoenix (photorealistic)
- Guidance: 7-8
- No negative prompt needed if using "no text or watermarks" in prompt
- Output format: JPEG, high quality

---

## Task 10: Verification

**Step 1: Create a test demo**

Via admin dashboard, create a demo with:
- Business: "Brett's Handyman Services"
- Owner: "Brett"
- Phone: "0412 345 678"
- Suburb: "Paddington"
- Services: Fence & Deck, Gyprock, Painting, Hanging
- 3-4 sample reviews
- Credentials: Police Checked, Fully Insured, ABN Registered

**Step 2: Verify demo page**

Check all 13 sections render correctly:
- [ ] Navbar shows business name + phone
- [ ] Hero has correct suburb + trust badges
- [ ] Services grid shows only selected services
- [ ] Gallery shows relevant images
- [ ] Reviews display with star ratings
- [ ] About section uses owner name
- [ ] Service areas show selected suburbs
- [ ] Quote form renders with correct service dropdown
- [ ] Footer has business info
- [ ] Chat widget opens with greeting
- [ ] Mobile sticky bar appears on small screens
- [ ] Page metadata (title, description) is correct

**Step 3: Test mobile responsiveness**

- Chrome DevTools → iPhone 14 Pro viewport
- Verify mobile sticky bar, hamburger menu, stacked layouts

---

## Summary

| Task | Description | Est. Time |
|------|-------------|-----------|
| 1 | Project scaffold | 15 min |
| 2 | Types, defaults, utils | 20 min |
| 3 | Vercel Blob helpers | 10 min |
| 4 | API routes | 15 min |
| 5 | Demo site components (13) | 2-3 hours |
| 6 | Demo page renderer | 15 min |
| 7 | Admin dashboard | 1-1.5 hours |
| 8 | Deploy to Vercel | 20 min |
| 9 | AI image library | Separate |
| 10 | Verification | 30 min |

**Total build: ~5-6 hours** (excluding image generation)
