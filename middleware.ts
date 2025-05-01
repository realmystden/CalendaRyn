import { createServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-url", request.url)

  // Create a response object to store cookies
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  try {
    // Create a Supabase client
    const supabase = createServerClient()

    // Get session using the service role key
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Error al obtener sesión en middleware:", error)
      // En caso de error al obtener la sesión, permitimos el acceso a rutas públicas
      // pero bloqueamos el acceso a rutas protegidas
      const isProtectedRoute =
        request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/settings")

      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/auth/login", request.url))
      }

      return response
    }

    // Check auth condition
    const isAuthRoute = request.nextUrl.pathname.startsWith("/auth")
    const isProtectedRoute =
      request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/settings")

    // If accessing protected routes without session, redirect to login
    if (isProtectedRoute && !session) {
      console.log("Redirigiendo a login: ruta protegida sin sesión")
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    // If accessing auth routes with session, redirect to dashboard
    if (isAuthRoute && session) {
      console.log("Redirigiendo a dashboard: ruta de auth con sesión")
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // If accessing home page with session, redirect to dashboard
    if (request.nextUrl.pathname === "/" && session) {
      console.log("Redirigiendo a dashboard: página principal con sesión")
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return response
  } catch (e) {
    console.error("Error en middleware:", e)

    // Si hay un error en el middleware, permitimos el acceso a rutas públicas
    // pero bloqueamos el acceso a rutas protegidas
    const isProtectedRoute =
      request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/settings")

    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    return response
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
