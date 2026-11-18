"use client"
import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { mockProperties } from "@/lib/mock-data"
import { PropertyCard } from "@/components/public/PropertyCard"
import { SearchFilters, type FilterState } from "@/components/public/SearchFilters"
import { PropertyGridSkeleton } from "@/components/public/Skeletons"
import { SplitLines } from "@/components/motion/SplitLines"
import { Reveal } from "@/components/motion/Reveal"
import { X } from "lucide-react"

export default function PropertiesPage() {
  return (
    <Suspense fallback={<PropertyGridSkeleton />}>
      <PropertiesContent />
    </Suspense>
  )
}

function PropertiesContent() {
  const searchParams = useSearchParams()
  const [sortBy, setSortBy] = useState("newest")
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    listing_type: (searchParams.get("listing") as FilterState["listing_type"]) || "",
    property_types: searchParams.get("type")
      ? [searchParams.get("type") as FilterState["property_types"][number]]
      : [],
    price_min: "",
    price_max: "",
    bedrooms: "",
    location: "",
    furnishing: "",
  })

  const filteredProperties = useMemo(() => {
    let result = [...mockProperties]

    if (filters.listing_type) {
      result = result.filter((p) => p.listing_type === filters.listing_type)
    }

    if (filters.property_types.length > 0) {
      result = result.filter((p) => filters.property_types.includes(p.property_type))
    }

    if (filters.bedrooms) {
      const beds = parseInt(filters.bedrooms)
      if (beds === 4) {
        result = result.filter((p) => (p.bedrooms || 0) >= 4)
      } else {
        result = result.filter((p) => p.bedrooms === beds)
      }
    }

    if (filters.price_min) {
      result = result.filter((p) => p.price >= parseInt(filters.price_min))
    }

    if (filters.price_max) {
      result = result.filter((p) => p.price <= parseInt(filters.price_max))
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase()
      result = result.filter(
        (p) =>
          p.location_area?.toLowerCase().includes(loc) ||
          p.location_city.toLowerCase().includes(loc)
      )
    }

    if (filters.furnishing) {
      result = result.filter((p) => p.is_furnished === filters.furnishing)
    }

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location_area?.toLowerCase().includes(q)
      )
    }

    switch (sortBy) {
      case "price_low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price_high":
        result.sort((a, b) => b.price - a.price)
        break
      case "area":
        result.sort((a, b) => (b.area_sqft || 0) - (a.area_sqft || 0))
        break
      default:
        result.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    }

    return result
  }, [filters, sortBy])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const activeFilterCount = [
    filters.listing_type,
    filters.property_types?.length,
    filters.search,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen">
      {/* Header field */}
      <header className="field-ink pb-14 pt-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <SplitLines
            as="h1"
            className="max-w-4xl font-display text-section text-bone"
            lines={["Property in Chennai", "and Tamil Nadu"]}
          />
          <Reveal delay={220} className="mt-6 max-w-xl">
            <p className="text-lede text-bone/70">
              Every listing inspected before publication, every enquiry sent
              straight to the owner.
            </p>
          </Reveal>
        </div>
      </header>

      <div className="field-bone pb-section">
        <div className="mx-auto max-w-[1440px] px-5 pt-12 sm:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
            <aside className="lg:w-72 lg:shrink-0">
              <SearchFilters onFilterChange={handleFilterChange} initialFilters={filters} />
            </aside>

            <div className="flex-1">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <p className="tnum text-body text-smoke">
                  {filteredProperties.length}{" "}
                  {filteredProperties.length === 1 ? "property" : "properties"}
                </p>

                <label className="flex items-center gap-3 text-body text-smoke">
                  Sort
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-bone-300 bg-bone-100 px-3.5 py-2.5 text-[15px] text-ink-900 focus:border-brass focus:outline-none"
                  >
                    <option value="newest">Newest first</option>
                    <option value="price_low">Price: low to high</option>
                    <option value="price_high">Price: high to low</option>
                    <option value="area">Area: large to small</option>
                  </select>
                </label>
              </div>

              {activeFilterCount > 0 && (
                <div className="mb-8 flex flex-wrap gap-2">
                  {filters.listing_type && (
                    <button
                      type="button"
                      onClick={() => setFilters({ ...filters, listing_type: "" })}
                      className="flex items-center gap-1.5 bg-ink-900 px-3 py-1.5 text-small text-bone"
                    >
                      {filters.listing_type === "sale"
                        ? "For sale"
                        : filters.listing_type === "rent"
                          ? "For rent"
                          : "For lease"}
                      <X size={12} aria-hidden="true" />
                    </button>
                  )}
                  {filters.property_types?.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setFilters({
                          ...filters,
                          property_types: filters.property_types.filter((pt) => pt !== t),
                        })
                      }
                      className="flex items-center gap-1.5 bg-ink-900 px-3 py-1.5 text-small capitalize text-bone"
                    >
                      {t.replace("_", " ")}
                      <X size={12} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}

              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProperties.map((property, i) => (
                    <PropertyCard key={property.id} property={property} index={i} />
                  ))}
                </div>
              ) : (
                <div className="py-24">
                  <p className="font-display text-3xl text-ink-900">
                    Nothing matches those filters
                  </p>
                  <p className="mt-4 max-w-md text-body text-smoke">
                    Loosen the price or the bedroom count and the list will
                    fill back up.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
