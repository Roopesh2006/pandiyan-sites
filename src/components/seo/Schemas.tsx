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

interface PropertySchemaProps {
  property: {
    title: string
    description: string | null
    property_type: string
    listing_type: string
    price: number
    location_area: string | null
    location_city: string
    id: string
    slug: string | null
    created_at: string
    address: string | null
    bedrooms: number | null
    bathrooms: number | null
    area_sqft: number | null
    amenities: string[] | null
  }
  images: { image_url: string }[]
}

export function PropertySchema({ property, images }: PropertySchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description || `${property.property_type} for ${property.listing_type} in ${property.location_area}, Chennai`,
    "url": `https://www.pandiyansites.com/properties/${property.slug || property.id}`,
    "datePosted": property.created_at,
    "image": images.map((img) => img.image_url),
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
