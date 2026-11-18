import { useScroll, useMotionValue, useMotionValueEvent, type MotionValue } from "framer-motion"
import type { RefObject } from "react"

type ScrollOptions = NonNullable<Parameters<typeof useScroll>[0]>
type ScrollOffset = ScrollOptions["offset"]

/**
 * Scroll progress as a plain MotionValue.
 *
 * `useScroll().scrollYProgress` carries an `accelerate` config: Motion compiles
 * `useTransform` chains over it into a scroll-linked WAAPI animation, but only
 * for `opacity`, `clipPath`, `filter` and `transform`. Those animations track a
 * different progress than the JS one, so on the story section the panels
 * crossfaded at the wrong scroll position and overlapped. Binding one plain
 * value gives every property a single progress source.
 */
export function usePlainScrollProgress(
  ref: RefObject<HTMLElement | null>,
  offset?: ScrollOffset
): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target: ref, offset })
  const progress = useMotionValue(scrollYProgress.get())

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    progress.set(latest)
  })

  return progress
}
