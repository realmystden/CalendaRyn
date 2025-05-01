import Image from "next/image"
import { SelectorTema } from "@/components/selector-tema"
import { PersonalizadorTema } from "@/components/personalizador-tema"

export function Hero() {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center border-b theme-header">
      <div className="flex items-center gap-3">
        <Image src="/logo.png" alt="CalendaRyn Logo" width={40} height={40} className="theme-logo" />
        <h1 className="text-3xl font-bold theme-title">CalendaRyn</h1>
      </div>
      <div className="flex items-center">
        <SelectorTema />
        <PersonalizadorTema />
      </div>
    </header>
  )
}
