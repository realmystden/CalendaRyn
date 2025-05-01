import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PaginaPrivacidad() {
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
          <h1 className="text-3xl font-bold mb-6 theme-title">Política de Privacidad</h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introducción</h2>
              <p>
                Bienvenido a la Política de Privacidad de CalendaRyn. Esta política describe cómo recopilamos,
                utilizamos y protegemos su información cuando utiliza nuestra aplicación de calendario.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Información que recopilamos</h2>
              <p>
                CalendaRyn es una aplicación que funciona completamente en su navegador y almacena todos los datos
                localmente en su dispositivo utilizando localStorage. No recopilamos ni transmitimos ninguna información
                personal a servidores externos.
              </p>
              <p className="mt-2">La información que se guarda localmente incluye:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Tareas y eventos que usted crea</li>
                <li>Etiquetas personalizadas</li>
                <li>Configuraciones de recordatorios</li>
                <li>Preferencias de tema y visualización</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Uso de la información</h2>
              <p>
                La información almacenada localmente se utiliza exclusivamente para proporcionar la funcionalidad de la
                aplicación, como mostrar sus tareas en el calendario, enviar recordatorios locales y mantener sus
                preferencias de visualización.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Notificaciones</h2>
              <p>
                CalendaRyn puede solicitar permiso para enviar notificaciones a través de su navegador. Estas
                notificaciones se utilizan exclusivamente para los recordatorios de tareas que usted configura y se
                procesan localmente en su dispositivo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Almacenamiento de datos</h2>
              <p>
                Todos los datos se almacenan localmente en su dispositivo utilizando la API localStorage del navegador.
                Estos datos permanecerán en su dispositivo hasta que:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Usted los elimine manualmente a través de la aplicación</li>
                <li>Borre los datos de navegación de su navegador</li>
                <li>
                  Utilice la navegación privada/incógnito (en cuyo caso los datos se eliminarán al cerrar el navegador)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Seguridad</h2>
              <p>
                Dado que todos los datos se almacenan localmente en su dispositivo, la seguridad de estos datos depende
                de la seguridad de su dispositivo y navegador. Recomendamos mantener su sistema operativo y navegador
                actualizados para garantizar la mejor protección.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Cambios en esta política</h2>
              <p>
                Podemos actualizar nuestra Política de Privacidad ocasionalmente. Le notificaremos cualquier cambio
                publicando la nueva Política de Privacidad en esta página. Se le aconseja revisar esta Política de
                Privacidad periódicamente para cualquier cambio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contacto</h2>
              <p>
                Si tiene alguna pregunta sobre esta Política de Privacidad, puede contactarnos a través de:
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
