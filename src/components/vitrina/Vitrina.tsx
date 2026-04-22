'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Categoria, Producto } from '@/types'
import { buildInstagramLink } from '@/lib/whatsapp'
import ProductCard from './ProductCard'
import { MessageCircle } from 'lucide-react'

/* =============================================
 * Icono SVG de Instagram (inline para evitar dependencias)
 * ============================================= */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

/* =============================================
 * Props
 * ============================================= */
type Props = {
  categorias: Categoria[]
  productos: Producto[]
}

/* =============================================
 * Componente Vitrina (página principal pública)
 * ============================================= */
export default function Vitrina({ categorias, productos }: Props) {
  const [catActiva, setCatActiva] = useState<string>('todos')

  // Agregamos la opción "Todos" al inicio
  const todasLasCats: Categoria[] = [
    { id: 0, nombre: 'Todos', slug: 'todos', orden: 0, activa: true },
    ...categorias,
  ]

  // Filtrar productos según la categoría seleccionada
  const filtrados =
    catActiva === 'todos'
      ? productos
      : productos.filter((p) => {
          const cat = categorias.find((c) => c.slug === catActiva)
          return cat ? p.categoria_id === cat.id : true
        })

  // Promos para el banner destacado
  const promos = productos.filter((p) => p.es_promo)
  const mostrarBanner =
    (catActiva === 'todos' || catActiva === 'promos') && promos.length > 0

  // Label de sección actual
  const labelSeccion =
    catActiva === 'todos'
      ? 'Todos los productos'
      : categorias.find((c) => c.slug === catActiva)?.nombre ?? ''

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

  return (
    <div className="min-h-screen flex flex-col">
      {/* ═══════ Header ═══════ */}
      <header className="bg-gradient-to-br from-[#1B3A28] via-[#1B3A28] to-[#2D6A4A] px-4 py-8 md:py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-8 md:justify-between">
          {/* Logo + Marca */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5">
            <div className="w-24 h-24 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg shadow-black/20 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Amargos del Mate"
                width={96}
                height={96}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-white text-xl md:text-lg font-bold tracking-wide">
                Amargos del Mate
              </h1>
              <p className="text-white/60 text-xs tracking-wide mt-0.5">
                Todo para tu momento de mate 🧉
              </p>
            </div>
          </div>

          {/* Link a Instagram */}
          <div className="flex items-center gap-3">
            <a
              href={buildInstagramLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-white/85 text-xs hover:bg-white/20 transition-all duration-300"
            >
              <InstagramIcon className="w-4 h-4" />
              @amargosdelmate
            </a>
          </div>
        </div>
      </header>

      {/* ═══════ Filtro de categorías — sticky ═══════ */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#E2DBD3] sticky top-0 z-20 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto flex gap-2 px-4 py-3 w-max md:w-auto md:justify-center md:flex-wrap">
          {todasLasCats.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setCatActiva(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all duration-300 ${
                catActiva === cat.slug
                  ? 'bg-[#1B3A28] text-white border-[#1B3A28] shadow-md shadow-[#1B3A28]/20'
                  : 'bg-white text-[#5A4E42] border-[#CCC8C0] hover:border-[#1B3A28]/50 hover:shadow-sm'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════ Contenido principal ═══════ */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 md:px-6 pb-8">
        {/* Banner de promo destacada */}
        {mostrarBanner && (
          <div className="mt-4 bg-gradient-to-r from-[#1B3A28] to-[#2D6A4A] rounded-xl px-5 py-4 flex items-center justify-between gap-4 shadow-lg shadow-[#1B3A28]/15 animate-fade-in">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-[#C8972C] font-bold mb-0.5">
                🔥 Promo destacada
              </p>
              <p className="text-white text-sm md:text-base font-semibold truncate">
                {promos[0].nombre}
              </p>
              {promos[0].descripcion && (
                <p className="text-white/55 text-xs md:text-sm mt-0.5 truncate">
                  {promos[0].descripcion}
                </p>
              )}
            </div>
            <span className="bg-[#C8972C] text-white text-xs md:text-sm font-bold px-4 py-2 rounded-lg shrink-0 shadow-md">
              ${promos[0].precio.toLocaleString('es-AR')}
            </span>
          </div>
        )}

        {/* Label de sección */}
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#7A6E65] px-0.5 mt-5 mb-3">
          {labelSeccion}
        </p>

        {/* Sin resultados */}
        {filtrados.length === 0 && (
          <div className="text-center py-16 text-[#8A7E75] text-sm animate-fade-in">
            No hay productos en esta categoría todavía.
          </div>
        )}

        {/* Grid de productos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filtrados.map((producto, i) => (
            <ProductCard key={producto.id} producto={producto} index={i} />
          ))}
        </div>
      </main>

      {/* ═══════ Botón flotante de WhatsApp ═══════ */}
      {waNumber && (
        <a
          href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Hola! Quiero consultar por sus productos 🧉')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-xl shadow-[#25D366]/30 hover:scale-110 hover:shadow-2xl transition-all duration-300 animate-float"
          aria-label="Consultar por WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      )}

      {/* ═══════ Footer ═══════ */}
      <footer className="bg-gradient-to-br from-[#1B3A28] to-[#142E1F] py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                <Image
                  src="/logo.png"
                  alt="Amargos del Mate"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">
                  Amargos del Mate
                </p>
                <p className="text-white/40 text-[11px]">
                  Catamarca, Argentina
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={buildInstagramLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors text-xs"
              >
                Instagram
              </a>
              <span className="text-white/20">·</span>
              {waNumber && (
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white transition-colors text-xs"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-white/30 text-[11px]">
              © 2025 Amargos del Mate · Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
