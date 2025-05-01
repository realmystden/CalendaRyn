import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { CalendarioCompleto } from "@/components/calendario-completo"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <main className="flex-grow p-4 md:p-8">
        <CalendarioCompleto />
      </main>
      <Footer />
    </div>
  )
}
