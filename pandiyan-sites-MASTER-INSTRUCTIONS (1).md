# 🏠 PANDIYAN SITES — MASTER BUILD INSTRUCTIONS
### Premium Real Estate Marketplace — OpenCode Development Guide
**Version:** 1.0 | **Role:** CTO + CEO Directive | **Stack:** Next.js 14 + Supabase + Vercel  
**Project Name:** `pandiyan-sites` | **Deployment:** Vercel

---

## ⚠️ BACKEND DECISION: SUPABASE — AND WHY

**Use Supabase. Not Firebase. Here's why this matters for this project:**

| Concern | Supabase ✅ | Firebase ❌ |
|---|---|---|
| Image/file upload for property listings | Built-in Storage + Buckets | Requires Firebase Storage setup separately |
| Relational data (properties → images → categories) | PostgreSQL — real SQL joins | NoSQL Firestore — no joins, requires denormalization |
| Vercel + Next.js App Router integration | Native, lightweight HTTP client | Admin SDK is heavy, causes Edge Runtime issues |
| Cost predictability | Flat $25/mo Pro, never surprise bills | Per-read/write billing — a frontend bug can spike costs |
| Dashboard queries (filter, sort, search) | Complex SQL queries natively | Painful to query across documents |
| Auth for single admin dashboard | Email/password auth built-in | Fine but overkill for single-user dashboard |
| OpenCode + MCP compatibility | Supabase MCP server available | Firebase MCP not in standard registry |

**Verdict:** Supabase is the professional, predictable, SQL-powered choice for a relational real estate data model. The free tier (500 MB DB, 1 GB storage, 50k MAU) is sufficient to start. Upgrade to Pro ($25/mo) only when needed.

---

## 🔑 SUPABASE SETUP — STEP BY STEP (DO THIS BEFORE RUNNING OPENCODE)

### Step 1: Create a Supabase Project
1. Go to **[https://supabase.com](https://supabase.com)** → Sign up / Log in
2. Click **"New Project"**
3. Set:
   - **Name:** `pandiyan-sites`
   - **Database Password:** Choose a strong password (save it in a password manager)
   - **Region:** `Southeast Asia (Singapore)` ← closest to India/Tamil Nadu
   - **Plan:** Free (to start)
4. Wait ~2 minutes for provisioning

### Step 2: Get Your API Keys
1. Go to your project → **Settings** (gear icon, left sidebar) → **API**
2. Copy these values — you will need them in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (long key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (different long key — NEVER expose this in frontend)
```

> ⚠️ **IMPORTANT:** `NEXT_PUBLIC_` prefixed keys are safe for browser. `SUPABASE_SERVICE_ROLE_KEY` is only for server-side API routes. Never put it in a client component.

### Step 3: Create Storage Buckets
In your Supabase dashboard → **Storage** → **New Bucket**:

**Bucket 1: `property-images`**
- Public: ✅ YES (so property images load without auth)
- File size limit: 10 MB
- Allowed MIME types: `image/jpeg, image/png, image/webp`

**Bucket 2: `banners`**
- Public: ✅ YES
- File size limit: 15 MB
- Allowed MIME types: `image/jpeg, image/png, image/webp`

### Step 4: Run These SQL Migrations in Supabase SQL Editor
(Dashboard → **SQL Editor** → **New Query** → paste each block and run)

```sql
-- ================================================
-- TABLE: properties
-- ================================================
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL CHECK (
    property_type IN ('apartment', 'villa', 'plot', 'commercial', 'office', 'shop', 'warehouse', 'farm_land', 'independent_house')
  ),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('sale', 'rent', 'lease')),
  price NUMERIC NOT NULL,
  price_unit TEXT DEFAULT 'total' CHECK (price_unit IN ('total', 'per_sqft', 'per_month', 'per_year')),
  area_sqft NUMERIC,
  bedrooms INTEGER,
  bathrooms INTEGER,
  location_area TEXT,
  location_city TEXT DEFAULT 'Chennai',
  location_state TEXT DEFAULT 'Tamil Nadu',
  address TEXT,
  facing TEXT CHECK (facing IN ('north', 'south', 'east', 'west', 'north_east', 'north_west', 'south_east', 'south_west')),
  floor_number INTEGER,
  total_floors INTEGER,
  is_furnished TEXT CHECK (is_furnished IN ('furnished', 'semi_furnished', 'unfurnished')),
  amenities TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  whatsapp_number TEXT DEFAULT '+919XXXXXXXXX',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- TABLE: property_images
-- ================================================
CREATE TABLE property_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- TABLE: site_config (single row for banner, contact info)
-- ================================================
CREATE TABLE site_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT 'Pandiyan Sites',
  tagline TEXT DEFAULT 'Find Your Dream Property',
  banner_image_url TEXT,
  banner_storage_path TEXT,
  whatsapp_number TEXT,
  phone_number TEXT,
  email TEXT,
  address TEXT,
  about_text TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default config row
INSERT INTO site_config (id) VALUES (1) ON CONFLICT DO NOTHING;

-- ================================================
-- RLS POLICIES
-- ================================================

-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Properties: public can read active ones
CREATE POLICY "Public can view active properties"
  ON properties FOR SELECT
  USING (is_active = true);

-- Properties: only authenticated (admin) can do everything
CREATE POLICY "Authenticated can manage properties"
  ON properties FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Property images: public can read
CREATE POLICY "Public can view property images"
  ON property_images FOR SELECT
  USING (true);

-- Property images: authenticated can manage
CREATE POLICY "Authenticated can manage property images"
  ON property_images FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Site config: public can read
CREATE POLICY "Public can read site config"
  ON site_config FOR SELECT
  USING (true);

-- Site config: authenticated can update
CREATE POLICY "Authenticated can update site config"
  ON site_config FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ================================================
-- STORAGE RLS POLICIES
-- ================================================

-- Allow public to read property-images bucket
CREATE POLICY "Public can view property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

-- Allow authenticated to upload/delete property images
CREATE POLICY "Authenticated can upload property images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete property images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');

-- Allow public to read banners
CREATE POLICY "Public can view banners"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

-- Allow authenticated to upload banners
CREATE POLICY "Authenticated can upload banners"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'banners' AND auth.role() = 'authenticated');

