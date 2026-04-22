import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Proxy — Next.js 16 file convention (reemplaza a middleware).
 * Protege las rutas /admin/* excepto la página de login (/admin).
 * Refresca el token de Supabase Auth en cada request.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
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
          // Propagamos las cookies al request
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          // Recreamos la respuesta con los headers actualizados
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          // Seteamos las cookies en la respuesta
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refrescar el token de autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Proteger rutas admin (excepto la página de login en /admin)
  const { pathname } = request.nextUrl
  const isLoginPage = pathname === '/admin' || pathname === '/admin/'

  if (!isLoginPage && !user) {
    const loginUrl = new URL('/admin', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
