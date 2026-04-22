'use client'

import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import {
  LogOut,
  Package,
  LayoutDashboard,
  ExternalLink,
  Plus,
  Menu,
  X,
} from 'lucide-react'

/* =============================================
 * Navegación del admin
 * ============================================= */
const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos/nuevo', label: 'Nuevo producto', icon: Plus },
]

/* =============================================
 * Layout del panel admin (navbar + contenido)
 * ============================================= */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [loggingOut, setLoggingOut] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      {/* Barra de navegación superior */}
      <nav className="bg-[#1B3A28] px-4 md:px-6 py-3 flex items-center justify-between shadow-lg relative z-30">
        <div className="flex items-center gap-6">
          <h1 className="text-white font-bold text-lg">
            <Package className="w-5 h-5 inline-block mr-2 opacity-70" />
            Admin
          </h1>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + '/')
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-sm px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </a>
              )
            })}
            <a
              href="/"
              target="_blank"
              className="text-white/60 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Ver vitrina
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-white/60 hover:text-white text-sm flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">
              {loggingOut ? 'Saliendo...' : 'Cerrar sesión'}
            </span>
          </button>

          {/* Toggle menú mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Menú mobile desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1B3A28]/95 backdrop-blur-md border-b border-white/10 animate-fade-in">
          <div className="px-4 py-2 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-sm px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </a>
              )
            })}
            <a
              href="/"
              target="_blank"
              className="text-white/60 hover:text-white text-sm px-3 py-2.5 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Ver vitrina
            </a>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">{children}</main>
    </div>
  )
}
