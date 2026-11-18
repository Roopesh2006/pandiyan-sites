import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getMockFeaturedProperties } from "@/lib/mock-data"
import { Hero } from "@/components/public/Hero"
import { PropertyCard } from "@/components/public/PropertyCard"
import { Story } from "@/components/public/Story"
import { TypeRail } from "@/components/public/TypeRail"
import { Proof } from "@/components/public/Proof"
import { CTA } from "@/components/public/CTA"
import { SplitLines } from "@/components/motion/SplitLines"
import { Reveal } from "@/components/motion/Reveal"
import { HomepageSchema } from "@/components/seo/Schemas"

export const revalidate = 3600

export default async function HomePage() {
  const featured = getMockFeaturedProperties().slice(0, 3)

  return (
    <>
      <HomepageSchema />

      <Hero />

      {/* Featured */}
      <section className="field-bone">
        <div className="mx-auto max-w-[1440px] px-5 py-section sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SplitLines
                as="h2"
                className="font-display text-section text-ink-900"
                lines={["Featured", "this week"]}
              />
              <Reveal delay={240} className="mt-5 max-w-md">
                <p className="text-lede text-smoke">
                  Three inspected listings, freshly published across Chennai.
                </p>
              </Reveal>
            </div>

            <Reveal delay={300}>
              <Link
                href="/properties"
                className="group flex items-center gap-2 text-[15px] text-ink-900 underline decoration-brass decoration-2 underline-offset-8 transition-colors duration-200 hover:text-brass-deep"
              >
                View all properties
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-luxe group-hover:translate-x-1.5"
                />
              </Link>
            </Reveal>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Story />
      <TypeRail />
      <Proof />
      <CTA />
    </>
  )
}
