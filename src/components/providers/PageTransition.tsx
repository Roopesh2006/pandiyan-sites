"use client"

import { useEffect, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

/**
 * Route change wipes a bone curtain up over the old page and down off the new
 * one. The curtain is mounted only after hydration, so a page whose script
 * never runs is never covered.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <>{children}</>

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={pathname} className="relative">
        {children}

        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[60] bg-bone"
          initial={{ scaleY: 1, originY: 0 }}
          animate={{ scaleY: 0, originY: 1 }}
          exit={{ scaleY: 1, originY: 0 }}
          transition={{ duration: 0.52, ease: [0.65, 0, 0.35, 1] }}
        />
      </motion.div>
    </AnimatePresence>
  )
}
