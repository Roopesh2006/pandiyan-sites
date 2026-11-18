# 🔍 PANDIYAN SITES — SEO DOMINATION + CINEMATIC ANIMATION GUIDE
### Addendum to Master Build Instructions
**Goal 1:** Rank #1 on Google for "pandiyan sites", "real estate Tamil Nadu", "property for sale Chennai", and 40+ related queries  
**Goal 2:** Cinematic scroll animations that make visitors feel the weight and beauty of the properties

---

## PART 1 — MAKING GOOGLE LOVE PANDIYAN SITES

### The Honest Truth About SEO Rankings

There is no single magic trick. Google's algorithm uses 200+ signals. But for a local Indian real estate website competing in Tamil Nadu, the battle is very winnable because most local real estate sites have **terrible technical SEO**. If you do everything in this document, you will outrank 90% of them within 3–6 months of consistent listings.

The hierarchy of what matters, in order of impact:

```
1. Technical SEO (code-level — OpenCode does this)
2. Google Search Console setup (manual — you do this)
3. Google Business Profile / Maps (manual — you do this)
4. Schema / Structured Data (code-level — OpenCode does this)
5. Content quality (OpenCode writes initial, you maintain)
6. Page speed / Core Web Vitals (code-level)
7. Backlinks / Citations (ongoing effort)
```

---

## SECTION A — TECHNICAL SEO (OPENCODE TASKS)

### A1. Dynamic Sitemap (`app/sitemap.ts`)

This is the most important file for Google to find all your property pages automatically.

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()
  const baseUrl = 'https://www.pandiyansites.com' // Update after domain setup
  
  // Fetch all active properties for dynamic URLs
  const { data: properties } = await supabase
    .from('properties')
    .select('id, updated_at')
    .eq('is_active', true)
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/properties?type=apartment`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/properties?type=villa`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/properties?type=plot`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/properties?listing=sale`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/properties?listing=rent`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]
  
  // Dynamic property pages
  const propertyPages: MetadataRoute.Sitemap = (properties || []).map((p) => ({
    url: `${baseUrl}/properties/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  
  return [...staticPages, ...propertyPages]
}
```

### A2. Robots.txt (`app/robots.ts`)

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/login', '/api/'],
      },
    ],
    sitemap: 'https://www.pandiyansites.com/sitemap.xml',
    host: 'https://www.pandiyansites.com',
  }
}
```

### A3. Root Layout Metadata (`app/layout.tsx`)