-- ================================================
-- UPDATED_AT TRIGGER
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
```

### Step 5: Create Admin User (Auth)
1. Go to **Authentication** → **Users** → **Add User** → **Create New User**
2. Enter:
   - Email: `admin@pandiyansites.com` (or your preferred email)
   - Password: Strong password
   - Confirm: ✅ Email confirmation: **OFF** (auto-confirm)
3. This user will log in to the private dashboard

### Step 6: Get Vercel-Ready Environment Variables
These go in **both** your local `.env.local` AND Vercel Dashboard → Project → Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_WHATSAPP_NUMBER=919XXXXXXXXXX
NEXT_PUBLIC_SITE_NAME=Pandiyan Sites
```

---

## 🏗️ PROJECT ARCHITECTURE

```
pandiyan-sites/
├── app/
│   ├── (public)/                   # Public-facing pages
│   │   ├── page.tsx                # Landing/Home page
│   │   ├── properties/
│   │   │   ├── page.tsx            # All properties listing
│   │   │   └── [id]/page.tsx       # Single property detail
│   │   └── layout.tsx              # Public layout (navbar + footer)
│   ├── (admin)/                    # Protected admin routes
│   │   ├── login/page.tsx          # Admin login
│   │   └── dashboard/
│   │       ├── page.tsx            # Dashboard home
│   │       ├── properties/
│   │       │   ├── page.tsx        # List all properties
│   │       │   ├── new/page.tsx    # Add new property
│   │       │   └── [id]/edit/page.tsx  # Edit property
│   │       └── settings/page.tsx   # Site settings + banner upload
│   └── api/
│       ├── properties/route.ts
│       └── upload/route.ts
├── components/
│   ├── public/
│   │   ├── Hero.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyGrid.tsx
│   │   ├── SearchFilters.tsx
│   │   ├── PropertyDetail.tsx
│   │   ├── WhatsAppButton.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── dashboard/
│       ├── DashboardSidebar.tsx
│       ├── PropertyForm.tsx
│       ├── ImageUploader.tsx
│       └── StatsCard.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client
│   │   └── types.ts                # Database types (generated)
│   └── utils.ts
└── public/
    └── placeholder/                # Temporary placeholder images
```

---

## 🎨 DESIGN SYSTEM — VISUAL IDENTITY

### Brand Concept: "Grounded Luxury"
This is a premium Indian real estate brand — the design must feel **trustworthy, aspirational, and rooted**. Think: the weight of Tamil Nadu's architectural heritage meets modern minimal clarity. Not generic white-and-blue like 99acres. Not American flashy. Something distinctly southern Indian premium — like dark teak wood, terracotta tiles, and crisp white limestone.

### Color Palette
```
--color-primary:      #1B2B3A    /* Deep Indigo Navy — authority, trust */
--color-accent:       #C8964D    /* Warm Brass/Gold — premium, Indian warmth */
--color-surface:      #F7F4F0    /* Warm Off-White — like limestone */
--color-surface-dark: #0F1A24    /* Deep Navy Black — sections, footer */
--color-text-primary: #1B2B3A   /* Same as primary — consistent */
--color-text-muted:   #6B7A8D   /* Cool slate gray */
--color-success:      #2D7D52   /* Verdant green — positive signals */
--color-border:       #E2DDD8   /* Warm light border */
--color-card-bg:      #FFFFFF   /* Pure white for cards */
```

### Typography
```
Display Font:  "Cormorant Garamond" — serif, weight 600-700
               Used for: Hero headlines, property titles, section headings
               Feeling: Old-world authority, like legal documents of value

Body Font:     "DM Sans" — geometric sans-serif
               Used for: All body text, UI labels, navigation
               Feeling: Modern, legible, professional

Accent Font:   "Playfair Display" — elegant serif
               Used for: Price tags, featured labels, testimonials
```

