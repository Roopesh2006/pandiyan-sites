"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Home, Building, PlusCircle, Settings, LogOut, Menu, X, ChevronLeft } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/properties", label: "Properties", icon: Building },
  { href: "/dashboard/properties/new", label: "Add Property", icon: PlusCircle },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar — Desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-surface-dark transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[260px]"
        }`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-accent rounded-card flex items-center justify-center">
                <span className="text-primary font-cormorant text-lg font-bold">P</span>
              </div>
              <span className="font-cormorant text-lg font-semibold text-white">Pandiyan</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/50 hover:text-accent"
          >
            <ChevronLeft size={18} className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-button font-dm text-sm mb-1 transition-all ${
                  isActive
                    ? "bg-accent/10 text-accent border-l-[3px] border-accent"
                    : "text-white/50 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={18} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-white/10" data-ui>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-button font-dm text-sm text-white/50 hover:text-red-400 hover:bg-red-400/10 w-full transition-all"
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-surface-dark">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-accent rounded-card flex items-center justify-center">
                  <span className="text-primary font-cormorant text-lg font-bold">P</span>
                </div>
                <span className="font-cormorant text-lg font-semibold text-white">Pandiyan</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-white/50">
                <X size={20} />
              </button>
            </div>
            <nav className="px-2 mt-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-button font-dm text-sm mb-1 ${
                      isActive
                        ? "bg-accent/10 text-accent border-l-[3px] border-accent"
                        : "text-white/50 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent"
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
            <div className="p-2 border-t border-white/10 mt-4" data-ui>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-button font-dm text-sm text-white/50 hover:text-red-400 w-full"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-border px-4 py-3 flex items-center justify-between" data-ui>
          <button onClick={() => setMobileOpen(true)} className="text-primary">
            <Menu size={24} />
          </button>
          <span className="font-cormorant text-lg font-semibold text-primary">Dashboard</span>
          <div className="w-6" />
        </header>

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
