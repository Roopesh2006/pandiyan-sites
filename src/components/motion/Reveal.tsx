"use client"

import {
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
  type CSSProperties,
} from "react"

interface RevealProps {
  children: ReactNode
  as?: ElementType
  delay?: number
  className?: string
  /** "up" moves 24px and fades, "mask" wipes the line up out of its own box */
  variant?: "up" | "mask" | "none"
}

/**
 * Entrance for parts of a section. Content is visible by default; the hidden
 * state is applied only once `html.js-motion` exists, so a failed script
 * leaves the page fully readable.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  variant = "up",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in")
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-in")
            observer.disconnect()
          }
        })
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const style = { "--d": `${delay}ms` } as CSSProperties

  type CompProps = {
    style?: CSSProperties
    className?: string
    children?: ReactNode
    "data-reveal"?: "up" | "mask"
    ref?: React.Ref<HTMLElement>
  }
  const Comp = Tag as unknown as React.ElementType<CompProps>

  if (variant === "none") {
    return (
      <Comp ref={ref} className={className} style={style}>
        {children}
      </Comp>
    )
  }

  return (
    <Comp ref={ref} data-reveal={variant} className={className} style={style}>
      {children}
    </Comp>
  )
}