### Type Scale
```
H1: 64px / 700 / Cormorant Garamond / letter-spacing: -0.02em
H2: 48px / 600 / Cormorant Garamond
H3: 32px / 600 / Cormorant Garamond
H4: 24px / 600 / DM Sans
H5: 18px / 500 / DM Sans
Body: 16px / 400 / DM Sans / line-height: 1.6
Small: 14px / 400 / DM Sans
Price: 28px / 700 / Playfair Display / color: accent gold
```

### Spacing System
```
Base unit: 4px
xs: 4px | sm: 8px | md: 16px | lg: 24px | xl: 32px | 2xl: 48px | 3xl: 64px | 4xl: 96px
```

### Border Radius
```
Cards: 12px
Buttons: 8px
Chips/Tags: 100px (pill)
Input fields: 8px
Images: 12px
```

### Signature Design Element — "The Brass Accent Line"
Every section break, card hover, and active state uses a thin `2px` solid line in `#C8964D` (brass gold). This is the one memorable detail: a horizontal gold thread running through the design — like the brass inlay work in traditional South Indian architecture.

---

## 📱 PAGES — DETAILED SPECIFICATIONS

---

### 1. LANDING PAGE (`/`)

#### Hero Section
```
Layout: Full viewport height (100vh), split design
Left Panel (60%): 
  - Client-uploaded banner image (full bleed, cover)
  - Overlay: gradient from transparent → --color-surface-dark at 70% opacity
  - Over the overlay: 
    - Eyebrow text: "Tamil Nadu's Trusted Property Partner" (small caps, gold)
    - H1: "Find Your Perfect [linebreak] Place to Call Home"
    - Subtext: 14-16px, muted, "Residential & Commercial Properties across Chennai & Tamil Nadu"
    - Search bar (prominent, floating on image):
      [🔍 Search by location, property type...] [SEARCH button in gold]

Right Panel (40%) — visible on desktop, collapses on mobile:
  - Quick filter chips: For Sale | For Rent | Commercial
  - Stats row: X+ Properties | X+ Happy Clients | X Years Experience
  (These numbers come from site_config or are hard-coded initially)

Mobile: 
  - Full width image, overlay, search bar stacked below title
```

**Animation Spec:**
- On page load: Hero image fades in (0.8s ease), then text slides up from +20px (staggered: eyebrow 0.3s, H1 0.5s, subtext 0.7s, search 0.9s)
- The brass accent line under the eyebrow text draws from left to right (SVG stroke animation, 0.6s)
- Use `framer-motion` or `@keyframes` CSS — keep it subtle

#### Featured Properties Section
```
Section title: "Featured Properties" (H2, centered)
Gold underline accent (80px wide, centered, --color-accent)
Layout: 3-column grid (desktop) / 2-col (tablet) / 1-col (mobile)
Card design: [see Property Card spec below]
CTA below: "View All Properties →" (outlined button, gold border)
```

#### Why Choose Us Section
```
Background: --color-surface-dark (dark navy)
Text: White
Layout: 4 columns of icon + stat + description
Icons: Lucide React icons (outlined style, gold color)
Items:
  1. 🏠 "100+ Properties Listed" — "Residential, Commercial & Plots"  
  2. ⚡ "Quick Response" — "WhatsApp contact within minutes"
  3. 🔒 "Verified Listings" — "Every property personally verified"
  4. 💰 "Best Price Guarantee" — "Direct from owner/developer"
Animation: Cards fade in on scroll (IntersectionObserver or framer-motion whileInView)
```

#### Property Type Explorer
```
Background: --color-surface (warm off-white)
Title: "Browse by Property Type" (H2)
Layout: Horizontal scrollable cards (snap scroll on mobile)
Types:
  - Apartments | Villas | Plots | Commercial Shops | Office Space | Warehouses | Farm Land | Independent Houses
Each type card:
  - Placeholder image (relevant unsplash URL)
  - Type name in gold overlay
  - Property count badge
  - Hover: image zooms 1.05x, gold border appears
```

#### CTA / Contact Strip
```
Background: --color-accent (gold)
Text color: --color-surface-dark (dark navy)
Content: "Ready to Find Your Dream Property?"
Sub: "Chat with us on WhatsApp — we respond in minutes"
Button: WhatsApp button (green, with WhatsApp icon)
  → Opens WhatsApp with pre-filled message: "Hi, I found your website Pandiyan Sites and I'm interested in properties. Can you help me?"
```

#### Footer
```
Background: --color-surface-dark
4-column layout:
  Col 1: Logo + tagline + brief about
  Col 2: Quick Links (Home, All Properties, Sale, Rent, Commercial)
  Col 3: Property Types (Apartments, Villas, Plots, Commercial...)
  Col 4: Contact (Phone, WhatsApp, Email, Address)
Bottom bar: © 2024 Pandiyan Sites | Built with ❤️ in Tamil Nadu
```

---

### 2. ALL PROPERTIES PAGE (`/properties`)

