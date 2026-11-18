"use client"

import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
  propertyTitle: string
  propertyId: string
  variant?: "card" | "detail" | "floating" | "strip"
  whatsappNumber?: string
}

export function WhatsAppButton({
  propertyTitle,
  propertyId,
  variant = "card",
  whatsappNumber = "919XXXXXXXXXX",
}: WhatsAppButtonProps) {
  const message = encodeURIComponent(
    `Hi! I saw your listing on *Pandiyan Sites* and I'm interested.\n\n` +
      `*Property:* ${propertyTitle}\n` +
      `*Listing ID:* #${propertyId.slice(0, 8).toUpperCase()}\n\n` +
      `Could you please share more details?`
  )
  const url = `https://wa.me/${whatsappNumber}?text=${message}`

  if (variant === "floating") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact this property on WhatsApp"
        className="press fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center bg-verdigris text-bone transition-colors duration-200 hover:bg-verdigris-deep"
      >
        <MessageCircle size={24} />
      </a>
    )
  }

  if (variant === "strip") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="press inline-flex items-center gap-3 bg-ink-950 px-8 py-4 text-base text-bone transition-colors duration-200 hover:bg-verdigris"
      >
        <MessageCircle size={20} />
        Chat on WhatsApp, we reply in minutes
      </a>
    )
  }

  if (variant === "detail") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="press flex w-full items-center justify-center gap-3 bg-verdigris px-6 py-4 text-base text-bone transition-colors duration-200 hover:bg-verdigris-deep"
      >
        <MessageCircle size={20} />
        Enquire on WhatsApp
      </a>
    )
  }

  // card: a text action, so the grid stays quiet
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-[15px] text-verdigris underline decoration-verdigris/40 underline-offset-4 transition-colors duration-200 hover:text-ink-900 hover:decoration-verdigris"
    >
      <MessageCircle size={15} />
      Enquire
    </a>
  )
}
