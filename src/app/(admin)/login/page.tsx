"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn, Database } from "lucide-react"

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  return url.startsWith("http://") || url.startsWith("https://")
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const configured = isSupabaseConfigured()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!configured) {
      setError("Supabase is not configured yet. Set up your Supabase project first.")
      setLoading(false)
      return
    }

    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-primary relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-accent rounded-card flex items-center justify-center">
              <span className="text-primary font-cormorant text-3xl font-bold">P</span>
            </div>
            <span className="font-cormorant text-2xl font-semibold text-white">Pandiyan Sites</span>
          </div>
          <h2 className="font-cormorant text-4xl font-semibold text-white mb-4">Welcome back</h2>
          <p className="font-dm text-white/50">Manage your properties with ease</p>
        </div>

        {/* Decorative gold lines */}
        <div className="absolute top-0 right-0 w-32 h-full">
          <div className="absolute top-1/4 right-8 w-[1px] h-32 bg-accent/20" />
          <div className="absolute top-1/3 right-16 w-[1px] h-48 bg-accent/10" />
          <div className="absolute top-1/2 right-4 w-[1px] h-24 bg-accent/15" />
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center px-6 bg-surface">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-accent rounded-card flex items-center justify-center">
              <span className="text-primary font-cormorant text-xl font-bold">P</span>
            </div>
            <span className="font-cormorant text-xl font-semibold text-primary">Pandiyan Sites</span>
          </div>

          <div className="bg-white rounded-card p-8" data-ui>
            <h1 className="font-cormorant text-2xl font-semibold text-primary mb-6">Admin Login</h1>

            {!configured ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-input">
                  <Database size={20} className="text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-dm text-sm font-medium text-amber-800">Supabase not configured</p>
                    <p className="font-dm text-xs text-amber-600 mt-1">
                      Create a Supabase project and add your credentials to <code className="bg-amber-100 px-1 rounded">.env.local</code> to enable admin login.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full bg-accent text-primary py-3 rounded-button font-dm text-sm font-semibold hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  Continue to Dashboard
                </button>
                <p className="font-dm text-xs text-text-muted text-center">
                  You can preview the admin dashboard with mock data
                </p>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block font-dm text-sm text-text-muted mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full px-4 py-3 rounded-input border font-dm text-sm focus:outline-none focus:border-accent ${error ? "border-red-500" : "border-border"}`}
                    placeholder="admin@pandiyansites.com"
                  />
                </div>

                <div>
                  <label className="block font-dm text-sm text-text-muted mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={`w-full px-4 py-3 pr-10 rounded-input border font-dm text-sm focus:outline-none focus:border-accent ${error ? "border-red-500" : "border-border"}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="font-dm text-sm text-red-500">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-primary py-3 rounded-button font-dm text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn size={18} />
                      Login
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
