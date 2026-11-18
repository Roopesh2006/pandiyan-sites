import type { Property, PropertyImage, SiteConfig } from "./supabase/types"

export const mockSiteConfig: SiteConfig = {
  id: 1,
  site_name: "Pandiyan Sites",
  tagline: "Find Your Dream Property",
  banner_image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80",
  banner_storage_path: "",
  whatsapp_number: "919876543210",
  phone_number: "+91 98765 43210",
  email: "info@pandiyansites.com",
  address: "123 Anna Salai, Chennai, Tamil Nadu 600002",
  about_text: "Pandiyan Sites is Tamil Nadu's trusted premium real estate marketplace offering verified property listings across Chennai, Tambaram, Anna Nagar, OMR, Velachery, T. Nagar, and Adyar. We specialize in residential apartments, independent houses, villas, DTCP-approved plots, and commercial spaces for sale and rent.",
  facebook_url: "https://facebook.com/pandiyansites",
  instagram_url: "https://instagram.com/pandiyansites",
  youtube_url: "https://youtube.com/@pandiyansites",
  updated_at: "2025-01-15T10:00:00Z",
}

export const mockProperties: Property[] = [
  {
    id: "prop-001",
    title: "Spacious 3 BHK Apartment in Anna Nagar",
    description:
      "Beautiful well-maintained 3 BHK apartment in prime Anna Nagar location. Close to schools, hospitals and major commercial areas. Vastu compliant construction with quality finishing. Modular kitchen with chimney, wardrobes in all bedrooms, and split AC in living room. The apartment is on the 3rd floor of a 5-story building with lift facility. Covered car parking included.",
    property_type: "apartment",
    listing_type: "sale",
    price: 8500000,
    price_unit: "total",
    area_sqft: 1350,
    bedrooms: 3,
    bathrooms: 2,
    location_area: "Anna Nagar",
    location_city: "Chennai",
    location_state: "Tamil Nadu",
    address: "45, 2nd Main Road, Anna Nagar West, Chennai 600040",
    facing: "east",
    floor_number: 3,
    total_floors: 5,
    is_furnished: "semi_furnished",
    amenities: ["Parking", "Lift", "Power Backup", "Security", "Water 24/7", "CCTV", "Play Area"],
    is_featured: true,
    is_active: true,
    whatsapp_number: "919876543210",
    slug: "3-bhk-apartment-anna-nagar-chennai-for-sale",
    created_at: "2025-01-10T08:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
  },
  {
    id: "prop-002",
    title: "Premium 2 BHK Flat for Rent — OMR",
    description:
      "Modern 2 BHK flat available for rent on OMR near Perungudi. Ideal for IT professionals working in Sholinganallur, Perungudi, or Thoraipakkam. Fully furnished with modular kitchen, wardrobe and AC. Gated community with gym, swimming pool, and 24/7 security. Close to Tidel Park and SIPCOT IT Park.",
    property_type: "apartment",
    listing_type: "rent",
    price: 28000,
    price_unit: "per_month",
    area_sqft: 980,
    bedrooms: 2,
    bathrooms: 2,
    location_area: "OMR (Perungudi)",
    location_city: "Chennai",
    location_state: "Tamil Nadu",
    address: "12, OMR Main Road, Perungudi, Chennai 600096",
    facing: "north",
    floor_number: 7,
    total_floors: 15,
    is_furnished: "furnished",
    amenities: ["Parking", "Gym", "Swimming Pool", "Security", "CCTV", "Piped Gas", "Maintenance Staff", "Clubhouse"],
    is_featured: true,
    is_active: true,
    whatsapp_number: "919876543210",
    slug: "2-bhk-flat-rent-omr-chennai-for-rent",
    created_at: "2025-01-12T09:00:00Z",
    updated_at: "2025-01-14T11:00:00Z",
  },
  {
    id: "prop-003",
    title: "1200 Sqft Residential Plot — Tambaram",
    description:
      "DTCP approved residential plot in Tambaram Sanatorium. Excellent connectivity to Tambaram Railway Station (2 km) and GST Road (1 km). Suitable for villa or apartment construction. Clear title document with CMDA approval. Surrounded by developed residential area with school, hospital, and supermarket within 500 meters.",
    property_type: "plot",
    listing_type: "sale",
    price: 4200000,
    price_unit: "total",
    area_sqft: 1200,
    bedrooms: null,
    bathrooms: null,
    location_area: "Tambaram",
    location_city: "Chennai",
    location_state: "Tamil Nadu",
    address: "Survey No. 234, Tambaram Sanatorium, Chennai 600045",
    facing: "north",
    floor_number: null,
    total_floors: null,
    is_furnished: null,
    amenities: ["Clear Title", "DTCP Approved", "Road Access", "Water Connection"],
    is_featured: true,
    is_active: true,
    whatsapp_number: "919876543210",
    slug: "1200-sqft-dtcp-plot-tambaram-chennai-for-sale",
    created_at: "2025-01-08T07:00:00Z",
    updated_at: "2025-01-13T09:30:00Z",
  },
  {
    id: "prop-004",
    title: "Commercial Shop Space — T. Nagar",
    description:
      "Prime commercial shop on ground floor in T. Nagar main road. High footfall area opposite Pondy Bazaar. Currently vacant. Suitable for showroom, clinic, salon, or retail outlet. 100% vastu compliant. Two entrances — one from main road, one from interior lane. Ideal for brands looking for premium location in Chennai's busiest shopping district.",
    property_type: "shop",
    listing_type: "lease",
    price: 85000,
    price_unit: "per_month",
    area_sqft: 620,
    bedrooms: null,
    bathrooms: 1,
    location_area: "T. Nagar",
    location_city: "Chennai",
    location_state: "Tamil Nadu",
    address: "78, Usman Road, T. Nagar, Chennai 600017",
    facing: "south",
    floor_number: 1,
    total_floors: 3,
    is_furnished: "unfurnished",
    amenities: ["Main Road Facing", "Parking Available", "24/7 Access", "CCTV", "Power Backup"],
    is_featured: false,
    is_active: true,
    whatsapp_number: "919876543210",
    slug: "commercial-shop-t-nagar-chennai-for-lease",
    created_at: "2025-01-11T06:00:00Z",
    updated_at: "2025-01-14T08:00:00Z",
  },
  {
    id: "prop-005",
    title: "4 BHK Independent Villa — Velachery",
    description:
      "Luxurious 4 BHK independent villa with terrace garden and private parking. Modern architecture with traditional South Indian touches. Ready to move. Ground floor: living room, dining, kitchen with utility, one bedroom (guest). First floor: master bedroom with walk-in wardrobe, two bedrooms with attached bathrooms. Terrace: open party area with city view. Solar power backup and home theatre room included.",
    property_type: "villa",
    listing_type: "sale",
    price: 22000000,
    price_unit: "total",
    area_sqft: 2800,
    bedrooms: 4,
    bathrooms: 3,
    location_area: "Velachery",
    location_city: "Chennai",
    location_state: "Tamil Nadu",
    address: "15, Velachery Main Road, Velachery, Chennai 600042",
    facing: "north_east",
    floor_number: null,
    total_floors: 2,
    is_furnished: "furnished",
    amenities: ["Private Garden", "Terrace", "Parking x2", "Solar Power", "Home Theatre", "CCTV", "Security", "Modular Kitchen", "Wardrobe", "AC"],
    is_featured: true,
    is_active: true,
    whatsapp_number: "919876543210",
    slug: "4-bhk-villa-velachery-chennai-for-sale",
    created_at: "2025-01-09T05:00:00Z",
    updated_at: "2025-01-15T07:00:00Z",
  },
]

