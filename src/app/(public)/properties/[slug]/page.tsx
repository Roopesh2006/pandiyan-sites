import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { getMockPropertyBySlug, getMockSimilarProperties } from "@/lib/mock-data"
import {
  type PropertyImage,
  formatIndianPrice,
  getPropertyImage,
  LISTING_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
  isVastuFriendly,
} from "@/lib/supabase/types"
import { PropertySchema } from "@/components/seo/Schemas"
import { WhatsAppButton } from "@/components/public/WhatsAppButton"
import { ImageReveal } from "@/components/public/ImageReveal"
import { PropertyCard } from "@/components/public/PropertyCard"
import { SplitLines } from "@/components/motion/SplitLines"
import { Reveal } from "@/components/motion/Reveal"
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Building,
  Compass,
  Home,
  ChevronRight,
} from "lucide-react"

export const revalidate = 3600

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const property = getMockPropertyBySlug(params.slug)

  if (!property) return { title: "Property Not Found | Pandiyan Sites" }

  const typeLabel =
    PROPERTY_TYPE_LABELS[property.property_type as keyof typeof PROPERTY_TYPE_LABELS] ||
    property.property_type
  const title = `${property.bedrooms ? `${property.bedrooms} BHK ` : ""}${typeLabel} ${
    property.listing_type === "sale" ? "for Sale" : "for Rent"
  } in ${property.location_area} — ${formatIndianPrice(property.price, property.price_unit)}`
  const description = `${property.title}. ${
    property.area_sqft ? `${property.area_sqft} sqft. ` : ""
  }${property.bedrooms ? `${property.bedrooms} Bedrooms. ` : ""}${
    property.bathrooms ? `${property.bathrooms} Bathrooms. ` : ""
  }Located in ${property.location_area}, ${property.location_city}. Contact Pandiyan Sites on WhatsApp for details.`

  const primaryImage = property.property_images?.find(
    (img: PropertyImage) => img.is_primary
  )

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: primaryImage
        ? [{ url: primaryImage.image_url, width: 1200, height: 630 }]
        : [],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: {
      canonical: `https://www.pandiyansites.com/properties/${params.slug}`,
    },
  }
}

const detailRow =
  "flex items-start gap-3 bg-bone-100 px-4 py-3.5 text-body text-ink-900"

