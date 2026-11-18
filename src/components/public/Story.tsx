"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useTransform } from "framer-motion"
import { PLACEHOLDER_IMAGES } from "@/lib/supabase/types"
import { SplitLines } from "@/components/motion/SplitLines"
import { Reveal } from "@/components/motion/Reveal"
import { useMediaQuery } from "@/components/motion/useMediaQuery"
import { usePlainScrollProgress } from "@/components/motion/usePlainScrollProgress"

const panels = [
  {
    title: ["Listed by", "the owner"],
    body: "No broker layer sits between you and the person who owns the property. They answer your message, not an agent.",
    image: PLACEHOLDER_IMAGES.gallery_1,
    alt: "Living room of an apartment listed direct by its owner",
  },
  {
    title: ["Inspected", "before it goes up"],
    body: "Every address is visited and photographed by us first. What you see on the page is what is standing there.",
    image: PLACEHOLDER_IMAGES.villa,
    alt: "An independent villa that was inspected before publication",
  },
  {
    title: ["Answered", "on WhatsApp"],
    body: "Enquiries land where the owner already is. Most replies arrive within thirty minutes, seven days a week.",
    image: PLACEHOLDER_IMAGES.gallery_3,
    alt: "Interior detail of a verified listing in Chennai",
  },
]

/**
 * Pinned story on desktop: one claim at a time, each with the picture that
 * proves it. On phones the same three claims stack as a readable list.
 */
export function Story() {
  const ref = useRef<HTMLElement>(null)
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const scrollYProgress = usePlainScrollProgress(ref, ["start start", "end end"])

  const image1Opacity = useTransform(scrollYProgress, [0, 0.26, 0.33], [1, 1, 0])
  const image2Opacity = useTransform(scrollYProgress, [0.3, 0.38, 0.62, 0.69], [0, 1, 1, 0])
  const image3Opacity = useTransform(scrollYProgress, [0.65, 0.73, 1], [0, 1, 1])

  const text1X = useTransform(scrollYProgress, [0, 0.1, 0.26, 0.33], ["0%", "0%", "-14%", "-14%"])
  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.26, 0.33], [1, 1, 0, 0])

  const text2Y = useTransform(scrollYProgress, [0.3, 0.4, 0.62, 0.69], ["26%", "0%", "0%", "-26%"])
  const text2Opacity = useTransform(scrollYProgress, [0.3, 0.4, 0.62, 0.69], [0, 1, 1, 0])

  const text3X = useTransform(scrollYProgress, [0.65, 0.76, 1], ["14%", "0%", "0%"])
  const text3Opacity = useTransform(scrollYProgress, [0.65, 0.76, 1], [0, 1, 1])

  if (!isDesktop) {
    return (
      <section ref={ref} className="field-verdigris">
        <div className="mx-auto max-w-[1440px] px-5 py-section sm:px-8">
          <SplitLines
            as="h2"
            className="font-display text-section text-bone"
            lines={["How a listing", "gets to you"]}
          />

          <div className="mt-14 space-y-16">
            {panels.map((panel) => (
              <Reveal key={panel.title.join(" ")}>
                <div className="relative aspect-[4/3] overflow-hidden bg-verdigris-deep">
                  <Image
                    src={panel.image}
                    alt={panel.alt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-6 font-display text-3xl leading-tight text-bone">
                  {panel.title.join(" ")}
                </h3>
                <p className="mt-4 max-w-[34rem] text-lede text-bone/75">{panel.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="field-verdigris lg:h-[320vh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-8 px-5 py-section sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:py-0">
          <div className="relative lg:h-[420px]">
            {panels.map((panel, i) => (
              <motion.div
                key={panel.title.join(" ")}
                style={
                  i === 0
                    ? { x: text1X, opacity: text1Opacity }
                    : i === 1
                      ? { y: text2Y, opacity: text2Opacity }
                      : { x: text3X, opacity: text3Opacity }
                }
                className={i === 0 ? "lg:absolute lg:inset-0" : "mt-14 lg:absolute lg:inset-0 lg:mt-0"}
              >
                <SplitLines
                  as="h2"
                  className="font-display text-section text-bone"
                  lines={panel.title}
                  startDelay={0}
                  stagger={70}
                />
                <p className="mt-6 max-w-[30rem] text-lede text-bone/75">{panel.body}</p>
              </motion.div>
            ))}
          </div>

          <div className="relative aspect-[4/3] overflow-hidden bg-verdigris-deep lg:aspect-auto lg:h-[70vh]">
            {panels.map((panel, i) => {
              const opacity =
                i === 0 ? image1Opacity : i === 1 ? image2Opacity : image3Opacity
              return (
                <motion.div key={panel.image} style={{ opacity }} className="absolute inset-0">
                  <Image
                    src={panel.image}
                    alt={panel.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
