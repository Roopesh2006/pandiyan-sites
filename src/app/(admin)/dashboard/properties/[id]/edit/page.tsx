"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { PropertyType, ListingType, PriceUnit, Facing, FurnishingStatus } from "@/lib/supabase/types"
import { ArrowLeft, ArrowRight, Save, X, Upload } from "lucide-react"

const AMENITIES = [
  "Parking", "Lift", "Power Backup", "Security", "Gym", "Swimming Pool",
  "Garden", "Play Area", "CCTV", "Water 24/7", "Piped Gas", "Maintenance Staff",
  "Clubhouse", "Temple Nearby", "High Speed Internet", "AC", "Generator",
  "Cafeteria", "Conference Room", "Modular Kitchen", "Wardrobe", "Solar Power",
  "Home Theatre", "Terrace", "Clear Title", "DTCP Approved", "Road Access",
  "Water Connection", "Main Road Facing", "24/7 Access",
]

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [propertyType, setPropertyType] = useState<PropertyType>("apartment")
  const [listingType, setListingType] = useState<ListingType>("sale")
  const [price, setPrice] = useState("")
  const [priceUnit, setPriceUnit] = useState<PriceUnit>("total")
  const [areaSqft, setAreaSqft] = useState("")
  const [bedrooms, setBedrooms] = useState("")
  const [bathrooms, setBathrooms] = useState("")
  const [floorNumber, setFloorNumber] = useState("")
  const [totalFloors, setTotalFloors] = useState("")
  const [facing, setFacing] = useState<Facing | "">("")
  const [furnishing, setFurnishing] = useState<FurnishingStatus | "">("")
  const [locationArea, setLocationArea] = useState("")
  const [address, setAddress] = useState("")
  const [amenities, setAmenities] = useState<string[]>([])
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<{id: string; image_url: string; storage_path: string; is_primary: boolean}[]>([])
  const [primaryIndex] = useState(0)

  useEffect(() => {
    const fetchProperty = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("properties")
        .select("*, property_images(*)")
        .eq("id", params.id)
        .single()

      if (data) {
        setTitle(data.title)
        setDescription(data.description || "")
        setPropertyType(data.property_type)
        setListingType(data.listing_type)
        setPrice(data.price.toString())
        setPriceUnit(data.price_unit)
        setAreaSqft(data.area_sqft?.toString() || "")
        setBedrooms(data.bedrooms?.toString() || "")
        setBathrooms(data.bathrooms?.toString() || "")
        setFloorNumber(data.floor_number?.toString() || "")
        setTotalFloors(data.total_floors?.toString() || "")
        setFacing(data.facing || "")
        setFurnishing(data.is_furnished || "")
        setLocationArea(data.location_area || "")
        setAddress(data.address || "")
        setAmenities(data.amenities || [])
        setExistingImages(data.property_images || [])
      }
      setFetching(false)
    }
    fetchProperty()
  }, [params.id])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = [...images, ...files].slice(0, 10 - existingImages.length)
    setImages(newImages)
    setImagePreviews(newImages.map((file) => URL.createObjectURL(file)))
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = async (imageId: string, storagePath: string) => {
    const supabase = createClient()
    await supabase.storage.from("property-images").remove([storagePath])
    await supabase.from("property_images").delete().eq("id", imageId)
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) => prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity])
  }

  const handleSubmit = async () => {
    setLoading(true)
    const supabase = createClient()

    // Update property
    const { error } = await supabase
      .from("properties")
      .update({
        title,
        description,
        property_type: propertyType,
        listing_type: listingType,
        price: parseFloat(price),
        price_unit: priceUnit,
        area_sqft: areaSqft ? parseFloat(areaSqft) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        floor_number: floorNumber ? parseInt(floorNumber) : null,
        total_floors: totalFloors ? parseInt(totalFloors) : null,
        facing: facing || null,
        is_furnished: furnishing || null,
        location_area: locationArea,
        address: address || null,
        amenities: amenities.length > 0 ? amenities : null,
      })
      .eq("id", params.id)

    if (error) {
      setLoading(false)
      alert("Error updating property")
      return
    }

    // Upload new images
    const existingCount = existingImages.length
    for (let i = 0; i < images.length; i++) {
      const file = images[i]
      const ext = file.name.split(".").pop()
      const path = `${params.id}/${existingCount + i}.${ext}`

      await supabase.storage.from("property-images").upload(path, file)
      const { data: urlData } = supabase.storage.from("property-images").getPublicUrl(path)

      await supabase.from("property_images").insert({
        property_id: params.id,
        image_url: urlData.publicUrl,
        storage_path: path,
        is_primary: existingCount + i === primaryIndex,
        sort_order: existingCount + i,
      })
    }

    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId: params.id }),
    })

    router.push("/dashboard/properties")
  }

  if (fetching) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-card border border-border p-6" data-ui>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 skeleton rounded-input" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 font-dm text-sm text-text-muted hover:text-accent mb-6">
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="font-cormorant text-3xl font-semibold text-primary mb-6">Edit Property</h1>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-dm text-sm font-medium ${s <= step ? "bg-accent text-primary" : "bg-border text-text-muted"}`}>{s}</div>
            <span className={`font-dm text-xs hidden sm:block ${s <= step ? "text-primary" : "text-text-muted"}`}>{s === 1 ? "Basic Info" : s === 2 ? "Details" : "Images"}</span>
            {s < 3 && <div className={`flex-1 h-[2px] ${s < step ? "bg-accent" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-card border border-border p-6" data-ui>
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block font-dm text-sm text-text-muted mb-1">Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block font-dm text-sm text-text-muted mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-dm text-sm text-text-muted mb-1">Property Type</label>
                <select value={propertyType} onChange={(e) => setPropertyType(e.target.value as PropertyType)} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent">
                  <option value="apartment">Apartment</option><option value="villa">Villa</option><option value="plot">Plot</option><option value="commercial">Commercial</option><option value="office">Office</option><option value="shop">Shop</option><option value="warehouse">Warehouse</option><option value="farm_land">Farm Land</option><option value="independent_house">Independent House</option>
                </select>
              </div>
              <div>
                <label className="block font-dm text-sm text-text-muted mb-1">Listing Type</label>
                <div className="flex gap-2">
                  {(["sale", "rent", "lease"] as ListingType[]).map((lt) => (
                    <button key={lt} type="button" onClick={() => setListingType(lt)} className={`flex-1 py-2.5 rounded-chip font-dm text-sm border transition-all capitalize ${listingType === lt ? "bg-primary text-white border-primary" : "bg-white text-text-muted border-border"}`}>{lt}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-dm text-sm text-text-muted mb-1">Price *</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block font-dm text-sm text-text-muted mb-1">Price Unit</label>
                <select value={priceUnit} onChange={(e) => setPriceUnit(e.target.value as PriceUnit)} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent">
                  <option value="total">Total</option><option value="per_sqft">Per Sqft</option><option value="per_month">Per Month</option><option value="per_year">Per Year</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div><label className="block font-dm text-sm text-text-muted mb-1">Area (sqft)</label><input type="number" value={areaSqft} onChange={(e) => setAreaSqft(e.target.value)} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent" /></div>
              <div><label className="block font-dm text-sm text-text-muted mb-1">Bedrooms</label><select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent"><option value="">Any</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div>
              <div><label className="block font-dm text-sm text-text-muted mb-1">Bathrooms</label><select value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent"><option value="">Any</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div>
              <div><label className="block font-dm text-sm text-text-muted mb-1">Floor</label><input type="number" value={floorNumber} onChange={(e) => setFloorNumber(e.target.value)} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent" /></div>
              <div><label className="block font-dm text-sm text-text-muted mb-1">Total Floors</label><input type="number" value={totalFloors} onChange={(e) => setTotalFloors(e.target.value)} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent" /></div>
              <div><label className="block font-dm text-sm text-text-muted mb-1">Facing</label><select value={facing} onChange={(e) => setFacing(e.target.value as Facing)} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent"><option value="">Select</option><option value="north">North</option><option value="south">South</option><option value="east">East</option><option value="west">West</option><option value="north_east">NE</option><option value="north_west">NW</option><option value="south_east">SE</option><option value="south_west">SW</option></select></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block font-dm text-sm text-text-muted mb-1">Furnishing</label><select value={furnishing} onChange={(e) => setFurnishing(e.target.value as FurnishingStatus)} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent"><option value="">Select</option><option value="furnished">Furnished</option><option value="semi_furnished">Semi</option><option value="unfurnished">Unfurnished</option></select></div>
              <div><label className="block font-dm text-sm text-text-muted mb-1">Location Area</label><input type="text" value={locationArea} onChange={(e) => setLocationArea(e.target.value)} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent" /></div>
            </div>
            <div><label className="block font-dm text-sm text-text-muted mb-1">Address</label><textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent resize-none" /></div>
            <div>
              <label className="block font-dm text-sm text-text-muted mb-2">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => (
                  <button key={a} type="button" onClick={() => toggleAmenity(a)} className={`px-3 py-1.5 rounded-chip font-dm text-xs border transition-all ${amenities.includes(a) ? "bg-primary text-white border-primary" : "bg-white text-text-muted border-border"}`}>{a}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            {existingImages.length > 0 && (
              <div>
                <label className="block font-dm text-sm text-text-muted mb-2">Existing Images</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative">
                      <div className="h-32 rounded-image overflow-hidden">
                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <button onClick={() => removeExistingImage(img.id, img.storage_path)} className="absolute top-2 right-2 p-1 rounded-full bg-white/80 text-red-500 hover:bg-red-500 hover:text-white">
                        <X size={12} />
                      </button>
                      {img.is_primary && <span className="absolute bottom-2 left-2 bg-accent text-primary text-[10px] font-dm px-1.5 py-0.5 rounded-chip">Primary</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block font-dm text-sm text-text-muted mb-2">Add New Images</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-card cursor-pointer hover:border-accent transition-colors">
                <Upload size={24} className="text-text-muted mb-2" />
                <span className="font-dm text-sm text-text-muted">Click to upload</span>
                <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="relative">
                    <div className="h-32 rounded-image overflow-hidden"><img src={preview} alt="" className="w-full h-full object-cover" /></div>
                    <button onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1 rounded-full bg-white/80 text-red-500"><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        {step > 1 ? (
          <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-6 py-2.5 rounded-button border border-border font-dm text-sm text-text-muted hover:border-accent"><ArrowLeft size={16} /> Back</button>
        ) : <div />}
        {step < 3 ? (
          <button onClick={() => setStep(step + 1)} className="flex items-center gap-2 bg-accent text-primary px-6 py-2.5 rounded-button font-dm text-sm font-semibold hover:bg-accent/90">Next <ArrowRight size={16} /></button>
        ) : (
          <button onClick={handleSubmit} disabled={loading || !title || !price} className="flex items-center gap-2 bg-accent text-primary px-6 py-2.5 rounded-button font-dm text-sm font-semibold hover:bg-accent/90 disabled:opacity-50">
            {loading ? <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> : <><Save size={16} /> Save Changes</>}
          </button>
        )}
      </div>
    </div>
  )
}
