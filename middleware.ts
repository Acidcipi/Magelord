/**
 * MageLord - Middleware de Autenticación
 * 
 * Protege rutas automáticamente y gestiona:
 * - Verificación de sesión en cada request
 * - Redirección de usuarios no autenticados
 * - Rutas públicas vs protegidas
 * - Refresh automático de tokens
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Verificar sesión
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthPage = request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login'
  const isPublicPage = request.nextUrl.pathname.startsWith('/public')
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')

  // Si no hay sesión y está intentando acceder a páginas protegidas
  if (!session && !isAuthPage && !isPublicPage && !isApiRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Si hay sesión y está en la página de login, redirigir al juego
  if (session && isAuthPage && request.nextUrl.pathname !== '/') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/portada'
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

// Configurar qué rutas deben pasar por el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}