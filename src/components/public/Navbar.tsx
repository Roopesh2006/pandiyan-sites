"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion"
import { Menu, X, MessageCircle } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/properties?type=plot", label: "Plots" },
  { href: "/properties?listing=rent", label: "Rent" },
]

const whatsappHref = `https://wa.me/${
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919XXXXXXXXXX"
}?text=${encodeURIComponent(
  "Hi, I found your website Pandiyan Sites and I'm interested in properties. Can you help me?"
)}`

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    setScrolled(latest > 60)
    if (!mobileOpen) setHidden(latest > previous && latest > 200)
  })

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !mobileOpen ? "-100%" : "0%" }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          data-ui
          className={`border-b transition-colors duration-300 ${
            scrolled
              ? "glass border-b-bone/10 text-bone"
              : "border-transparent bg-transparent text-bone"
          }`}
        >
          <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8">
            <Link href="/" className="font-display text-2xl leading-none tracking-tight">
              Pandiyan Sites
            </Link>

            <nav className="hidden items-center gap-9 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-[15px] transition-colors duration-200 hover:text-brass"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="press flex items-center gap-2 bg-bone px-5 py-2.5 text-[15px] text-ink-950 transition-colors duration-200 hover:bg-brass"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </nav>

            <button
              className="md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink-950 px-7 text-bone md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-4xl leading-none"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-12 flex w-fit items-center gap-2 bg-brass px-6 py-3.5 text-ink-950"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
