"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion"

interface MagneticProps {
  children: ReactNode
  /** Maximum travel in px. Small: this is feedback, not a toy. */
  strength?: number
  className?: string
}

/**
 * Pointer-follow for the primary action. Pointer devices only; touch and
 * reduced motion get the plain button.
 */
export function Magnetic({ children, strength = 6, className = "" }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 30, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 300, damping: 30, mass: 0.4 })

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    if (!window.matchMedia("(pointer: fine)").matches) return

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      const half = Math.max(rect.width, rect.height) / 2
      x.set((dx / half) * strength)
      y.set((dy / half) * strength)
    }

    const onLeave = () => {
      x.set(0)
      y.set(0)
    }

    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => {
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
    }
  }, [reduced, strength, x, y])

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} className={className}>
      {children}
    </motion.div>
  )
}