#### Layout
```
Sticky top: Search bar + active filter chips
Left sidebar (desktop): Filter panel (collapsible on mobile as bottom sheet)
Main content: Property grid (3 col desktop, 2 col tablet, 1 col mobile)
```

#### Filter Sidebar
```
Sections:
  1. Listing Type: [ Sale ] [ Rent ] [ Lease ] (toggle chips)
  2. Property Type: Multi-select checkboxes (all types from schema)
  3. Price Range: Dual-handle slider
     - Sale: ₹5L → ₹5Cr+ 
     - Rent: ₹5K → ₹2L/mo
  4. Bedrooms: [ Any ] [ 1 ] [ 2 ] [ 3 ] [ 4+ ] (pill buttons)
  5. Area (Sqft): Input range (min / max)
  6. Location: Text input with suggestions
  7. Furnishing: Furnished | Semi | Unfurnished
  [ Apply Filters ] button in gold
  [ Clear All ] in muted text
```

#### Sort Options
```
Dropdown: Newest | Price: Low to High | Price: High to Low | Area: Large to Small
```

#### Results Header
```
"Showing X properties" | Active filter chips with × to remove
```

---

### 3. PROPERTY CARD COMPONENT

```
Card dimensions: Responsive (never fixed width, uses grid)
Border radius: 12px
Shadow: 0 2px 8px rgba(0,0,0,0.08), hover: 0 8px 24px rgba(0,0,0,0.15)
Transition: all 0.25s ease

STRUCTURE:
┌─────────────────────────────────────────┐
│  [IMAGE — 240px height, object-cover]   │
│  [TOP-LEFT Badge: FOR SALE / FOR RENT]  │
│  [TOP-RIGHT Badge: FEATURED ★]          │
├─────────────────────────────────────────┤
│  [Property Type chip] [Location chip]   │
│  Title (H4, 2-line max, ellipsis)       │
│  Price (Playfair Display, gold, large)  │
│  ─────────────────── (gold line)        │
│  [🛏 3 BHK] [🚿 2] [📐 1200 sqft]      │
│  [WhatsApp Button — full width — green] │
└─────────────────────────────────────────┘

Hover state:
  - Card lifts (translateY: -4px)
  - Gold border appears (2px, --color-accent)
  - Image zooms subtly (scale: 1.05, overflow: hidden)
  - WhatsApp button brightens

WhatsApp button message format:
  "Hi! I'm interested in your property: [TITLE] listed on Pandiyan Sites. 
   Property ID: [ID]. Please share more details."
```

---

### 4. PROPERTY DETAIL PAGE (`/properties/[id]`)

```
Layout: 2-column (image gallery left 55%, details right 45%)
Mobile: Stacked (images top, details below)

LEFT — Image Gallery:
  - Primary large image (400px height, rounded corners)
  - Thumbnail row below (horizontal scroll, 5-6 thumbnails)
  - Click thumbnail → updates main image (smooth fade transition)
  - "Photos (X)" badge on main image

RIGHT — Property Details:
  - Breadcrumb: Home > Properties > [Title]
  - Property type chip + Listing type badge
  - Title (H2, Cormorant Garamond)
  - Price (Large, Playfair Display, gold)
    + Price per sqft if available (smaller, muted)
  - Location (icon + text)
  
  DETAILS GRID (2×3):
  ┌──────────┬──────────┐
  │ 🛏 3 BHK │ 🚿 2 Bath│
  │ 📐 1200sf│ 🏢 Floor 3│
  │ 🧭 North │ 🏠 Furnished│
  └──────────┴──────────┘
  
  DESCRIPTION:
  "About this property" — collapsible after 3 lines

  AMENITIES (if any):
  Chip grid: [Parking] [Lift] [Security] [Gym] [Swimming Pool] etc.

  CTA BOX (sticky on scroll — becomes floating on mobile):
  ┌────────────────────────────────────────┐
  │  Interested in this property?          │
  │  [💬 WhatsApp — Enquire Now]  [green]  │
  │  [📞 Call Now]                          │
  │  "Response usually within 30 minutes"  │
  └────────────────────────────────────────┘
  
  WhatsApp URL:
  https://wa.me/[NUMBER]?text=Hi%2C+I%27m+interested+in+[PROPERTY_TITLE]+%28ID%3A+[ID]%29+listed+on+Pandiyan+Sites.+Please+share+more+details.
```

---

### 5. ADMIN LOGIN PAGE (`/login`)

```
Layout: Split screen
Left (40%): Brand panel — dark navy background
  - Logo (large)
  - "Welcome back" in serif
  - Tagline: "Manage your properties with ease"
  - Abstract geometric decoration (CSS/SVG, subtle gold lines)

Right (60%): Login form
  - Card, centered, max-width 400px
  - "Admin Login" heading
  - Email input (with icon)
  - Password input (with show/hide toggle)
  - [ Login ] button (full width, gold background)
  - Error state: red border + inline error message

Auth: Supabase email/password authentication
On success: redirect to /dashboard
Route protection: middleware.ts checks session, redirects to /login if not authenticated
```

