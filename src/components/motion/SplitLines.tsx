"use client"

import { Reveal } from "./Reveal"

interface SplitLinesProps {
  /** One string per rendered line. Each line wipes up out of its own box. */
  lines: string[]
  as?: "h1" | "h2" | "h3" | "p"
  className?: string
  startDelay?: number
  stagger?: number
}

/**
 * Headline set as masked lines. The words carry the emphasis: one face,
 * one colour, no styled accent word.
 */
export function SplitLines({
  lines,
  as: Tag = "h2",
  className = "",
  startDelay = 0,
  stagger = 90,
}: SplitLinesProps) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <Reveal
          key={line + i}
          as="span"
          variant="mask"
          delay={startDelay + i * stagger}
          className="block overflow-hidden pb-[0.06em]"
        >
          <span className="block">{line}</span>
        </Reveal>
      ))}
    </Tag>
  )
}
