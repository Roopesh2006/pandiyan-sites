import { Reveal } from "@/components/motion/Reveal"
import { SplitLines } from "@/components/motion/SplitLines"

const reasons = [
  {
    title: "No brokerage",
    body: "You deal with the person holding the title. Nothing is added to the price on our account.",
  },
  {
    title: "Inspected in person",
    body: "We visit every address before it is published, and photograph what we actually find there.",
  },
  {
    title: "Direct WhatsApp",
    body: "One tap reaches the owner. Most enquiries are answered inside thirty minutes, every day.",
  },
  {
    title: "Chennai, street by street",
    body: "Anna Nagar to OMR, Tambaram to T. Nagar. We list the neighbourhoods we know by walk.",
  },
]

export function Proof() {
  return (
    <section className="field-bone">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 py-section sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SplitLines
            as="h2"
            className="font-display text-section text-ink-900"
            lines={["Why owners", "list here"]}
          />
          <p className="mt-6 max-w-sm text-lede text-smoke">
            Four commitments, kept on every listing from the first enquiry to
            the signature.
          </p>
        </div>

        <div className="space-y-12">
          {reasons.map((reason, i) => (
            <Reveal key={reason.title} delay={i * 70}>
              <div>
                <h3 className="font-display text-[2rem] leading-tight tracking-tight text-ink-900">
                  {reason.title}
                </h3>
                <p className="mt-3 max-w-[36rem] text-body text-smoke">{reason.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