export const mockPropertyImages: PropertyImage[] = [
  // Prop 1 — Anna Nagar Apartment
  { id: "img-001", property_id: "prop-001", image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80", storage_path: "", is_primary: true, sort_order: 0, created_at: "2025-01-10T08:00:00Z" },
  { id: "img-002", property_id: "prop-001", image_url: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=80", storage_path: "", is_primary: false, sort_order: 1, created_at: "2025-01-10T08:00:00Z" },
  { id: "img-003", property_id: "prop-001", image_url: "https://images.unsplash.com/photo-1560185008-b033106af5c3?w=800&q=80", storage_path: "", is_primary: false, sort_order: 2, created_at: "2025-01-10T08:00:00Z" },
  { id: "img-004", property_id: "prop-001", image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", storage_path: "", is_primary: false, sort_order: 3, created_at: "2025-01-10T08:00:00Z" },

  // Prop 2 — OMR Flat
  { id: "img-005", property_id: "prop-002", image_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", storage_path: "", is_primary: true, sort_order: 0, created_at: "2025-01-12T09:00:00Z" },
  { id: "img-006", property_id: "prop-002", image_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", storage_path: "", is_primary: false, sort_order: 1, created_at: "2025-01-12T09:00:00Z" },
  { id: "img-007", property_id: "prop-002", image_url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80", storage_path: "", is_primary: false, sort_order: 2, created_at: "2025-01-12T09:00:00Z" },

  // Prop 3 — Tambaram Plot
  { id: "img-008", property_id: "prop-003", image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", storage_path: "", is_primary: true, sort_order: 0, created_at: "2025-01-08T07:00:00Z" },

  // Prop 4 — T. Nagar Shop
  { id: "img-009", property_id: "prop-004", image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80", storage_path: "", is_primary: true, sort_order: 0, created_at: "2025-01-11T06:00:00Z" },
  { id: "img-010", property_id: "prop-004", image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80", storage_path: "", is_primary: false, sort_order: 1, created_at: "2025-01-11T06:00:00Z" },

  // Prop 5 — Velachery Villa
  { id: "img-011", property_id: "prop-005", image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", storage_path: "", is_primary: true, sort_order: 0, created_at: "2025-01-09T05:00:00Z" },
  { id: "img-012", property_id: "prop-005", image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", storage_path: "", is_primary: false, sort_order: 1, created_at: "2025-01-09T05:00:00Z" },
  { id: "img-013", property_id: "prop-005", image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", storage_path: "", is_primary: false, sort_order: 2, created_at: "2025-01-09T05:00:00Z" },
  { id: "img-014", property_id: "prop-005", image_url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80", storage_path: "", is_primary: false, sort_order: 3, created_at: "2025-01-09T05:00:00Z" },
]

export function getMockPropertyBySlug(slug: string): (Property & { property_images: PropertyImage[] }) | undefined {
  const property = mockProperties.find((p) => p.slug === slug || p.id === slug)
  if (!property) return undefined
  const images = mockPropertyImages.filter((img) => img.property_id === property.id)
  return { ...property, property_images: images }
}

export function getMockPropertyById(id: string): (Property & { property_images: PropertyImage[] }) | undefined {
  const property = mockProperties.find((p) => p.id === id)
  if (!property) return undefined
  const images = mockPropertyImages.filter((img) => img.property_id === property.id)
  return { ...property, property_images: images }
}

export function getMockImages(propertyId: string): PropertyImage[] {
  return mockPropertyImages.filter((img) => img.property_id === propertyId)
}

export function getMockFeaturedProperties(): Property[] {
  return mockProperties.filter((p) => p.is_featured)
}

export function getMockSimilarProperties(property: Property): Property[] {
  return mockProperties.filter(
    (p) => p.id !== property.id && (p.property_type === property.property_type || p.location_area === property.location_area)
  ).slice(0, 3)
}
