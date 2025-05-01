export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full py-4 px-6 border-t theme-footer">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm theme-text">
          <p className="font-medium">© {currentYear} Rynverse</p>
          <p className="text-xs mt-1 opacity-80">CalendaRyn™ es una marca registrada de Rynverse.</p>
        </div>
        <div className="flex gap-6 mt-3 md:mt-0">
          <a href="/privacidad" className="text-sm hover:underline theme-link">
            Política de Privacidad
          </a>
          <a href="/terminos" className="text-sm hover:underline theme-link">
            Términos y Condiciones
          </a>
        </div>
      </div>
    </footer>
  )
}