---

### 6. ADMIN DASHBOARD (`/dashboard`)

#### Sidebar
```
Width: 260px (collapsible to 72px icon-only on toggle)
Background: --color-surface-dark
Logo at top
Navigation items (Lucide icons):
  🏠 Dashboard (overview)
  🏘️ Properties (list)
  ➕ Add Property
  ⚙️ Settings
  🚪 Logout (bottom)

Active state: Gold left border (3px) + gold text + lighter bg
```

#### Dashboard Home
```
Stats row (4 cards):
  Total Properties | Active Listings | For Sale | For Rent
  (Animated count-up on load using JS counter)

Recent Properties table:
  Columns: Image | Title | Type | Price | Status | Actions (Edit/Delete)
  Last 5 properties

Quick Actions:
  [ + Add New Property ] [ ⚙️ Site Settings ]
```

#### Property List Page (`/dashboard/properties`)
```
Table: Full list of all properties
Columns:
  - Thumbnail (40×40px rounded)
  - Title
  - Type / Listing Type
  - Price
  - Status toggle (Active/Inactive — live toggle)
  - Actions: [Edit] [Delete]

Search bar to filter by title/location
Sort: By Date | Price | Title
Pagination: 10 per page

Delete: Confirmation modal before deleting (also deletes images from storage)
```

#### Add / Edit Property Form (`/dashboard/properties/new` & `/edit`)
```
Multi-step form (3 steps with progress indicator):

STEP 1: Basic Info
  - Title (text, required)
  - Description (textarea, min 3 rows)
  - Property Type (select dropdown)
  - Listing Type (Sale / Rent / Lease — radio pills)
  - Price (number, required)
  - Price Unit (Total / Per Sqft / Per Month / Per Year)

STEP 2: Details
  - Area in Sqft (number)
  - Bedrooms (1/2/3/4/4+ stepper buttons)
  - Bathrooms (stepper)
  - Floor Number / Total Floors
  - Facing (dropdown: N/S/E/W/NE/NW/SE/SW)
  - Furnishing Status (Furnished/Semi/Unfurnished)
  - Location Area (text — e.g., "Anna Nagar")
  - Full Address (textarea)
  - Amenities (multi-select checkbox grid):
    [Parking] [Lift] [Power Backup] [Security] [Gym]
    [Swimming Pool] [Garden] [Play Area] [CCTV] [Water 24/7]
    [Piped Gas] [Maintenance Staff] [Clubhouse] [Temple Nearby]

STEP 3: Images
  - Drag & drop zone (accept jpg/png/webp, up to 10 images)
  - Preview grid of uploaded images
  - Reorder images (drag to reorder sort_order)
  - Set primary image (star icon)
  - Delete individual images
  - Upload progress bar for each image

FORM FOOTER (sticky):
  [← Back] [Next →] / [Save as Draft] [Publish]

On Submit:
  1. Insert into `properties` table
  2. For each image: upload to Supabase Storage → get public URL → insert into `property_images`
```

#### Settings Page (`/dashboard/settings`)
```
Sections:
  1. BANNER MANAGEMENT
     - Current banner preview (300px height)
     - Upload new banner button (drag & drop or click)
     - Uploads to 'banners' bucket → updates site_config.banner_image_url
  
  2. CONTACT DETAILS
     - WhatsApp Number (with country code — +91)
     - Phone Number
     - Email
     - Office Address
  
  3. ABOUT TEXT
     - Textarea for About Us content
  
  4. SOCIAL LINKS
     - Facebook, Instagram, YouTube URLs
  
  [ Save All Changes ] (full width, gold)
```

---

## 🔄 WHATSAPP INTEGRATION — TECHNICAL SPEC

The WhatsApp CTA is a **core business feature** — get this right.

### URL Format
```javascript
const getWhatsAppURL = (propertyTitle: string, propertyId: string, whatsappNumber: string) => {
  const message = encodeURIComponent(
    `Hi! I saw your listing on *Pandiyan Sites* and I'm interested.\n\n` +
    `*Property:* ${propertyTitle}\n` +
    `*Listing ID:* #${propertyId.slice(0, 8).toUpperCase()}\n\n` +
    `Could you please share more details? 🏠`
  );
  return `https://wa.me/${whatsappNumber}?text=${message}`;
};
```

### WhatsApp Button Component
```tsx
// components/public/WhatsAppButton.tsx
// Props: propertyTitle, propertyId, variant ('card' | 'detail' | 'floating' | 'strip')
// card variant: full width, medium size, outlined
// detail variant: full width, large, filled green
// floating variant: fixed bottom-right FAB on mobile property detail
// strip variant: centered, white text on green background

