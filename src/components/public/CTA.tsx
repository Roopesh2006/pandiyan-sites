import { WhatsAppButton } from "./WhatsAppButton"
import { SplitLines } from "@/components/motion/SplitLines"
import { Reveal } from "@/components/motion/Reveal"

export function CTA() {
  return (
    <section className="bg-brass text-ink-950">
      <div className="mx-auto max-w-[1440px] px-5 py-section sm:px-8">
        <SplitLines
          as="h2"
          className="max-w-4xl font-display text-section"
          lines={["Tell us the street,", "the budget, the year."]}
        />

        <Reveal delay={280} className="mt-8 max-w-2xl">
          <p className="text-lede text-ink-950/75">
            Send what you are looking for and we will send back what matches,
            usually the same day. Or call the office directly.
          </p>
        </Reveal>

        <Reveal delay={400} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <WhatsAppButton
            propertyTitle="General Enquiry"
            propertyId="general"
            variant="strip"
            whatsappNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919XXXXXXXXXX"}
          />
          <a
            href="tel:+919XXXXXXXXXX"
            className="text-[15px] text-ink-950 underline decoration-ink-950/40 decoration-2 underline-offset-8 transition-colors duration-200 hover:decoration-ink-950"
          >
            +91 9XX XXX XXXX
          </a>
        </Reveal>
      </div>
    </section>
  )
}