This is what Google reads as the "face" of your site. Every word matters.

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.pandiyansites.com'),
  
  title: {
    default: 'Pandiyan Sites | Premium Properties in Tamil Nadu',
    template: '%s | Pandiyan Sites',
  },
  
  description: 'Pandiyan Sites — Tamil Nadu\'s trusted real estate marketplace. Find apartments, villas, plots, and commercial properties for sale and rent in Chennai, Tambaram, OMR, Anna Nagar, and across Tamil Nadu. Direct owner listings with WhatsApp contact.',
  
  keywords: [
    // Brand keywords
    'Pandiyan Sites', 'Pandiyan real estate', 'Pandiyan properties',
    // Location keywords
    'properties in Chennai', 'real estate Tamil Nadu', 'plots for sale Chennai',
    'apartments in Anna Nagar', 'villas in Chennai', 'property in Tambaram',
    'OMR apartments', 'Velachery properties', 'T Nagar commercial',
    // Transaction keywords
    'property for sale Chennai', 'house for rent Chennai', 'plots for sale Tamil Nadu',
    'commercial space Chennai', 'office space for rent Chennai',
    // Type keywords
    'BHK apartment Chennai', 'independent house Chennai', 'farm land Tamil Nadu',
    'warehouse for rent Chennai', 'shop space T Nagar',
    // Intent keywords
    'buy property Chennai', 'rent apartment Chennai', 'real estate agent Tamil Nadu',
    'DTCP approved plots Chennai', 'Vastu friendly homes Chennai',
  ],
  
  authors: [{ name: 'Pandiyan Sites', url: 'https://www.pandiyansites.com' }],
  creator: 'Pandiyan Sites',
  publisher: 'Pandiyan Sites',
  
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.pandiyansites.com',
    siteName: 'Pandiyan Sites',
    title: 'Pandiyan Sites | Premium Real Estate in Tamil Nadu',
    description: 'Find your dream property in Tamil Nadu. Verified residential and commercial listings — apartments, villas, plots, and more.',
    images: [
      {
        url: '/og-image.jpg', // 1200x630px image — add this to /public
        width: 1200,
        height: 630,
        alt: 'Pandiyan Sites — Premium Real Estate Tamil Nadu',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Pandiyan Sites | Real Estate Tamil Nadu',
    description: 'Verified property listings across Chennai & Tamil Nadu. Apartments, villas, plots, commercial spaces.',
    images: ['/og-image.jpg'],
  },
  
  // Google Search Console verification (get this code from Search Console)
  verification: {
    google: 'PASTE_YOUR_GOOGLE_VERIFICATION_CODE_HERE',
  },
  
  alternates: {
    canonical: 'https://www.pandiyansites.com',
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  category: 'Real Estate',
}
```

### A4. Dynamic Metadata for Property Pages

Each property page needs its own unique, keyword-rich title and description. Google uses this for every listing.

```typescript
// app/(public)/properties/[id]/page.tsx

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data: property } = await supabase
    .from('properties')
    .select('*, property_images(image_url, is_primary)')
    .eq('id', params.id)
    .single()
  
  if (!property) return { title: 'Property Not Found | Pandiyan Sites' }
  
  const primaryImage = property.property_images?.find((img: any) => img.is_primary)
  const priceFormatted = formatIndianPrice(property.price, property.price_unit)
  const typeLabel = property.property_type.replace('_', ' ')
  
  const title = `${property.bedrooms ? `${property.bedrooms} BHK ` : ''}${typeLabel} ${property.listing_type === 'sale' ? 'for Sale' : 'for Rent'} in ${property.location_area} — ${priceFormatted}`
  
  const description = `${property.title}. ${property.area_sqft ? `${property.area_sqft} sqft. ` : ''}${property.bedrooms ? `${property.bedrooms} Bedrooms. ` : ''}${property.bathrooms ? `${property.bathrooms} Bathrooms. ` : ''}Located in ${property.location_area}, ${property.location_city}. Contact Pandiyan Sites on WhatsApp for details.`
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: primaryImage ? [{ url: primaryImage.image_url, width: 1200, height: 630 }] : [],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: `https://www.pandiyansites.com/properties/${params.id}`,
    },
  }
}
```

### A5. JSON-LD Structured Data (Schema.org)

This is what makes Google show **rich results** — your property listings can appear with price, bedrooms, location, and images directly in Google Search.

#### Organization Schema (in root layout — always present)
```tsx
// components/seo/OrganizationSchema.tsx
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Pandiyan Sites",
    "url": "https://www.pandiyansites.com",
    "logo": "https://www.pandiyansites.com/logo.png",
    "description": "Premium real estate marketplace in Tamil Nadu offering verified residential and commercial property listings.",
    "telephone": "+91-9XXXXXXXXX",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "YOUR ADDRESS",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "postalCode": "600XXX",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "13.0827",
      "longitude": "80.2707"
    },
    "areaServed": [
      "Chennai", "Tambaram", "Anna Nagar", "Velachery", "OMR", 
      "T. Nagar", "Adyar", "Guindy", "Tamil Nadu"
    ],
    "sameAs": [
      "https://www.facebook.com/pandiyansites",
      "https://www.instagram.com/pandiyansites",
    ]
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

#### Property Listing Schema (on each property detail page)
```tsx
// components/seo/PropertySchema.tsx
export function PropertySchema({ property, images }: { property: Property, images: PropertyImage[] }) {
  
  const typeMap: Record<string, string> = {
    apartment: "Apartment",
    villa: "House",
    plot: "LandLot",
    commercial: "CommercialBuilding",
    office: "OfficeBuilding",
    independent_house: "SingleFamilyResidence",
    shop: "LocalBusiness",
    warehouse: "WarehouseStorageFacility",
    farm_land: "LandLot",
  }
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description || `${property.property_type} ${property.listing_type === 'sale' ? 'for sale' : 'for rent'} in ${property.location_area}, Chennai`,
    "url": `https://www.pandiyansites.com/properties/${property.id}`,
    "datePosted": property.created_at,
    "image": images.map(img => img.image_url),
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "businessFunction": property.listing_type === 'sale' 
        ? "https://schema.org/Sell" 
        : "https://schema.org/LeaseOut",
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address || property.location_area,
      "addressLocality": property.location_city,
      "addressRegion": "Tamil Nadu",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "addressCountry": "IN",
      "addressLocality": property.location_area
    },
    "numberOfRooms": property.bedrooms || undefined,
    "numberOfBathroomsTotal": property.bathrooms || undefined,
    "floorSize": property.area_sqft ? {
      "@type": "QuantitativeValue",
      "value": property.area_sqft,
      "unitCode": "FTK"
    } : undefined,
    "amenityFeature": (property.amenities || []).map((amenity: string) => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity,
      "value": true,
    })),
    "seller": {
      "@type": "RealEstateAgent",
      "name": "Pandiyan Sites",
      "url": "https://www.pandiyansites.com",
      "telephone": "+91-9XXXXXXXXX"
    }
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

#### Homepage BreadcrumbList + WebSite Schema
```tsx
export function HomepageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Pandiyan Sites",
    "url": "https://www.pandiyansites.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.pandiyansites.com/properties?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
```

