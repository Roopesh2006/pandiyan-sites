import Link from "next/link"
import Image from "next/image"
import { mockProperties } from "@/lib/mock-data"
import { formatIndianPrice, getPropertyImage } from "@/lib/supabase/types"
import { Building, TrendingUp, Home, DollarSign, PlusCircle, Settings } from "lucide-react"

export default async function DashboardPage() {
  const totalProperties = mockProperties.length
  const activeProperties = mockProperties.filter((p) => p.is_active).length
  const saleCount = mockProperties.filter((p) => p.listing_type === "sale").length
  const rentCount = mockProperties.filter((p) => p.listing_type === "rent").length
  const recentProperties = [...mockProperties].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)

  const stats = [
    { label: "Total Properties", value: totalProperties, icon: Building, color: "bg-ink-800" },
    { label: "Active Listings", value: activeProperties, icon: TrendingUp, color: "bg-success" },
    { label: "For Sale", value: saleCount, icon: Home, color: "bg-accent" },
    { label: "For Rent", value: rentCount, icon: DollarSign, color: "bg-oxblood" },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cormorant text-3xl font-semibold text-primary">Dashboard</h1>
          <p className="font-dm text-sm text-text-muted">Welcome back! Here&apos;s your property overview.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/properties/new"
            className="flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-button font-dm text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            <PlusCircle size={16} />
            Add Property
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 border border-border px-4 py-2 rounded-button font-dm text-sm text-primary hover:border-accent transition-colors"
          >
            <Settings size={16} />
            Settings
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.color} rounded-card flex items-center justify-center`}>
                <stat.icon size={20} className="text-white" />
              </div>
            </div>
            <p className="font-playfair text-3xl font-bold text-primary">{stat.value}</p>
            <p className="font-dm text-sm text-text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-card border border-border">
        <div className="bg-surface px-5 py-4 flex items-center justify-between">
          <h2 className="font-cormorant text-xl font-semibold text-primary">Recent Properties</h2>
          <Link href="/dashboard/properties" className="font-dm text-sm text-accent hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
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
              {recentProperties.map((property) => (
                <tr key={property.id} className="border-b border-border/50 hover:bg-surface/50" data-ui>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-image overflow-hidden">
                        <Image
                          src={getPropertyImage(property)}
                          alt={property.title}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <span className="font-dm text-sm text-primary font-medium truncate max-w-[200px]">
                        {property.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-dm text-sm text-text-muted capitalize">
                    {property.property_type.replace("_", " ")}
                  </td>
                  <td className="px-5 py-3 font-dm text-sm text-primary font-medium">
                    {formatIndianPrice(property.price, property.price_unit)}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-chip text-xs font-dm ${property.is_active ? "bg-success/10 text-success" : "bg-red-100 text-red-600"}`}>
                      {property.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/dashboard/properties/${property.id}/edit`}
                      className="font-dm text-sm text-accent hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