// Always opens in new tab: target="_blank" rel="noopener noreferrer"
// Icon: WhatsApp SVG icon (use react-icons/fa or lucide doesn't have WA — use a custom SVG)
```

### WhatsApp Number Storage
- Stored in `site_config.whatsapp_number` — admin can update from Settings
- Fallback to `NEXT_PUBLIC_WHATSAPP_NUMBER` env var
- Format in DB: `919XXXXXXXXXX` (no + sign, no spaces)
- Format in URL: same (wa.me accepts without +)

---

## ⚡ ANIMATIONS & MOTION — COMPLETE SPEC

**Library:** Use `framer-motion` for complex animations, pure CSS for simple ones.

### Entrance Animations
```javascript
// Page content reveal (use on all public pages)
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
}

// Staggered children (use for property grids, feature lists)
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

// Card entrance (each property card)
const cardVariant = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
}
```

### Scroll-triggered Reveals
```javascript
// Use framer-motion whileInView for sections
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6 }}
>
```

### Micro-interactions
```css
/* Property card hover */
.property-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.property-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(27, 43, 58, 0.15);
}

/* Gold accent line draw (Hero) */
@keyframes drawLine {
  from { width: 0; }
  to { width: 80px; }
}
.accent-underline {
  animation: drawLine 0.6s ease forwards;
  animation-delay: 0.3s;
}

/* Image overlay shimmer on card */
.card-image-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 40%, rgba(200, 150, 77, 0.15) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}
.property-card:hover .card-image-wrapper::after {
  opacity: 1;
}

/* Button press effect */
.btn-primary:active {
  transform: scale(0.97);
}

/* Number count-up (dashboard stats) */
/* Use custom hook useCountUp(target, duration) */
```

### Loading States
```
Skeleton loader for property cards (matching card dimensions)
Use CSS shimmer animation:
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
```

### Page Transitions
```javascript
// app/layout.tsx — Wrap page content with:
<AnimatePresence mode="wait">
  <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
    {children}
  </motion.div>
</AnimatePresence>
```

---

## 📷 PLACEHOLDER IMAGES (USE THESE UNTIL CLIENT UPLOADS)

All from Unsplash CDN — free to use, no auth needed:

```javascript
// Placeholder image map — use these throughout development
export const PLACEHOLDER_IMAGES = {
  // Property types
  apartment: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  villa: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  plot: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  commercial: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  office: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  shop: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
  warehouse: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
  independent_house: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  
  // Hero/Banner
  hero_banner: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80",
  
  // Property detail gallery (6 different interior/exterior shots)
  gallery_1: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80",
  gallery_2: "https://images.unsplash.com/photo-1560185008-b033106af5c3?w=800&q=80",
  gallery_3: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  gallery_4: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  gallery_5: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
  
  // Profile / About
  agent: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
};
```

> **Note to OpenCode:** Wherever a real image is needed and hasn't been uploaded yet, use the appropriate placeholder from the map above. Do NOT use local files or `/public/placeholder.jpg`. All placeholders should be real, realistic property photos from Unsplash.

---

## 🗄️ SEED DATA (FOR TESTING)

Insert these sample properties into Supabase via SQL Editor to test the UI immediately:

```sql
INSERT INTO properties (title, description, property_type, listing_type, price, price_unit, area_sqft, bedrooms, bathrooms, location_area, location_city, facing, is_furnished, is_featured, amenities, whatsapp_number) VALUES

('Spacious 3 BHK Apartment in Anna Nagar', 'Beautiful well-maintained 3 BHK apartment in prime Anna Nagar location. Close to schools, hospitals and major commercial areas. Vastu compliant construction with quality finishing.', 'apartment', 'sale', 8500000, 'total', 1350, 3, 2, 'Anna Nagar', 'Chennai', 'east', 'semi_furnished', true, ARRAY['Parking', 'Lift', 'Power Backup', 'Security', 'Water 24/7'], '+919XXXXXXXXX'),

('Premium 2 BHK Flat for Rent - OMR', 'Modern 2 BHK flat available for rent on OMR near Perungudi. Ideal for IT professionals. Fully furnished with modular kitchen, wardrobe and AC.', 'apartment', 'rent', 28000, 'per_month', 980, 2, 2, 'OMR (Perungudi)', 'Chennai', 'north', 'furnished', false, ARRAY['Parking', 'Gym', 'Swimming Pool', 'Security', 'CCTV', 'Piped Gas'], '+919XXXXXXXXX'),

('1200 Sqft Residential Plot - Tambaram', 'DTCP approved residential plot in Tambaram Sanatorium. Excellent connectivity. Clear title document. Suitable for villa or apartment construction.', 'plot', 'sale', 4200000, 'total', 1200, NULL, NULL, 'Tambaram', 'Chennai', 'north', NULL, true, ARRAY['Clear Title', 'DTCP Approved', 'Road Access', 'Water Connection'], '+919XXXXXXXXX'),

('Commercial Shop Space - T. Nagar', 'Prime commercial shop on ground floor in T. Nagar main road. High footfall area. Currently vacant. Suitable for showroom, clinic, or retail.', 'shop', 'lease', 85000, 'per_month', 620, NULL, 1, 'T. Nagar', 'Chennai', 'south', 'unfurnished', false, ARRAY['Main Road Facing', 'Parking Available', '24/7 Access', 'CCTV'], '+919XXXXXXXXX'),

