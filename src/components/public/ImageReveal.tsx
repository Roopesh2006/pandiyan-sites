"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useTransform } from "framer-motion"
import { usePlainScrollProgress } from "@/components/motion/usePlainScrollProgress"

interface ImageRevealProps {
  src: string
  alt: string
}

/** Gallery still: opens through a clip-path as it enters, then drifts slowly. */
export function ImageReveal({ src, alt }: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const scrollYProgress = usePlainScrollProgress(ref, ["start 0.9", "start 0.35"])

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]
  )
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1])

  return (
    <div ref={ref} className="relative aspect-[4/3] overflow-hidden bg-bone-200">
      <motion.div style={{ clipPath }} className="h-full w-full">
        <motion.div style={{ scale }} className="h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
