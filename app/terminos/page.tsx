import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PaginaTerminos() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <main className="flex-grow p-4 md:p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="theme-button-secondary flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>

        <div className="theme-content p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6 theme-title">Términos y Condiciones</h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introducción</h2>
              <p>
                Estos Términos y Condiciones rigen el uso de la aplicación CalendaRyn, accesible a través de su
                navegador web. Al utilizar nuestra aplicación, usted acepta estos términos en su totalidad. Si no está
                de acuerdo con estos términos, debe dejar de utilizar la aplicación inmediatamente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Licencia de uso</h2>
              <p>
                CalendaRyn otorga al usuario una licencia no exclusiva, no transferible y revocable para utilizar la
                aplicación para uso personal o profesional. Esta licencia no permite:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Modificar o adaptar el código de la aplicación</li>
                <li>Copiar o redistribuir la aplicación</li>
                <li>Utilizar la aplicación para fines ilegales</li>
                <li>Intentar extraer el código fuente de la aplicación</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Propiedad intelectual</h2>
              <p>
                CalendaRyn y todo su contenido, características y funcionalidad son propiedad de Rynverse y están
                protegidos por leyes internacionales de propiedad intelectual. Los logotipos, nombres comerciales,
                diseños y otros elementos visuales son marcas comerciales de Rynverse.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Limitación de responsabilidad</h2>
              <p>
                CalendaRyn se proporciona "tal cual" y "según disponibilidad" sin garantías de ningún tipo. No
                garantizamos que la aplicación sea ininterrumpida, segura o libre de errores. En ningún caso seremos
                responsables por pérdida de datos, pérdida de beneficios o cualquier otro daño que pueda surgir del uso
                de la aplicación.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Datos del usuario</h2>
              <p>
                Usted es responsable de todos los datos que introduce en la aplicación. Dado que CalendaRyn almacena
                todos los datos localmente en su dispositivo, recomendamos realizar copias de seguridad periódicas de su
                información importante.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Modificaciones</h2>
              <p>
                Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Las
                modificaciones entrarán en vigor inmediatamente después de su publicación. El uso continuado de la
                aplicación después de cualquier modificación constituye su aceptación de los nuevos términos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Ley aplicable</h2>
              <p>
                Estos términos se regirán e interpretarán de acuerdo con las leyes del país de residencia del usuario,
                sin tener en cuenta sus disposiciones sobre conflictos de leyes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contacto</h2>
              <p>
                Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos a través de:
                <br />
                Email: support@ryn-search.com
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-500 mt-8">Última actualización: 1 de mayo de 2025</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
