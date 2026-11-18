import type { Metadata, Viewport } from "next"
import { Bodoni_Moda } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { OrganizationSchema } from "@/components/seo/Schemas"
import { LenisProvider } from "@/components/providers/LenisProvider"

// Display face: Didone high-contrast serif. Editorial luxury, headline sizes only.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: false,
})

// Text and UI face: Geist, shipped with the repo. No extra network font.
const geist = localFont({
  src: [
    {
      path: "./fonts/GeistVF.woff",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pandiyansites.com"),

  title: {
    default: "Pandiyan Sites | Premium Properties in Tamil Nadu",
    template: "%s | Pandiyan Sites",
  },

  description:
    "Pandiyan Sites - Tamil Nadu's trusted real estate marketplace. Find apartments, villas, plots, and commercial properties for sale and rent in Chennai, Tambaram, OMR, Anna Nagar, and across Tamil Nadu. Direct owner listings with WhatsApp contact.",

  keywords: [
    "Pandiyan Sites",
    "Pandiyan real estate",
    "Pandiyan properties",
    "properties in Chennai",
    "real estate Tamil Nadu",
    "plots for sale Chennai",
    "apartments in Anna Nagar",
    "villas in Chennai",
    "property in Tambaram",
    "OMR apartments",
    "Velachery properties",
    "T Nagar commercial",
    "property for sale Chennai",
    "house for rent Chennai",
    "plots for sale Tamil Nadu",
    "commercial space Chennai",
    "office space for rent Chennai",
    "BHK apartment Chennai",
    "independent house Chennai",
    "farm land Tamil Nadu",
    "warehouse for rent Chennai",
    "shop space T Nagar",
    "buy property Chennai",
    "rent apartment Chennai",
    "real estate agent Tamil Nadu",
    "DTCP approved plots Chennai",
    "Vastu friendly homes Chennai",
  ],

  authors: [{ name: "Pandiyan Sites", url: "https://www.pandiyansites.com" }],
  creator: "Pandiyan Sites",
  publisher: "Pandiyan Sites",

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.pandiyansites.com",
    siteName: "Pandiyan Sites",
    title: "Pandiyan Sites | Premium Real Estate in Tamil Nadu",
    description:
      "Find your dream property in Tamil Nadu. Verified residential and commercial listings - apartments, villas, plots, and more.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pandiyan Sites - Premium Real Estate Tamil Nadu",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Pandiyan Sites | Real Estate Tamil Nadu",
    description:
      "Verified property listings across Chennai & Tamil Nadu. Apartments, villas, plots, commercial spaces.",
    images: ["/og-image.jpg"],
  },

  alternates: {
    canonical: "https://www.pandiyansites.com",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  category: "Real Estate",

  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pandiyan Sites",
  },
}

export const viewport: Viewport = {
  themeColor: "#0B0F0D",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Marks the document as script-capable before first paint, so entrance
            states only ever hide content when a script will reveal it again. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js-motion')",
          }}
        />
      </head>
      <body className={`${bodoni.variable} ${geist.variable} font-sans antialiased`}>
        <LenisProvider>
          <OrganizationSchema />
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
