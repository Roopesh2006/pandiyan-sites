export interface Property {
  id: string
  title: string
  description: string | null
  property_type: PropertyType
  listing_type: ListingType
  price: number
  price_unit: PriceUnit
  area_sqft: number | null
  bedrooms: number | null
  bathrooms: number | null
  location_area: string | null
  location_city: string
  location_state: string
  address: string | null
  facing: Facing | null
  floor_number: number | null
  total_floors: number | null
  is_furnished: FurnishingStatus | null
  amenities: string[] | null
  is_featured: boolean
  is_active: boolean
  whatsapp_number: string
  slug: string | null
  created_at: string
  updated_at: string
}

export interface PropertyImage {
  id: string
  property_id: string
  image_url: string
  storage_path: string
  is_primary: boolean
  sort_order: number
  created_at: string
}

export interface SiteConfig {
  id: number
  site_name: string
  tagline: string
  banner_image_url: string | null
  banner_storage_path: string | null
  whatsapp_number: string | null
  phone_number: string | null
  email: string | null
  address: string | null
  about_text: string | null
  facebook_url: string | null
  instagram_url: string | null
  youtube_url: string | null
  updated_at: string
}

export type PropertyType =
  | 'apartment'
  | 'villa'
  | 'plot'
  | 'commercial'
  | 'office'
  | 'shop'
  | 'warehouse'
  | 'farm_land'
  | 'independent_house'

export type ListingType = 'sale' | 'rent' | 'lease'

export type PriceUnit = 'total' | 'per_sqft' | 'per_month' | 'per_year'

export type Facing =
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'north_east'
  | 'north_west'
  | 'south_east'
  | 'south_west'

export type FurnishingStatus = 'furnished' | 'semi_furnished' | 'unfurnished'

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'Apartment',
  villa: 'Villa',
  plot: 'Plot',
  commercial: 'Commercial',
  office: 'Office Space',
  shop: 'Shop',
  warehouse: 'Warehouse',
  farm_land: 'Farm Land',
  independent_house: 'Independent House',
}

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  sale: 'For Sale',
  rent: 'For Rent',
  lease: 'For Lease',
}

export const PLACEHOLDER_IMAGES: Record<string, string> = {
  apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  villa: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  plot: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
  commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  shop: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
  warehouse: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80',
  independent_house: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  hero_banner: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80',
  gallery_1: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80',
  gallery_2: 'https://images.unsplash.com/photo-1560185008-b033106af5c3?w=800&q=80',
  gallery_3: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  gallery_4: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  gallery_5: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
  agent: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
}

export function formatIndianPrice(amount: number, unit: string = 'total'): string {
  if (unit === 'per_month' || unit === 'per_year') {
    return `₹${amount.toLocaleString('en-IN')} / ${unit === 'per_month' ? 'month' : 'year'}`
  }
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(0)} L`
  return `₹${amount.toLocaleString('en-IN')}`
}

export function getPropertyImage(property: Property): string {
  return PLACEHOLDER_IMAGES[property.property_type] || PLACEHOLDER_IMAGES.apartment
}

export function isVastuFriendly(facing: Facing | null): boolean {
  return facing === 'east' || facing === 'north'
}
