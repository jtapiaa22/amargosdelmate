'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#1B3A28] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#1B3A28] flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-[8px] font-bold tracking-widest uppercase leading-tight text-center">Amargos<br/>del<br/>Mate</span>
          </div>
          <h1 className="text-[#1B3A28] text-xl font-bold">Panel Admin</h1>
          <p className="text-[#8A7E75] text-sm mt-1">Ingresá para gestionar tu tienda</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-[#5A4E42] uppercase tracking-wide block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@ejemplo.com"
              className="w-full border border-[#E2DBD3] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B3A28] text-[#1B3A28]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#5A4E42] uppercase tracking-wide block mb-1.5">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-[#E2DBD3] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B3A28] text-[#1B3A28]"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B3A28] text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-[#2D6A4A] transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
