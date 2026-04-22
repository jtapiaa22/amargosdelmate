'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  // Si ya está logueado, redirigir al dashboard
  useEffect(() => {
    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        router.push('/admin/dashboard')
      } else {
        setChecking(false)
      }
    }
    check()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
  }

  // Spinner mientras verifica sesión
  if (checking) {
    return (
      <div className="min-h-screen bg-[#1B3A28] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B3A28] via-[#1B3A28] to-[#2D6A4A] flex items-center justify-center px-4">
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl shadow-black/20 animate-fade-in-up"
        style={{ animationFillMode: 'forwards' }}
      >
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-[#E2DBD3] shadow-lg">
            <Image
              src="/logo.png"
              alt="Amargos del Mate"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-[#1B3A28] text-xl font-bold">Panel Admin</h1>
          <p className="text-[#8A7E75] text-sm mt-1">
            Ingresá para gestionar tu tienda
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="admin-email"
              className="text-xs font-semibold text-[#5A4E42] uppercase tracking-wide block mb-1.5"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@ejemplo.com"
              className="w-full border border-[#E2DBD3] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B3A28] focus:ring-1 focus:ring-[#1B3A28]/20 text-[#1B3A28] transition-all"
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="text-xs font-semibold text-[#5A4E42] uppercase tracking-wide block mb-1.5"
            >
              Contraseña
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-[#E2DBD3] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B3A28] focus:ring-1 focus:ring-[#1B3A28]/20 text-[#1B3A28] transition-all"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B3A28] text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-[#2D6A4A] transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-[#8A7E75] text-xs hover:text-[#1B3A28] transition-colors"
          >
            ← Volver a la vitrina
          </a>
        </div>
      </div>
    </div>
  )
}
