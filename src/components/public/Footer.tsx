import Link from "next/link"
import { MapPin, Phone, MessageCircle, Mail, ArrowUpRight } from "lucide-react"

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "All properties" },
  { href: "/properties?listing=sale", label: "For sale" },
  { href: "/properties?listing=rent", label: "For rent" },
  { href: "/properties?listing=lease", label: "Commercial lease" },
]

const propertyTypes = [
  { href: "/properties?type=apartment", label: "Apartments" },
  { href: "/properties?type=villa", label: "Villas" },
  { href: "/properties?type=plot", label: "Plots" },
  { href: "/properties?type=commercial", label: "Commercial" },
  { href: "/properties?type=office", label: "Office space" },
  { href: "/properties?type=independent_house", label: "Independent houses" },
]

export function Footer() {
  return (
    <footer className="field-ink">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-section sm:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-display text-3xl leading-none">Pandiyan Sites</p>
            <p className="mt-5 max-w-sm text-body text-bone/60">
              Tamil Nadu&apos;s premium marketplace for verified residential and
              commercial property. Every listing is inspected before it goes up,
              and every enquiry goes straight to the owner.
            </p>
          </div>

          <nav aria-label="Quick links">
            <h2 className="font-display text-xl">Quick links</h2>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body text-bone/60 transition-colors duration-200 hover:text-brass"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Property types">
            <h2 className="font-display text-xl">Property types</h2>
            <ul className="mt-5 space-y-3">
              {propertyTypes.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body text-bone/60 transition-colors duration-200 hover:text-brass"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-xl">Contact</h2>
            <ul className="mt-5 space-y-3 text-body text-bone/60">
              <li className="flex items-start gap-3">
                <Phone size={17} className="mt-1 shrink-0 text-brass" aria-hidden="true" />
                <a href="tel:+919XXXXXXXXXX" className="transition-colors duration-200 hover:text-brass">
                  +91 9XX XXX XXXX
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle size={17} className="mt-1 shrink-0 text-brass" aria-hidden="true" />
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919XXXXXXXXXX"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-brass"
                >
                  WhatsApp us
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={17} className="mt-1 shrink-0 text-brass" aria-hidden="true" />
                <a href="mailto:info@pandiyansites.com" className="transition-colors duration-200 hover:text-brass">
                  info@pandiyansites.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={17} className="mt-1 shrink-0 text-brass" aria-hidden="true" />
                <span>123 Anna Salai, Chennai, Tamil Nadu 600002</span>
              </li>
            </ul>
          </div>
        </div>

        {/* The name returns at full width */}
        <p className="mt-section select-none break-words font-display text-[13vw] leading-[0.85] tracking-[-0.04em] text-bone/10">
          Pandiyan Sites
        </p>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-small text-bone/40">
            © {new Date().getFullYear()} Pandiyan Sites. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://instagram.com/pandiyansites"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-small text-bone/40 transition-colors duration-200 hover:text-brass"
            >
              Instagram <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <a
              href="https://facebook.com/pandiyansites"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-small text-bone/40 transition-colors duration-200 hover:text-brass"
            >
              Facebook <ArrowUpRight size={13} aria-hidden="true" />
            </a>
            <a
              href="https://youtube.com/@pandiyansites"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-small text-bone/40 transition-colors duration-200 hover:text-brass"
            >
              YouTube <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
