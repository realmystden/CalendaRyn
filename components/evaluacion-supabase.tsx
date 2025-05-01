"use client"

import { useState } from "react"
import { Info, Check, X } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function EvaluacionSupabase() {
  const [mostrarEvaluacion, setMostrarEvaluacion] = useState(false)

  return (
    <div className="mt-8 mb-4">
      <Button variant="outline" onClick={() => setMostrarEvaluacion(!mostrarEvaluacion)} className="mb-4">
        <Info className="h-4 w-4 mr-2" />
        {mostrarEvaluacion ? "Ocultar evaluación de Supabase" : "Ver evaluación de Supabase"}
      </Button>

      {mostrarEvaluacion && (
        <Card>
          <CardHeader>
            <CardTitle>Evaluación de Supabase para almacenamiento de preferencias</CardTitle>
            <CardDescription>
              Análisis de la necesidad de utilizar Supabase para almacenar las preferencias de color del usuario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Comparativa: LocalStorage vs Supabase</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border p-4 rounded-md">
                      <h3 className="font-medium mb-2">LocalStorage</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Implementación simple y rápida</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>No requiere backend ni autenticación</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Funciona sin conexión a internet</span>
                        </li>
                        <li className="flex items-start">
                          <X className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Limitado al dispositivo/navegador actual</span>
                        </li>
                        <li className="flex items-start">
                          <X className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>No permite sincronización entre dispositivos</span>
                        </li>
                      </ul>
                    </div>
                    <div className="border p-4 rounded-md">
                      <h3 className="font-medium mb-2">Supabase</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Sincronización entre dispositivos</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Persistencia de datos a largo plazo</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span>Escalable para futuras funcionalidades</span>
                        </li>
                        <li className="flex items-start">
                          <X className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Requiere implementación de autenticación</span>
                        </li>
                        <li className="flex items-start">
                          <X className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <span>Mayor complejidad y tiempo de desarrollo</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Factores de decisión</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">Escalabilidad</h3>
                      <p className="text-sm">
                        Si se planea expandir la aplicación con más funcionalidades que requieran almacenamiento de
                        datos del usuario (como tareas compartidas, colaboración, etc.), Supabase ofrece una base sólida
                        para crecer.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Experiencia de usuario</h3>
                      <p className="text-sm">
                        La sincronización entre dispositivos mejoraría la experiencia del usuario, pero requiere
                        implementar un sistema de autenticación completo.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Tiempo de desarrollo</h3>
                      <p className="text-sm">
                        La implementación con localStorage es significativamente más rápida y simple, mientras que
                        Supabase requeriría configurar autenticación, tablas de base de datos y lógica de
                        sincronización.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Requisitos actuales</h3>
                      <p className="text-sm">
                        Para la funcionalidad específica de personalización de colores, localStorage satisface los
                        requisitos básicos de persistencia entre sesiones en el mismo dispositivo.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Conclusión y recomendación</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p>
                      <strong>Recomendación actual:</strong> Para la funcionalidad específica de personalización de
                      colores del tema, localStorage es suficiente y proporciona una solución simple que cumple con los
                      requisitos básicos.
                    </p>
                    <p>
                      <strong>Consideraciones futuras:</strong> Si la aplicación evoluciona para incluir:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Múltiples usuarios con cuentas personales</li>
                      <li>Sincronización entre dispositivos</li>
                      <li>Compartir calendarios o tareas entre usuarios</li>
                      <li>Funcionalidades colaborativas</li>
                    </ul>
                    <p>
                      Entonces sería recomendable migrar a Supabase u otra solución de backend para gestionar estos
                      datos de manera centralizada.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-md mt-4">
                      <h4 className="font-medium text-blue-700 mb-2">Plan de implementación progresiva</h4>
                      <p className="text-sm text-blue-700">
                        Una estrategia óptima sería comenzar con localStorage para la personalización de colores, y
                        cuando se requieran funcionalidades más avanzadas, implementar Supabase con un sistema de
                        migración que transfiera las preferencias existentes de localStorage a la base de datos.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={() => setMostrarEvaluacion(false)}>
              Cerrar evaluación
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
