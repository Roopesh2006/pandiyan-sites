import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWhatsAppURL(
  propertyTitle: string,
  propertyId: string,
  whatsappNumber: string
): string {
  const message = encodeURIComponent(
    `Hi! I saw your listing on *Pandiyan Sites* and I'm interested.\n\n` +
    `*Property:* ${propertyTitle}\n` +
    `*Listing ID:* #${propertyId.slice(0, 8).toUpperCase()}\n\n` +
    `Could you please share more details?`
  )
  return `https://wa.me/${whatsappNumber}?text=${message}`
}

export function getPropertySlug(property: {
  bedrooms: number | null
  property_type: string
  location_area: string | null
  location_city: string
  listing_type: string
}): string {
  const parts: string[] = []
  if (property.bedrooms) parts.push(`${property.bedrooms}-bhk`)
  parts.push(property.property_type.replace('_', '-'))
  if (property.location_area) parts.push(property.location_area.toLowerCase().replace(/\s+/g, '-'))
  parts.push(property.location_city.toLowerCase().replace(/\s+/g, '-'))
  parts.push(`for-${property.listing_type}`)
  return parts.join('-')
}