('4 BHK Independent Villa - Velachery', 'Luxurious 4 BHK independent villa with terrace, garden and private parking. Modern architecture with traditional touches. Ready to move.', 'villa', 'sale', 22000000, 'total', 2800, 4, 3, 'Velachery', 'Chennai', 'north_east', 'furnished', true, ARRAY['Private Garden', 'Terrace', 'Parking x2', 'Solar Power', 'Home Theatre', 'CCTV', 'Security'], '+919XXXXXXXXX'),

('Office Space for Rent - Guindy', 'Fully furnished office space in Guindy IT park. 1500 sqft. Suitable for 15-20 seater. Includes reception, meeting room, and pantry.', 'office', 'rent', 65000, 'per_month', 1500, NULL, 2, 'Guindy', 'Chennai', 'west', 'furnished', false, ARRAY['High Speed Internet', 'AC', 'Generator', 'Parking', 'Cafeteria', 'Conference Room'], '+919XXXXXXXXX');
```

---

## 🔧 TECHNOLOGY STACK — COMPLETE LIST

```
Framework:      Next.js 14 (App Router)
Language:       TypeScript
Styling:        Tailwind CSS + CSS Variables for brand tokens
Animations:     Framer Motion
UI Components:  shadcn/ui (for form inputs, dropdowns, dialogs)
Icons:          Lucide React
Backend:        Supabase (PostgreSQL + Auth + Storage)
Deployment:     Vercel
Fonts:          Google Fonts (Cormorant Garamond, DM Sans, Playfair Display)
Image Opt:      Next.js Image component (next/image)
Form:           React Hook Form + Zod validation
State:          React useState/useContext (no heavy state lib needed)
WhatsApp:       URL redirect (no API needed)
```

---

## 🚀 OPENCODE TASK SEQUENCE

Run tasks in this exact order for a clean, working build:

### Phase 1: Setup
```
Task 1: "Initialize Next.js 14 project named 'pandiyan-sites' with TypeScript, Tailwind CSS, App Router. Install: @supabase/supabase-js @supabase/ssr framer-motion lucide-react react-hook-form @hookform/resolvers zod shadcn/ui. Configure tailwind.config with the custom color palette and fonts from the design system."

Task 2: "Create lib/supabase/client.ts and lib/supabase/server.ts for browser and server Supabase clients using environment variables. Create lib/supabase/types.ts with TypeScript interfaces for Property, PropertyImage, and SiteConfig matching the database schema."

Task 3: "Create middleware.ts that protects all /dashboard/* routes by checking Supabase session. If no session, redirect to /login."
```

### Phase 2: Public Layout & Components
```
Task 4: "Create the Navbar component: logo (text-based initially), navigation links (Home, Properties, Contact), and a mobile hamburger menu. Use the design system colors."

Task 5: "Create the Footer component with 4 columns as specified. Include WhatsApp and phone links."

Task 6: "Create the PropertyCard component with all hover states, the WhatsApp CTA button, and placeholder image support."

Task 7: "Create the WhatsAppButton component with all 4 variants (card, detail, floating, strip). The message must include property title and ID."
```

### Phase 3: Public Pages
```
Task 8: "Build the Landing Page (app/(public)/page.tsx):
  - Hero section with banner image (use PLACEHOLDER_IMAGES.hero_banner), overlay, animated headline, and search bar
  - Featured properties grid (fetch is_featured=true from Supabase, limit 6)
  - Why Choose Us section (dark background, 4 stats)
  - Property Type Explorer (horizontal scroll)
  - WhatsApp CTA strip
  Use framer-motion for entrance animations as specified."

Task 9: "Build the All Properties page (app/(public)/properties/page.tsx):
  - Fetch all active properties from Supabase
  - Implement filter sidebar (listing type, property type, price range, bedrooms, location)
  - Implement sort dropdown
  - Show results count and active filter chips
  - Skeleton loading state"

Task 10: "Build the Property Detail page (app/(public)/properties/[id]/page.tsx):
  - Fetch property with its images from Supabase
  - Image gallery with thumbnail navigation
  - Full property details grid
  - Amenities chips
  - Sticky WhatsApp + Call CTA box
  - Floating WhatsApp FAB on mobile"
```

### Phase 4: Admin Dashboard
```
Task 11: "Build Admin Login page (/login) with split-screen layout, Supabase email/password auth, and redirect on success."

Task 12: "Build Dashboard layout with sidebar navigation, brand colors, and responsive collapse."

Task 13: "Build Dashboard home with animated stats cards (total/active/sale/rent counts from Supabase) and recent properties table."

Task 14: "Build Property List page with sortable table, status toggles (live Supabase update), search filter, and delete with confirmation modal."

Task 15: "Build the Add/Edit Property multi-step form (3 steps with progress indicator):
  Step 1: Basic Info
  Step 2: Property Details with amenities multi-select
  Step 3: Image uploader with drag & drop, preview, reorder, set primary
  On submit: Insert property → upload images to Supabase Storage → insert image records"

