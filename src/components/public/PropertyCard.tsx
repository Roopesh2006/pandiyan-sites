"use client"

import Link from "next/link"
import Image from "next/image"
import { Bed, Bath, Maximize, ArrowUpRight } from "lucide-react"
import { WhatsAppButton } from "./WhatsAppButton"
import { Reveal } from "@/components/motion/Reveal"
import {
  type Property,
  type PropertyImage,
  formatIndianPrice,
  getPropertyImage,
  LISTING_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
  isVastuFriendly,
} from "@/lib/supabase/types"

interface PropertyCardProps {
  property: Property
  images?: PropertyImage[]
  index?: number
}

/**
 * Editorial listing card: no resting shadow, no radius, separated from the
 * ground by tone and space. The brass rule grows on hover.
 */
export function PropertyCard({ property, images, index = 0 }: PropertyCardProps) {
  const primaryImage = images?.find((img) => img.is_primary)
  const imageUrl = primaryImage?.image_url || getPropertyImage(property)
  const vastu = isVastuFriendly(property.facing)
  const slug = property.slug || property.id

  return (
    <Reveal delay={(index % 3) * 90} className="group">
      <Link
        href={`/properties/${slug}`}
        className="block transition-transform duration-500 ease-luxe group-hover:-translate-y-1.5"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-bone-200">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-luxe group-hover:scale-[1.05]"
          />

          <span className="glass absolute left-3 top-3 px-3 py-1.5 text-small text-bone">
            {LISTING_TYPE_LABELS[property.listing_type]}
          </span>

          {property.is_featured && (
            <span className="absolute right-3 top-3 bg-oxblood px-3 py-1.5 text-small text-bone">
              Featured
            </span>
          )}
        </div>
      </Link>

      <div className="pt-5">
        <p className="text-small text-smoke">
          {PROPERTY_TYPE_LABELS[property.property_type]}
          {property.location_area ? ` · ${property.location_area}` : ""}
          {vastu ? " · Vastu facing" : ""}
        </p>

        <Link href={`/properties/${slug}`}>
          <h3 className="mt-2 font-display text-[1.6rem] leading-[1.15] tracking-tight transition-colors duration-200 group-hover:text-brass-deep">
            {property.title}
          </h3>
        </Link>

        <p className="tnum mt-3 font-display text-2xl text-brass">
          {formatIndianPrice(property.price, property.price_unit)}
        </p>

        {/* Brass thread: grows on hover */}
        <span className="thread mt-4 w-full origin-left scale-x-0 transition-transform duration-500 ease-luxe group-hover:scale-x-100" />

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-small text-smoke">
          {property.bedrooms && (
            <span className="flex items-center gap-1.5">
              <Bed size={15} aria-hidden="true" />
              {property.bedrooms} BHK
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1.5">
              <Bath size={15} aria-hidden="true" />
              {property.bathrooms} bath
            </span>
          )}
          {property.area_sqft && (
            <span className="tnum flex items-center gap-1.5">
              <Maximize size={15} aria-hidden="true" />
              {property.area_sqft.toLocaleString()} sqft
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <WhatsAppButton
            propertyTitle={property.title}
            propertyId={property.id}
            variant="card"
            whatsappNumber={property.whatsapp_number}
          />
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-bone-300 transition-all duration-300 group-hover:border-brass group-hover:bg-brass group-hover:text-ink-950"
          >
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Reveal>
  )
}