### A6. `next.config.js` — Image Optimization + Performance

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Compression
  compress: true,
  // Remove powered-by header
  poweredByHeader: false,
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
  // Redirects (add www redirect if needed)
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
```

### A7. `public/manifest.json` — PWA + App-like Feel

```json
{
  "name": "Pandiyan Sites",
  "short_name": "Pandiyan Sites",
  "description": "Premium Real Estate in Tamil Nadu",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1B2B3A",
  "theme_color": "#C8964D",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["real estate", "property", "business"]
}
```

Add to `app/layout.tsx` metadata:
```typescript
manifest: '/manifest.json',
themeColor: '#C8964D',
appleWebApp: {
  capable: true,
  statusBarStyle: 'default',
  title: 'Pandiyan Sites',
},
```

### A8. URL Structure — SEO-Friendly Property Slugs

Instead of `/properties/uuid-here`, add human-readable slugs for better Google rankings:

```
/properties/3-bhk-apartment-anna-nagar-chennai-for-sale
/properties/1200-sqft-dtcp-plot-tambaram
/properties/commercial-shop-t-nagar-chennai-for-rent
```

Add `slug` column to properties table:
```sql
ALTER TABLE properties ADD COLUMN slug TEXT UNIQUE;

-- Auto-generate slug function
CREATE OR REPLACE FUNCTION generate_property_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Build slug from: bedrooms + type + location + listing_type
  base_slug := LOWER(
    COALESCE(NEW.bedrooms::TEXT || '-bhk-', '') ||
    REPLACE(NEW.property_type, '_', '-') || '-' ||
    REPLACE(LOWER(NEW.location_area), ' ', '-') || '-' ||
    REPLACE(LOWER(NEW.location_city), ' ', '-') || '-for-' ||
    NEW.listing_type
  );
  -- Remove special chars
  base_slug := REGEXP_REPLACE(base_slug, '[^a-z0-9-]', '', 'g');
  base_slug := REGEXP_REPLACE(base_slug, '-+', '-', 'g');
  
  final_slug := base_slug;
  
  -- Handle duplicates
  WHILE EXISTS (SELECT 1 FROM properties WHERE slug = final_slug AND id != NEW.id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter::TEXT;
  END LOOP;
  
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_property_slug
  BEFORE INSERT OR UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION generate_property_slug();
```

Update routes to use slug:
```
/properties/[slug]/page.tsx  (fetches by slug, not UUID)
```

### A9. Core Web Vitals — Critical for Rankings

Google uses LCP, INP, and CLS as ranking signals. These code patterns protect them:

```tsx
// ✅ LCP optimization: preload hero image
// In app/(public)/page.tsx Server Component, add this to <head>:
export default async function HomePage() {
  const config = await getSiteConfig() // fetch banner URL
  return (
    <>
      <link rel="preload" as="image" href={config.banner_image_url} fetchPriority="high" />
      {/* rest of page */}
    </>
  )
}

// ✅ Avoid CLS: always specify image dimensions
<Image
  src={property.primary_image}
  width={800}
  height={600}
  alt={property.title}
  className="object-cover"
  priority={isAboveFold}  // only for first visible image
/>

// ✅ Lazy load below-fold images
<Image
  src={property.image}
  width={400}
  height={300}
  alt={property.title}
  loading="lazy"  // default, but explicit is good
/>

// ✅ Font optimization (in layout.tsx)
import { Cormorant_Garamond, DM_Sans, Playfair_Display } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap', // CRITICAL: prevents invisible text during load
})
```

---

## SECTION B — GOOGLE SEARCH CONSOLE & BING (MANUAL STEPS — YOU DO THIS)

### Step 1: Google Search Console

1. Go to **[https://search.google.com/search-console](https://search.google.com/search-console)**
2. Click **"Add Property"** → choose **"URL prefix"** → enter `https://www.pandiyansites.com`
3. Choose **"HTML tag"** verification method
4. Copy the verification code (looks like: `google-site-verification=XXXXXXXXXXX`)
5. Paste it in `next.config.js` metadata verification field (see A3 above)
6. Deploy → come back and click **Verify**
7. After verification: **Sitemaps** → **Add Sitemap** → enter `sitemap.xml` → Submit
8. Wait 24–48 hours, then check **Coverage** → **Valid** pages

**Use URL Inspection tool:** Paste `https://www.pandiyansites.com` → "Request Indexing" → Do this for homepage and first 5 properties manually. Google picks them up within hours.

### Step 2: Bing Webmaster Tools

Bing powers Yahoo, DuckDuckGo, and voice assistants — don't ignore it.