Task 16: "Build Settings page with banner uploader (uploads to 'banners' bucket, updates site_config), contact details form, about text, and social links. All saved to Supabase site_config table."
```

### Phase 5: Polish & Deploy
```
Task 17: "Add loading skeletons to all data-fetching pages. Add error boundaries. Ensure all images use next/image with proper dimensions."

Task 18: "Make fully responsive: test at 375px (mobile), 768px (tablet), 1280px (desktop). Fix any layout issues."

Task 19: "Add Open Graph meta tags to property pages for social sharing. Format: 'Pandiyan Sites | [Property Title] - [Price] - [Location]'"

Task 20: "Deploy to Vercel: connect GitHub repo, add all environment variables in Vercel dashboard, configure custom domain if available."
```

---

## 🌍 REAL ESTATE BUSINESS CONTEXT (FOR AI REFERENCE)

Understanding the Indian real estate market ensures terminology and UX choices are correct:

### Property Types in Indian Context
- **BHK** = Bedroom Hall Kitchen (2 BHK = 2 bedrooms + 1 hall + 1 kitchen)
- **Plot / Site** = Bare land for construction (DTCP/CMDA approved = legally cleared)
- **Villa** = Independent house within a gated community
- **Independent House** = Standalone house (not in a community)
- **Farm Land** = Agricultural land (legal restrictions on use — show "For Investment" label)
- **Carpet Area vs Built-up vs Super Built-up** — mention in details if applicable
- **Crore / Lakh** = Indian numbering: 1 Crore = 10 Million, 1 Lakh = 100,000
  → Format prices: ₹85 Lakhs, ₹1.25 Crores (not raw numbers)

### Price Formatting Function
```javascript
export const formatIndianPrice = (amount: number, unit: string = 'total'): string => {
  if (unit === 'per_month' || unit === 'per_year') {
    return `₹${(amount).toLocaleString('en-IN')} / ${unit === 'per_month' ? 'month' : 'year'}`;
  }
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(0)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Examples:
// 8500000 → "₹85 L"
// 22000000 → "₹2.20 Cr"  
// 28000 (rent) → "₹28,000 / month"
```

### Indian Property Amenities (common search terms)
Common amenities buyers/renters look for: Covered Parking, Stilt Parking, Open Parking, Lift/Elevator, 24/7 Water Supply, Borewell, Power Backup (Generator/Inverter), Security Guard, CCTV, Intercom, Modular Kitchen, Wardrobe, Air Conditioning, Gym, Swimming Pool, Children's Play Area, Clubhouse, Temple/Pooja Room, Vastu Compliant, East/North Facing (auspicious directions in Hindu tradition), Garden/Terrace.

### Vastu Compliance
Vastu Shastra is an ancient Indian system — many buyers specifically ask for East or North-facing properties. When `facing` is 'east' or 'north', display a subtle ✨ "Vastu Friendly" badge on the property card.

---

## 🔐 SECURITY CHECKLIST

- [ ] `SUPABASE_SERVICE_ROLE_KEY` only in server-side code (API routes, never client components)
- [ ] RLS enabled on all tables — no table with `anon` write access (except via authenticated session)
- [ ] Admin dashboard protected by middleware.ts session check
- [ ] Image upload: validate file type (only images) and size limit (10MB) on client AND server
- [ ] WhatsApp number not hardcoded — always from `site_config` or env variable
- [ ] All environment variables added to Vercel before deploying

---

## 📋 VERCEL DEPLOYMENT GUIDE

1. Push project to GitHub: `git push origin main`
2. Go to **vercel.com** → **Add New Project** → Import from GitHub → select `pandiyan-sites`
3. Framework preset: **Next.js** (auto-detected)
4. Add Environment Variables (all from .env.local):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
5. Click **Deploy**
6. After deploy, note the `.vercel.app` URL
7. In Supabase Dashboard → Authentication → URL Configuration:
   - Site URL: `https://pandiyan-sites.vercel.app`
   - Redirect URLs: `https://pandiyan-sites.vercel.app/**`

---

## ✅ DEFINITION OF DONE

The project is complete when:
- [ ] Public user can browse all active properties
- [ ] Public user can filter by type, price, bedrooms, location
- [ ] Public user can view full property detail with gallery
- [ ] WhatsApp button opens with correct pre-filled message naming the property
- [ ] Admin can log in at `/login` with email/password
- [ ] Admin can add a new property with images through the dashboard
- [ ] Admin can edit and delete properties
- [ ] Admin can toggle Active/Inactive status from the list
- [ ] Admin can upload the hero banner image
- [ ] Admin can update WhatsApp number and contact details
- [ ] All placeholder images are real Unsplash photos (no broken images)
- [ ] Fully responsive down to 375px
- [ ] Deployed to Vercel and accessible via URL

---

*Document prepared by: CTO/CEO — Pandiyan Sites Project*  
*Last updated: 2025 | Stack: Next.js 14 + Supabase + Vercel | Design: Grounded Luxury*
