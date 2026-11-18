import { Navbar } from "@/components/public/Navbar"
import { Footer } from "@/components/public/Footer"
import { PageTransition } from "@/components/providers/PageTransition"
import { ScrollSpine } from "@/components/motion/ScrollSpine"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ScrollSpine />
      <Navbar />
      <PageTransition>
        <main className="min-h-screen">{children}</main>
      </PageTransition>
      <Footer />
    </>
  )
}