1. Go to **[https://www.bing.com/webmasters](https://www.bing.com/webmasters)**
2. Sign in → Add Site → Enter URL
3. Submit sitemap: `https://www.pandiyansites.com/sitemap.xml`
4. In the **Auto Import** option, log in with Google account to import Search Console data directly

---

## SECTION C — GOOGLE BUSINESS PROFILE (THE LOCAL SEO SUPERWEAPON)

This is the single most powerful thing you can do for local search. When someone searches "real estate near me" or "property agent Chennai", the Google Maps 3-pack appears ABOVE organic results. This is where you want to be.

### Setup Steps (Manual — You Do This)
1. Go to **[https://business.google.com](https://business.google.com)**
2. Create profile:
   - **Business name:** `Pandiyan Sites`
   - **Category:** `Real estate agency` (primary) + `Real estate agent` (secondary)
   - **Location:** Your office address in Tamil Nadu
   - **Service area:** Chennai, Tambaram, OMR, Velachery, Anna Nagar, Tamil Nadu (add all areas you serve)
   - **Phone:** Your WhatsApp-enabled number
   - **Website:** `https://www.pandiyansites.com`
3. Verify via postcard (Google mails a card with a PIN to your address — takes 7–14 days)

### Profile Optimization Checklist
```
Business Description (750 chars — fill ALL of it):
  Write: "Pandiyan Sites is Tamil Nadu's trusted premium real estate marketplace 
  offering verified property listings across Chennai, Tambaram, Anna Nagar, OMR, 
  Velachery, T. Nagar, and Adyar. We specialize in residential apartments, 
  independent houses, villas, DTCP-approved plots, and commercial spaces for 
  sale and rent. Contact us on WhatsApp for instant property information. 
  Every listing is personally verified by our team."

Photos to upload (minimum 20):
  - Logo (transparent background, square)
  - Cover photo (1080×608px — your hero banner)
  - 5-10 property photos (exterior and interior shots)
  - Office exterior photo (even if it's just your house — adds credibility)

Posts (create 1-2 per week after launch):
  - New property listing (with photo + price + "Contact on WhatsApp")
  - "Property of the Week" feature
  - Tips for buyers/renters in Tamil Nadu

Services to add:
  - Property Sales
  - Property Rental
  - Commercial Space Leasing
  - Plot Sales
  - Villa Sales
  - Property Consultation

Q&A Section:
  Add these questions yourself (before customers ask), then answer them:
  - "What areas do you cover?"
  - "How do I contact about a property?"
  - "Are listings verified?"
  - "Do you have plots for sale in Chennai?"
```

---

## SECTION D — ON-PAGE SEO CONTENT STRATEGY

### Keyword-Optimized Page Titles (H1s)

```
Homepage H1: "Find Premium Properties in Tamil Nadu" 
  (not just "Welcome" — contains the main keyword)

All Properties H1: "Properties for Sale & Rent in Chennai, Tamil Nadu"

Filter pages (use generateMetadata dynamically):
  /properties?type=apartment → "Apartments in Chennai | Buy & Rent | Pandiyan Sites"
  /properties?type=villa → "Villas for Sale in Chennai | Pandiyan Sites"
  /properties?type=plot → "DTCP Plots for Sale in Chennai & Tamil Nadu"
  /properties?listing=sale → "Properties for Sale in Chennai, Tamil Nadu"
  /properties?listing=rent → "Houses & Apartments for Rent in Chennai"
```

### Property Descriptions — SEO Template for Admin
Tell your client to write descriptions like this (add instructions in dashboard):

```
GOOD (SEO-optimized):
"Spacious 3 BHK apartment for sale in Anna Nagar, Chennai. Located on 2nd Main Road 
near Anna Nagar Tower bus stop, this 1350 sqft east-facing flat offers modern 
amenities including covered parking, 24/7 water supply, and power backup. 
Semi-furnished with modular kitchen and built-in wardrobes. Vastu compliant. 
Ideal for families. Clear title documents. Price ₹85 Lakhs negotiable."

BAD: "Nice flat. Good location. Contact for details."
```

Add a "Description Tips" tooltip in the dashboard form with this guidance.

### Internal Linking Strategy
Every property card and page should link to related properties:

```
On property detail page, add section:
  "Similar Properties in [Location]" — 3 cards (same type + area, fetched from Supabase)
  "More [Property Type] in Chennai" — 3 cards (same type, different area)
  
This creates an internal link web that Google crawls deeply.
```

---

## SECTION E — VERCEL + PERFORMANCE CONFIGURATION

### `vercel.json` — Caching, Headers, and Redirects

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "/sitemap"
    }
  ],
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "pandiyansites.vercel.app" }],
      "destination": "https://www.pandiyansites.com/:path*",
      "permanent": true
    }
  ]
}
```

### ISR (Incremental Static Regeneration) for Property Pages

Property pages should be fast like static pages but update when admin adds new listings:

```typescript
// app/(public)/properties/[id]/page.tsx
export const revalidate = 3600 // Regenerate every 1 hour

// app/(public)/properties/page.tsx  
export const revalidate = 1800 // Every 30 minutes

// app/(public)/page.tsx (homepage)
export const revalidate = 3600
```

When admin adds/edits a property, trigger revalidation:
```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const { propertyId } = await request.json()
  revalidatePath('/properties')
  revalidatePath(`/properties/${propertyId}`)
  revalidatePath('/')
  return Response.json({ revalidated: true })
}
```

Call this API from the dashboard after every property save.

---

## SECTION F — ONGOING SEO CONTENT CALENDAR (POST-LAUNCH)

These are things you (the client) do after launch to maintain and grow rankings:

```
WEEK 1: 
  - Verify Search Console + submit sitemap
  - Set up Google Business Profile + start verification

