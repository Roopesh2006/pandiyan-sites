"use client"

import { motion, useScroll, useSpring } from "framer-motion"

/**
 * The brass thread: one line down the page, drawn by scroll progress.
 * It replaces the gold rule repeated under every heading.
 */
export function ScrollSpine() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.001 })

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-4 z-40 hidden w-[1.5px] bg-brass/20 xl:block"
    >
      <motion.div
        className="h-full w-full origin-top bg-brass"
        style={{ scaleY: progress }}
      />
    </div>
  )
}
