"use client"
import { useState } from "react"
import { X, SlidersHorizontal } from "lucide-react"
import type { PropertyType, ListingType } from "@/lib/supabase/types"

interface SearchFiltersProps {
  onFilterChange: (filters: FilterState) => void
  initialFilters?: Partial<FilterState>
}

export interface FilterState {
  search: string
  listing_type: ListingType | ""
  property_types: PropertyType[]
  price_min: string
  price_max: string
  bedrooms: string
  location: string
  furnishing: string
}

const defaultFilters: FilterState = {
  search: "",
  listing_type: "",
  property_types: [],
  price_min: "",
  price_max: "",
  bedrooms: "",
  location: "",
  furnishing: "",
}

const listingTypes: { value: ListingType; label: string }[] = [
  { value: "sale", label: "For sale" },
  { value: "rent", label: "For rent" },
  { value: "lease", label: "For lease" },
]

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "plot", label: "Plot" },
  { value: "commercial", label: "Commercial" },
  { value: "office", label: "Office" },
  { value: "shop", label: "Shop" },
  { value: "warehouse", label: "Warehouse" },
  { value: "farm_land", label: "Farm land" },
  { value: "independent_house", label: "Independent house" },
]

const bedroomOptions = ["", "1", "2", "3", "4"]
const furnishingOptions = ["furnished", "semi_furnished", "unfurnished"]

const chipBase =
  "border px-3.5 py-2 text-[15px] transition-colors duration-200"
const chipOff = "border-bone-300 bg-transparent text-smoke hover:border-ink-900 hover:text-ink-900"
const chipOn = "border-ink-900 bg-ink-900 text-bone"

const fieldBase =
  "w-full border border-bone-300 bg-bone-100 px-3.5 py-2.5 text-[15px] text-ink-900 placeholder:text-smoke/70 focus:border-brass focus:outline-none"

export function SearchFilters({ onFilterChange, initialFilters }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialFilters,
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const togglePropertyType = (type: PropertyType) => {
    const current = filters.property_types
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type]
    updateFilter("property_types", updated)
  }

  const clearAll = () => {
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  const hasActiveFilters =
    filters.search ||
    filters.listing_type ||
    filters.property_types.length > 0 ||
    filters.price_min ||
    filters.price_max ||
    filters.bedrooms ||
    filters.location ||
    filters.furnishing

  const filterContent = (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-3 font-display text-xl text-ink-900">Listing</legend>
        <div className="flex flex-wrap gap-2">
          {listingTypes.map((lt) => (
            <button
              key={lt.value}
              type="button"
              onClick={() => updateFilter("listing_type", filters.listing_type === lt.value ? "" : lt.value)}
              aria-pressed={filters.listing_type === lt.value}
              className={`${chipBase} ${filters.listing_type === lt.value ? chipOn : chipOff}`}
            >
              {lt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-display text-xl text-ink-900">Property type</legend>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((pt) => (
            <button
              key={pt.value}
              type="button"
              onClick={() => togglePropertyType(pt.value)}
              aria-pressed={filters.property_types.includes(pt.value)}
              className={`${chipBase} text-sm ${
                filters.property_types.includes(pt.value) ? chipOn : chipOff
              }`}
            >
              {pt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-display text-xl text-ink-900">Price</legend>
        <div className="flex items-center gap-3">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            aria-label="Minimum price"
            value={filters.price_min}
            onChange={(e) => updateFilter("price_min", e.target.value)}
            className={fieldBase}
          />
          <span aria-hidden="true" className="text-smoke">
            –
          </span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            aria-label="Maximum price"
            value={filters.price_max}
            onChange={(e) => updateFilter("price_max", e.target.value)}
            className={fieldBase}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-display text-xl text-ink-900">Bedrooms</legend>
        <div className="flex flex-wrap gap-2">
          {bedroomOptions.map((opt) => (
            <button
              key={opt || "any"}
              type="button"
              onClick={() => updateFilter("bedrooms", filters.bedrooms === opt ? "" : opt)}
              aria-pressed={filters.bedrooms === opt}
              className={`${chipBase} ${filters.bedrooms === opt ? chipOn : chipOff}`}
            >
              {opt || "Any"}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="filter-location" className="mb-3 block font-display text-xl text-ink-900">
          Location
        </label>
        <input
          id="filter-location"
          type="text"
          placeholder="Anna Nagar, OMR, Tambaram…"
          value={filters.location}
          onChange={(e) => updateFilter("location", e.target.value)}
          className={fieldBase}
        />
      </div>

      <fieldset>
        <legend className="mb-3 font-display text-xl text-ink-900">Furnishing</legend>
        <div className="flex flex-wrap gap-2">
          {furnishingOptions.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => updateFilter("furnishing", filters.furnishing === f ? "" : f)}
              aria-pressed={filters.furnishing === f}
              className={`${chipBase} capitalize ${filters.furnishing === f ? chipOn : chipOff}`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>
      </fieldset>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="flex items-center gap-1.5 text-[15px] text-smoke underline decoration-bone-300 underline-offset-4 transition-colors duration-200 hover:text-ink-900"
        >
          <X size={14} aria-hidden="true" />
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          className="flex items-center gap-2 border border-ink-900 px-4 py-2.5 text-[15px] text-ink-900 transition-colors duration-200 hover:bg-ink-900 hover:text-bone"
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filters
          {hasActiveFilters && <span className="h-2 w-2 bg-brass" aria-hidden="true" />}
        </button>
      </div>

      <div className="hidden lg:block">{filterContent}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-ink-950/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto bg-bone px-5 pb-8 pt-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl text-ink-900">Filters</h2>
              <button type="button" aria-label="Close filters" onClick={() => setMobileOpen(false)}>
                <X size={22} />
              </button>
            </div>
            {filterContent}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="mt-8 w-full bg-ink-900 px-6 py-3.5 text-[15px] text-bone"
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </>
  )
}