export default async function PropertyDetailPage({ params }: PageProps) {
  const property = getMockPropertyBySlug(params.slug)

  if (!property) notFound()

  const images: PropertyImage[] = property.property_images || []
  const primaryImage = images.find((img) => img.is_primary) || images[0]
  const galleryImages = [...images].sort((a, b) => a.sort_order - b.sort_order)

  const vastu = isVastuFriendly(property.facing)
  const similarProperties = getMockSimilarProperties(property)

  const specs = [
    property.bedrooms && {
      icon: Bed,
      label: "Bedrooms",
      value: `${property.bedrooms} BHK`,
    },
    property.bathrooms && {
      icon: Bath,
      label: "Bathrooms",
      value: String(property.bathrooms),
    },
    property.area_sqft && {
      icon: Maximize,
      label: "Area",
      value: `${property.area_sqft.toLocaleString()} sqft`,
    },
    property.facing && {
      icon: Compass,
      label: "Facing",
      value: property.facing.replace("_", " "),
    },
    property.floor_number && {
      icon: Building,
      label: "Floor",
      value: `${property.floor_number}${
        property.total_floors ? ` / ${property.total_floors}` : ""
      }`,
    },
    property.is_furnished && {
      icon: Home,
      label: "Furnishing",
      value: property.is_furnished.replace("_", " "),
    },
  ].filter(Boolean) as { icon: typeof Bed; label: string; value: string }[]

  return (
    <>
      <PropertySchema property={property} images={images} />

      <div className="min-h-screen field-bone">
        {/* Title field */}
        <header className="field-ink pb-16 pt-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex flex-wrap items-center gap-2 text-small text-bone/50"
            >
              <Link href="/" className="transition-colors hover:text-brass">
                Home
              </Link>
              <ChevronRight size={13} aria-hidden="true" />
              <Link href="/properties" className="transition-colors hover:text-brass">
                Properties
              </Link>
              <ChevronRight size={13} aria-hidden="true" />
              <span className="text-bone/80">{property.location_area}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 text-small text-bone/60">
              <span className="bg-bone px-3 py-1.5 text-ink-950">
                {LISTING_TYPE_LABELS[property.listing_type]}
              </span>
              <span>
                {PROPERTY_TYPE_LABELS[property.property_type]}
              </span>
              {vastu && <span className="text-brass">Vastu facing</span>}
            </div>

            <SplitLines
              as="h1"
              className="mt-5 max-w-4xl font-display text-section text-bone"
              lines={[property.title]}
            />

            <Reveal delay={200} className="mt-7 flex flex-wrap items-end gap-x-10 gap-y-4">
              <p className="tnum font-display text-5xl text-brass">
                {formatIndianPrice(property.price, property.price_unit)}
              </p>
              {property.price_unit === "total" && property.area_sqft && (
                <p className="tnum text-body text-bone/60">
                  ₹
                  {Math.round(property.price / property.area_sqft).toLocaleString(
                    "en-IN"
                  )}{" "}
                  / sqft
                </p>
              )}
              <p className="flex items-center gap-2 text-body text-bone/60">
                <MapPin size={16} className="text-brass" aria-hidden="true" />
                {property.location_area}, {property.location_city}
              </p>
            </Reveal>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-section sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Gallery */}
            <div className="lg:col-span-3">
              <div className="relative aspect-[16/10] overflow-hidden bg-bone-200">
                <Image
                  src={primaryImage?.image_url || getPropertyImage(property)}
                  alt={property.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                <span className="absolute left-0 top-0 bg-ink-950 px-3 py-1.5 text-small text-bone">
                  {LISTING_TYPE_LABELS[property.listing_type]}
                </span>
                {property.is_featured && (
                  <span className="absolute right-0 top-0 bg-oxblood px-3 py-1.5 text-small text-bone">
                    Featured
                  </span>
                )}
                <span className="tnum absolute bottom-0 right-0 bg-bone px-3 py-1.5 text-small text-ink-950">
                  {images.length} photos
                </span>
              </div>

              {galleryImages.length > 1 && (
                <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden bg-bone-200 sm:w-36"
                    >
                      <Image
                        src={img.image_url}
                        alt={`${property.title} — photograph ${img.sort_order + 1}`}
                        fill
                        sizes="144px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {property.description && (
                <div className="mt-14 max-w-[46rem]">
                  <h2 className="font-display text-3xl text-ink-900">
                    About this property
                  </h2>
                  <p className="mt-5 text-body leading-relaxed text-smoke">
                    {property.description}
                  </p>
                </div>
              )}

              {galleryImages.length > 0 && (
                <div className="mt-14">
                  <h2 className="font-display text-3xl text-ink-900">Gallery</h2>
                  <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {galleryImages.slice(0, 4).map((img) => (
                      <ImageReveal key={img.id} src={img.image_url} alt={property.title} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Facts and action */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-28">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {specs.map((spec) => (
                    <div key={spec.label} className={detailRow}>
                      <spec.icon size={17} className="mt-1 shrink-0 text-brass" aria-hidden="true" />
                      <div>
                        <p className="text-small text-smoke">{spec.label}</p>
                        <p className="mt-0.5 capitalize">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <div className="mt-10">
                    <h2 className="font-display text-2xl text-ink-900">Amenities</h2>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {property.amenities.map((amenity) => (
                        <li
                          key={amenity}
                          className="border border-bone-300 px-3 py-1.5 text-small text-smoke"
                        >
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-10 bg-bone-200 p-6">
                  <p className="font-display text-xl text-ink-900">
                    Interested in this property?
                  </p>
                  <p className="mt-2 text-small text-smoke">
                    Message the owner directly. Usual reply inside 30 minutes.
                  </p>
                  <div className="mt-5">
                    <WhatsAppButton
                      propertyTitle={property.title}
                      propertyId={property.id}
                      variant="detail"
                      whatsappNumber={property.whatsapp_number}
                    />
                  </div>
                  <a
                    href={`tel:${property.whatsapp_number}`}
                    className="press mt-3 flex w-full items-center justify-center gap-2 border border-ink-900 px-6 py-3.5 text-[15px] text-ink-900 transition-colors duration-200 hover:bg-ink-900 hover:text-bone"
                  >
                    Call now
                  </a>
                </div>

                <p className="mt-5 text-small text-smoke">
                  {property.address || `${property.location_area}, ${property.location_city}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {similarProperties.length > 0 && (
          <section className="mx-auto max-w-[1440px] px-5 pb-section sm:px-8">
            <h2 className="font-display text-section text-ink-900">
              More in {property.location_area}
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {similarProperties.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="lg:hidden">
        <WhatsAppButton
          propertyTitle={property.title}
          propertyId={property.id}
          variant="floating"
          whatsappNumber={property.whatsapp_number}
        />
      </div>
    </>
  )
}
