"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useMediaQuery } from "@/components/motion/useMediaQuery"
import { SplitLines } from "@/components/motion/SplitLines"
import { PLACEHOLDER_IMAGES } from "@/lib/supabase/types"

const types = [
  { label: "Apartments", count: "12", type: "apartment", image: PLACEHOLDER_IMAGES.apartment },
  { label: "Villas", count: "8", type: "villa", image: PLACEHOLDER_IMAGES.villa },
  { label: "Plots", count: "15", type: "plot", image: PLACEHOLDER_IMAGES.plot },
  { label: "Commercial", count: "6", type: "commercial", image: PLACEHOLDER_IMAGES.commercial },
  { label: "Office space", count: "4", type: "office", image: PLACEHOLDER_IMAGES.office },
  { label: "Warehouses", count: "3", type: "warehouse", image: PLACEHOLDER_IMAGES.warehouse },
]

function TypeCard({ type }: { type: (typeof types)[number] }) {
  return (
    <Link
      href={`/properties?type=${type.type}`}
      className="group block w-[78vw] shrink-0 snap-start sm:w-[52vw] lg:w-[34vw] xl:w-[27vw]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-ink-800">
        <Image
          src={type.image}
          alt={type.label}
          fill
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 52vw, 30vw"
          className="object-cover transition-transform duration-[900ms] ease-luxe group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-ink-950/35 transition-colors duration-500 group-hover:bg-ink-950/15" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
          <h3 className="font-display text-3xl leading-none text-bone">{type.label}</h3>
          <span className="tnum text-small text-bone/70">{type.count}</span>
        </div>
      </div>
    </Link>
  )
}

/**
 * Browse by type. Pinned horizontal track on desktop, native snap scroller
 * on smaller screens.
 */
export function TypeRail() {
  const ref = useRef<HTMLElement>(null)
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  const x = useTransform(scrollYProgress, [0, 1], ["2vw", "-62vw"])

  return (
    <section ref={ref} className="field-ink lg:h-[300vh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:overflow-hidden">
        <div className="mx-auto w-full max-w-[1440px] px-5 pt-section sm:px-8 lg:pt-0">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SplitLines
              as="h2"
              className="font-display text-section text-bone"
              lines={["Browse by", "property type"]}
            />
            <Link
              href="/properties"
              className="text-[15px] text-bone/70 underline decoration-brass decoration-2 underline-offset-8 transition-colors duration-200 hover:text-brass"
            >
              See everything
            </Link>
          </div>
        </div>

        <div className="mt-10 lg:mt-14">
          <motion.div
            style={isDesktop ? { x } : undefined}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 no-scrollbar sm:px-8 lg:overflow-visible lg:pb-0"
          >
            {types.map((type) => (
              <TypeCard key={type.type} type={type} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
