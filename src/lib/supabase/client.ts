import { createBrowserClient } from '@supabase/ssr'

/**
 * Cliente de Supabase para componentes del lado del cliente ('use client').
 * Usa las env vars públicas NEXT_PUBLIC_SUPABASE_*.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
