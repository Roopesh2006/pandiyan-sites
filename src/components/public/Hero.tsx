"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { PLACEHOLDER_IMAGES } from "@/lib/supabase/types"
import { SplitLines } from "@/components/motion/SplitLines"
import { Reveal } from "@/components/motion/Reveal"
import { CountUp } from "@/components/motion/CountUp"
import { Magnetic } from "@/components/motion/Magnetic"

const stats = [
  { value: 120, suffix: "+", label: "Properties listed" },
  { value: 50, suffix: "+", label: "Owners paid direct" },
  { value: 5, suffix: " yrs", label: "Across Chennai" },
]

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden bg-ink-950 text-bone"
    >
      {/* Picture field: flat scrim, no gradient */}
      <div className="absolute inset-0 lg:left-[44%]">
        <motion.div
          className="h-full w-full"
          style={{ y: imageY, scale: imageScale }}
        >
          <Image
            src={PLACEHOLDER_IMAGES.hero_banner}
            alt="A residence in Tamil Nadu at dusk"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        {/* Contrast scrim: opacity steps track viewport width, not a
            single mobile/desktop toggle. lg+ moves the picture to the
            right half, so the scrim drops there. */}
        <div className="absolute inset-0 bg-ink-950/[0.74] sm:bg-ink-950/[0.68] md:bg-ink-950/[0.6] lg:bg-ink-950/[0.24] xl:bg-ink-950/[0.18]" />
      </div>

      {/* Headline */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-5 pb-14 pt-28 sm:px-8 lg:justify-center lg:pb-14">
        <div className="max-w-[680px]">
          <SplitLines
            as="h1"
            className="font-display text-display text-bone"
            lines={["Verified property", "across Tamil Nadu"]}
            startDelay={160}
            stagger={110}
          />

          <Reveal delay={460} className="mt-6 max-w-[34rem]">
            <p className="text-lede text-bone/75">
              Apartments, villas, plots and commercial space in Chennai, listed
              direct from the owner and answered on WhatsApp.
            </p>
          </Reveal>

          <Reveal delay={580} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Magnetic>
              <Link
                href="/properties"
                className="press inline-block bg-brass px-8 py-4 text-[15px] text-ink-950 transition-colors duration-200 hover:bg-brass-bright"
              >
                Browse all properties
              </Link>
            </Magnetic>

            <a
              href={`https://wa.me/${
                process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919XXXXXXXXXX"
              }?text=${encodeURIComponent(
                "Hi, I found your website Pandiyan Sites and I'm interested in properties. Can you help me?"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] text-bone/80 underline decoration-brass decoration-2 underline-offset-8 transition-colors duration-200 hover:text-brass"
            >
              Ask us on WhatsApp
            </a>
          </Reveal>

          <Reveal delay={700} className="mt-12">
            <div className="glass animate-float-slow inline-flex flex-wrap gap-x-12 gap-y-6 px-7 py-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-4xl leading-none text-brass">
                    <CountUp target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-small text-bone/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