MONTH 1:
  - Add minimum 10 real property listings (more content = better)
  - Request indexing in Search Console for each property URL
  - Post 4 times on Google Business Profile

MONTH 2+:
  - Continue adding listings (Google rewards fresh content)
  - Respond to all GMB reviews (even if first few come from family)
  - List on these free directories (NAP consistency is key):
    → Justdial.com
    → Sulekha.com
    → 99acres.com (free basic listing)
    → MagicBricks.com (free basic)
    → Indiamart.com
    → Facebook Business Page
    → Instagram Business Account

NEVER do:
  - Buy fake backlinks
  - Keyword stuff descriptions
  - Use the same description on multiple properties
  - Block /_next/ in robots.txt (breaks Google rendering)
```

---

---

## PART 2 — CINEMATIC SCROLL ANIMATIONS

### Philosophy for Pandiyan Sites

You asked for animations that feel like **breaking an image into parts and watching them move as you scroll** — like a building being assembled as you scroll down. This is achievable with Framer Motion and will make the site feel like a premium architectural experience.

**The animation personality:** Slow, deliberate, weighty. Like heavy stone and teak wood. Not bouncy or elastic — those feel cheap. Every motion should feel *architectural*.

**Library stack:**
```
framer-motion — scroll-linked animations, reveals, parallax (React-native)
lenis — smooth scroll (replaces browser default jerky scroll)
GSAP + ScrollTrigger — only for complex pinned sequences (NOT required initially — add in Phase 2 if needed)
```

Install:
```bash
npm install framer-motion lenis
```

---

### ANIMATION 1: "The Curtain Reveal" — Hero Image

The hero banner image is hidden behind a dark curtain that wipes away on load, revealing the property like unveiling a painting.

```tsx
// components/public/HeroCurtain.tsx
"use client"
import { motion } from "framer-motion"

export function HeroCurtain({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {/* The actual content */}
      {children}
      
      {/* The curtain — navy panel that slides up to reveal */}
      <motion.div
        className="absolute inset-0 z-20"
        style={{ backgroundColor: 'var(--color-surface-dark)' }}
        initial={{ scaleY: 1, originY: 0 }}
        animate={{ scaleY: 0, originY: 0 }}
        transition={{
          duration: 1.2,
          ease: [0.76, 0, 0.24, 1], // custom cubic bezier — slow end
          delay: 0.3,
        }}
      />
      
      {/* Gold accent line that draws as curtain lifts */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-30 h-[3px]"
        style={{ backgroundColor: 'var(--color-accent)' }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1, originX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
      />
    </div>
  )
}
```

---

### ANIMATION 2: "The Image Shatters" — Property Grid Reveal

When the featured properties section scrolls into view, each card appears as if **a single large image of a building is breaking into 6 pieces** (the 6 property cards), each sliding in from a different direction. This is the signature animation.

```tsx
// components/public/ShatterGrid.tsx
"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

// Direction each card comes from (simulating shatter directions)
const shatterDirections = [
  { x: -60, y: -40 },  // top-left card — comes from top-left
  { x: 0,   y: -80 },  // top-center card — comes from top
  { x: 60,  y: -40 },  // top-right card — comes from top-right
  { x: -60, y: 40  },  // bottom-left — comes from bottom-left
  { x: 0,   y: 80  },  // bottom-center — from bottom
  { x: 60,  y: 40  },  // bottom-right — from bottom-right
]

export function ShatterGrid({ children }: { children: React.ReactNode[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-15%" })
  
  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            x: shatterDirections[i % 6].x,
            y: shatterDirections[i % 6].y,
            scale: 0.9,
            filter: "blur(8px)",
          }}
          animate={isInView ? {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          } : {}}
          transition={{
            duration: 0.9,
            delay: i * 0.12,  // stagger — each card appears 0.12s after previous
            ease: [0.25, 0.46, 0.45, 0.94],  // ease-out-quad — architectural weight
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}
```

---

### ANIMATION 3: "Parallax Stack Gallery" — Property Type Explorer

The property type section uses a scroll-linked horizontal row that moves at a different speed than the page scroll — creating depth. Left row moves left, right row moves right as you scroll. Like looking at a building from a moving car.

```tsx
// components/public/ParallaxGallery.tsx
"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const propertyTypes = [
  { label: "Apartments", image: "...", count: 12 },
  { label: "Villas", image: "...", count: 8 },
  { label: "Plots", image: "...", count: 15 },
  { label: "Commercial", image: "...", count: 6 },
  { label: "Office", image: "...", count: 4 },
  { label: "Warehouses", image: "...", count: 3 },
]

// Split into two rows
const row1 = propertyTypes.slice(0, 3) // moves LEFT on scroll
const row2 = propertyTypes.slice(3, 6) // moves RIGHT on scroll

export function ParallaxGallery() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  
  // Row 1 moves -80px (left), Row 2 moves +80px (right)
  const xLeft  = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"])
  const xRight = useTransform(scrollYProgress, [0, 1], ["0%",  "8%"])
  
  return (
    <section ref={containerRef} className="overflow-hidden py-24">
      <h2 className="text-center mb-12 font-cormorant text-5xl">Browse by Type</h2>
      
      {/* Row 1 — slides left */}
      <motion.div
        style={{ x: xLeft }}
        className="flex gap-6 mb-6 px-6"
      >
        {row1.map((type) => (
          <PropertyTypeCard key={type.label} {...type} />
        ))}
      </motion.div>
      
      {/* Row 2 — slides right */}
      <motion.div
        style={{ x: xRight }}
        className="flex gap-6 px-6"
      >
        {row2.map((type) => (
          <PropertyTypeCard key={type.label} {...type} />
        ))}
      </motion.div>
    </section>
  )
}
```

---

### ANIMATION 4: "Curtain Reveal Per Image" — Property Detail Gallery

On the property detail page, each image in the gallery reveals itself with a **clip-path curtain** that opens from center as you scroll past it. This is the most premium-feeling animation — like a painting being unveiled in a gallery.

```tsx
// components/public/ImageReveal.tsx
"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

export function ImageReveal({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.3"], // reveal as element enters viewport
  })
  
  // Clip-path opens from center: inset(0 50%) → inset(0 0%)
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0 50% 0 50%)", "inset(0 0% 0 0%)"]
  )
  
  // Image itself scales slightly (zoom-in effect as clip opens)
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1.0])
  
  return (
    <div ref={ref} className="relative overflow-hidden rounded-xl">
      <motion.div style={{ clipPath }}>
        <motion.div style={{ scale }}>
          <Image
            src={src}
            alt={alt}
            width={800}
            height={600}
            className="w-full h-[400px] object-cover"
          />
        </motion.div>
      </motion.div>
      
      {/* Gold reveal line that sweeps across on reveal */}
      <motion.div
        className="absolute inset-y-0 w-[2px] bg-accent z-10"
        style={{
          left: useTransform(scrollYProgress, [0, 1], ["50%", "100%"]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]),
        }}
      />
    </div>
  )
}
```

---

### ANIMATION 5: "Building Assembles" — About / Stats Section

The "Why Choose Us" section: each stat card appears to **assemble from below** — like floors of a building being stacked. Combined with a number count-up animation.

```tsx
// components/public/StatsSection.tsx
"use client"
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion"
import { useRef, useEffect } from "react"

