"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { mockProperties } from "@/lib/mock-data"
import type { Property } from "@/lib/supabase/types"
import { formatIndianPrice, getPropertyImage } from "@/lib/supabase/types"
import { PlusCircle, Search, Trash2, Edit, Eye, EyeOff } from "lucide-react"

export default function PropertyListPage() {
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [search, setSearch] = useState("")
  const [deleteModal, setDeleteModal] = useState<string | null>(null)

  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location_area?.toLowerCase().includes(search.toLowerCase())
  )

  const toggleActive = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p))
    )
  }

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id))
    setDeleteModal(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-cormorant text-3xl font-semibold text-primary">Properties</h1>
        <Link
          href="/dashboard/properties/new"
          className="flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-button font-dm text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          <PlusCircle size={16} />
          Add Property
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search by title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-card border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border" data-ui>
              <th className="text-left px-5 py-3 font-dm text-xs font-medium text-text-muted uppercase">Property</th>
              <th className="text-left px-5 py-3 font-dm text-xs font-medium text-text-muted uppercase">Type</th>
              <th className="text-left px-5 py-3 font-dm text-xs font-medium text-text-muted uppercase">Price</th>
              <th className="text-left px-5 py-3 font-dm text-xs font-medium text-text-muted uppercase">Status</th>
              <th className="text-left px-5 py-3 font-dm text-xs font-medium text-text-muted uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <tr key={property.id} className="border-b border-border/50 hover:bg-surface/50" data-ui>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-image overflow-hidden shrink-0">
                        <Image
                          src={getPropertyImage(property)}
                          alt={property.title}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-dm text-sm text-primary font-medium truncate max-w-[200px]">{property.title}</p>
                        <p className="font-dm text-xs text-text-muted">{property.location_area}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-dm text-sm text-text-muted capitalize">
                    {property.property_type.replace("_", " ")}
                  </td>
                  <td className="px-5 py-3 font-dm text-sm text-primary font-medium">
                    {formatIndianPrice(property.price, property.price_unit)}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleActive(property.id)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-chip text-xs font-dm transition-colors ${
                        property.is_active
                          ? "bg-success/10 text-success hover:bg-success/20"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      {property.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                      {property.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/properties/${property.id}/edit`}
                        className="p-1.5 text-accent hover:bg-accent/10 rounded transition-colors"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteModal(property.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center font-dm text-sm text-text-muted">
                  No properties found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteModal(null)} />
          <div className="relative bg-white rounded-card p-6 max-w-sm w-full mx-4 shadow-xl" data-ui>
            <h3 className="font-cormorant text-xl font-semibold text-primary mb-2">Delete Property?</h3>
            <p className="font-dm text-sm text-text-muted mb-6">
              This action cannot be undone. The property and all its images will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded-button border border-border font-dm text-sm text-text-muted hover:border-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProperty(deleteModal)}
                className="px-4 py-2 rounded-button bg-red-500 text-white font-dm text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
