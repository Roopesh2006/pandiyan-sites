"use client"
import { useState } from "react"
import { mockSiteConfig } from "@/lib/mock-data"
import { Save, Upload } from "lucide-react"

export default function SettingsPage() {
  const [config, setConfig] = useState(mockSiteConfig)
  const [saving, setSaving] = useState(false)
  const [bannerPreview, setBannerPreview] = useState<string | null>(config.banner_image_url)

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerPreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    // In mock mode, just simulate a save
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
    alert("Settings saved! (Mock mode — not persisted)")
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-cormorant text-3xl font-semibold text-primary mb-6">Site Settings</h1>

      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-white rounded-card border border-border p-6">
          <h2 className="font-cormorant text-xl font-semibold text-primary mb-4">Hero Banner</h2>
          {bannerPreview && (
            <div className="relative h-48 rounded-image overflow-hidden mb-4">
              <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-border rounded-card cursor-pointer hover:border-accent transition-colors">
            <Upload size={18} className="text-text-muted" />
            <span className="font-dm text-sm text-text-muted">Upload new banner</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleBannerUpload} className="hidden" />
          </label>
        </div>

        {/* Contact Details */}
        <div className="bg-white rounded-card border border-border p-6">
          <h2 className="font-cormorant text-xl font-semibold text-primary mb-4">Contact Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-dm text-sm text-text-muted mb-1">WhatsApp Number</label>
                <input type="text" value={config.whatsapp_number || ""} onChange={(e) => setConfig({ ...config, whatsapp_number: e.target.value })} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent" placeholder="919XXXXXXXXXX" />
              </div>
              <div>
                <label className="block font-dm text-sm text-text-muted mb-1">Phone Number</label>
                <input type="text" value={config.phone_number || ""} onChange={(e) => setConfig({ ...config, phone_number: e.target.value })} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent" />
              </div>
            </div>
            <div>
              <label className="block font-dm text-sm text-text-muted mb-1">Email</label>
              <input type="email" value={config.email || ""} onChange={(e) => setConfig({ ...config, email: e.target.value })} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block font-dm text-sm text-text-muted mb-1">Address</label>
              <textarea value={config.address || ""} onChange={(e) => setConfig({ ...config, address: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent resize-none" />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-card border border-border p-6">
          <h2 className="font-cormorant text-xl font-semibold text-primary mb-4">About Text</h2>
          <textarea value={config.about_text || ""} onChange={(e) => setConfig({ ...config, about_text: e.target.value })} rows={4} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent resize-none" placeholder="Tell visitors about Pandiyan Sites..." />
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-card border border-border p-6">
          <h2 className="font-cormorant text-xl font-semibold text-primary mb-4">Social Links</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-dm text-sm text-text-muted mb-1">Facebook URL</label>
              <input type="url" value={config.facebook_url || ""} onChange={(e) => setConfig({ ...config, facebook_url: e.target.value })} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block font-dm text-sm text-text-muted mb-1">Instagram URL</label>
              <input type="url" value={config.instagram_url || ""} onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="block font-dm text-sm text-text-muted mb-1">YouTube URL</label>
              <input type="url" value={config.youtube_url || ""} onChange={(e) => setConfig({ ...config, youtube_url: e.target.value })} className="w-full px-4 py-2.5 rounded-input border border-border font-dm text-sm focus:outline-none focus:border-accent" placeholder="https://youtube.com/..." />
            </div>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-accent text-primary py-3 rounded-button font-dm text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : (
            <>
              <Save size={16} />
              Save All Changes
            </>
          )}
        </button>
      </div>
    </div>
  )
}