// Counter hook
function useCountUp(target: number, duration: number = 1.5) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  useEffect(() => {
    if (isInView) {
      animate(count, target, { duration, ease: "easeOut" })
    }
  }, [isInView])
  
  return { rounded, ref }
}

const stats = [
  { value: 120, suffix: "+", label: "Properties Listed", icon: "🏠" },
  { value: 85, suffix: "+", label: "Happy Clients", icon: "⭐" },
  { value: 5, suffix: " Years", label: "Trusted Experience", icon: "🏆" },
  { value: 100, suffix: "%", label: "Verified Listings", icon: "✅" },
]

export function StatsSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" })
  
  return (
    <section
      ref={sectionRef}
      className="bg-surface-dark py-24 px-6"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => {
          const { rounded, ref } = useCountUp(stat.value)
          return (
            <motion.div
              key={stat.label}
              ref={ref}
              className="text-center"
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: i * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {/* Icon with scale-in */}
              <motion.div
                className="text-4xl mb-3"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: i * 0.15 + 0.3, type: "spring", stiffness: 200 }}
              >
                {stat.icon}
              </motion.div>
              
              {/* Number count-up */}
              <div className="font-playfair text-5xl text-accent font-bold">
                <motion.span>{rounded}</motion.span>
                {stat.suffix}
              </div>
              
              {/* Label */}
              <p className="text-white/60 text-sm mt-2 font-dm">{stat.label}</p>
              
              {/* Gold bottom line — draws in */}
              <motion.div
                className="w-0 h-[2px] bg-accent mx-auto mt-4"
                animate={isInView ? { width: "40px" } : {}}
                transition={{ delay: i * 0.15 + 0.5, duration: 0.4 }}
              />
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
```

---

### ANIMATION 6: "The Scroll-Pinned Building Story" — Landing Page Feature Section

This is the most premium animation — a **pinned section** where as you scroll, the hero image of a house/building **splits into panels** and each panel slides to reveal different selling points. The page scrolls but the section stays pinned while the story plays out.

> This uses Framer Motion's `useScroll` with scroll offset mapping. Pure CSS + Framer — no GSAP license needed.

```tsx
// components/public/PinnedStory.tsx
"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

const panels = [
  { label: "Direct from Owner", subtext: "No middlemen. Talk directly to the seller.", position: "left" },
  { label: "Verified Listings", subtext: "Every property personally inspected.", position: "center" },
  { label: "WhatsApp First", subtext: "Enquire in seconds. Response in minutes.", position: "right" },
]

export function PinnedStory() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  
  // Panel 1 (left) slides from left → center as scroll goes 0→0.33
  const panel1X = useTransform(scrollYProgress, [0, 0.33], ["-100%", "0%"])
  const panel1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.33], [0, 1, 1])
  
  // Panel 2 (top) drops from top → center as scroll goes 0.33→0.66
  const panel2Y = useTransform(scrollYProgress, [0.33, 0.66], ["-100%", "0%"])
  const panel2Opacity = useTransform(scrollYProgress, [0.33, 0.45, 0.66], [0, 1, 1])
  
  // Panel 3 (right) slides from right → center as scroll goes 0.66→1.0
  const panel3X = useTransform(scrollYProgress, [0.66, 1.0], ["100%", "0%"])
  const panel3Opacity = useTransform(scrollYProgress, [0.66, 0.8, 1.0], [0, 1, 1])
  
  return (
    // Tall container — height controls how long the pin lasts
    <div ref={containerRef} className="relative h-[300vh]">
      
      {/* Sticky inner wrapper */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-surface-dark">
        
        {/* Background property image (always visible, parallax) */}
        <motion.div
          className="absolute inset-0"
          style={{
            scale: useTransform(scrollYProgress, [0, 1], [1.1, 1.0]),
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80"
            alt="Premium property"
            fill
            className="object-cover opacity-30"
            priority
          />
        </motion.div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-surface-dark/60" />
        
        {/* PANEL 1 — slides from left */}
        <motion.div
          style={{ x: panel1X, opacity: panel1Opacity }}
          className="absolute left-8 lg:left-24 max-w-xs"
        >
          <div className="border-l-2 border-accent pl-6">
            <p className="text-accent text-xs uppercase tracking-widest mb-2 font-dm">01</p>
            <h3 className="text-white font-cormorant text-4xl font-semibold mb-3">{panels[0].label}</h3>
            <p className="text-white/60 font-dm">{panels[0].subtext}</p>
          </div>
        </motion.div>
        
        {/* PANEL 2 — drops from top, centered */}
        <motion.div
          style={{ y: panel2Y, opacity: panel2Opacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <p className="text-accent text-xs uppercase tracking-widest mb-2 font-dm">02</p>
          <h3 className="text-white font-cormorant text-5xl font-semibold mb-3">{panels[1].label}</h3>
          <p className="text-white/60 font-dm">{panels[1].subtext}</p>
          {/* Gold separator */}
          <div className="w-16 h-[2px] bg-accent mx-auto mt-4" />
        </motion.div>
        
        {/* PANEL 3 — slides from right */}
        <motion.div
          style={{ x: panel3X, opacity: panel3Opacity }}
          className="absolute right-8 lg:right-24 max-w-xs text-right"
        >
          <div className="border-r-2 border-accent pr-6">
            <p className="text-accent text-xs uppercase tracking-widest mb-2 font-dm">03</p>
            <h3 className="text-white font-cormorant text-4xl font-semibold mb-3">{panels[2].label}</h3>
            <p className="text-white/60 font-dm">{panels[2].subtext}</p>
          </div>
        </motion.div>
        
        {/* Scroll progress indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-[1px] h-8 bg-accent" />
          <p className="text-accent/60 text-xs tracking-widest font-dm uppercase">Scroll</p>
        </motion.div>
      </div>
    </div>
  )
}
```

---

### ANIMATION 7: Lenis Smooth Scroll (Global)

Replace the browser's default jarky scroll with butter-smooth scrolling. This makes ALL animations feel more premium.

```tsx
// components/providers/LenisProvider.tsx
"use client"
import { useEffect } from 'react'
import Lenis from 'lenis'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,          // How long scroll momentum lasts (higher = slower/smoother)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential easing
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,     // Mobile feel
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}

// Add to app/layout.tsx:
// <LenisProvider>
//   {children}
// </LenisProvider>
```

---

### ANIMATION 8: Navbar — Transparent → Solid on Scroll

Starts transparent (over hero image) and transitions to solid navy as you scroll.

```tsx
// components/public/Navbar.tsx
"use client"
import { motion, useScroll, useTransform } from "framer-motion"

export function Navbar() {
  const { scrollY } = useScroll()
  
  // Background opacity: 0 at top → 1 after 80px scroll
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1])
  // Blur: none → blur(12px)
  const blur = useTransform(scrollY, [0, 80], [0, 12])
  // Border: transparent → visible
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1])
  
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      style={{
        backgroundColor: useTransform(bgOpacity, (v) => `rgba(15, 26, 36, ${v})`),
        backdropFilter: useTransform(blur, (v) => `blur(${v}px)`),
        borderBottom: useTransform(borderOpacity, (v) => `1px solid rgba(200, 150, 77, ${v * 0.3})`),
      }}
    >
      {/* nav content */}
    </motion.nav>
  )
}
```

---

### ANIMATION 9: Property Card — Hover State (The Complete Treatment)

```tsx
// Wrap each property card with this
<motion.div
  className="property-card"
  whileHover={{
    y: -8,                    // Card lifts
    transition: { duration: 0.25, ease: "easeOut" }
  }}
  whileTap={{ scale: 0.98 }}  // Press feedback on mobile
>
  {/* Image container — zoom on hover */}
  <motion.div
    className="overflow-hidden rounded-t-xl h-60"
    whileHover={{ scale: 1.0 }}  // parent handles, image zooms
  >
    <motion.div
      whileHover={{ scale: 1.08 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Image ... />
    </motion.div>
  </motion.div>
  
  {/* Gold bottom border that expands on hover */}
  <motion.div
    className="h-[2px] bg-accent origin-left"
    initial={{ scaleX: 0 }}
    whileHover={{ scaleX: 1 }}
    transition={{ duration: 0.3 }}
  />
</motion.div>
```

---

### ANIMATION 10: Page Route Transitions

```tsx
// components/providers/PageTransition.tsx
"use client"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

---

### ANIMATION MASTER — Reduced Motion Accessibility

Always respect user preferences. Wrap all animations with this:

```tsx
// lib/useReducedMotion.ts
import { useReducedMotion } from "framer-motion"

// In any animated component:
const shouldReduceMotion = useReducedMotion()

// Then:
<motion.div
  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
```

Or in CSS:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## OPENCODE TASK ADDITIONS — SEO + ANIMATION PHASE

Add these tasks to the Phase 5 section of the master document:

```
SEO Task 1: "Create app/sitemap.ts that dynamically generates XML sitemap with all static pages AND all property pages from Supabase. Include changeFrequency and priority for each. Also create app/robots.ts as specified."

SEO Task 2: "Add complete metadata to app/layout.tsx including title template, description, keywords, Open Graph, Twitter card, Google verification placeholder, and theme color. Add OrganizationSchema and HomepageSchema JSON-LD components."

SEO Task 3: "Add generateMetadata function to all property detail pages that creates unique, keyword-rich titles and descriptions. Add PropertySchema JSON-LD component. Generate SEO slugs and update routes to use /properties/[slug] instead of UUID."

SEO Task 4: "Configure next.config.js with image optimization (avif/webp), compression, security headers, and ISR revalidation on all public pages. Create vercel.json with caching headers and www redirect."

SEO Task 5: "Add API route app/api/revalidate/route.ts. Call this from dashboard after every property save/edit/delete to trigger ISR cache invalidation."

ANIMATION Task 1: "Install lenis and create LenisProvider. Wrap app layout. Configure with duration: 1.4 and exponential easing."

ANIMATION Task 2: "Create HeroCurtain component with navy panel that slides up on load. Add animated navbar that transitions from transparent to dark navy as user scrolls past 80px."

ANIMATION Task 3: "Create ShatterGrid component. All 6+ property cards on the homepage use it. Each card enters from a different direction (top-left, top, top-right, bottom-left, bottom, bottom-right) staggered by 0.12s."

ANIMATION Task 4: "Create ParallaxGallery component for property types section. Row 1 moves -8% horizontally, Row 2 moves +8% as user scrolls through the section using useScroll + useTransform."

ANIMATION Task 5: "Create PinnedStory component. Tall 300vh container with sticky inner div. Three panels (left slide-in, top drop, right slide-in) triggered sequentially as user scrolls through. Use it between the hero and featured properties sections."

ANIMATION Task 6: "Wrap property detail gallery images in ImageReveal component using clip-path curtain reveal (inset 50%→0%) as each image scrolls into viewport."

ANIMATION Task 7: "Add StatsSection with count-up animation using useMotionValue + animate. Each stat card assembles from below with staggered delay."

ANIMATION Task 8: "Add @media (prefers-reduced-motion: reduce) CSS rules globally. Add useReducedMotion() check to all framer-motion components."
```

---

## QUICK REFERENCE — SEO KEYWORD TARGETS

These are the exact phrases you want to rank for. Use them naturally in property titles and descriptions:

```
Tier 1 (High value, competition moderate):
  "property for sale Chennai"
  "apartments for rent Chennai"  
  "plots for sale Tamil Nadu"
  "real estate Tamil Nadu"
  "pandiyan sites" (branded — easiest to rank)

Tier 2 (Medium value, lower competition):
  "3 BHK apartment Anna Nagar"
  "DTCP plots Tambaram"
  "villa for sale Velachery"
  "commercial space T Nagar rent"
  "independent house Chennai sale"
  "farm land Tamil Nadu for sale"

Tier 3 (Long-tail — high intent, easy to rank):
  "2 BHK flat for rent near OMR Perungudi"
  "east facing 3 BHK apartment Chennai vastu"
  "1200 sqft DTCP approved plot Tambaram sale"
  "furnished office space Guindy rent"
```

---

*Addendum prepared by: CTO/CEO — Pandiyan Sites Project*  
*Part 2 of 2 | SEO + Animation Strategy | Next.js 14 + Framer Motion + Lenis*
