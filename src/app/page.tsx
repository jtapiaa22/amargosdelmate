'use client'

import { useState } from 'react'
import type { Categoria, Producto } from '@/types'
import { buildWhatsappLink, buildInstagramLink } from '@/lib/whatsapp'

// Datos de ejemplo - reemplazar con fetch a Supabase
const CATEGORIAS: Categoria[] = [
  { id: 0, nombre: 'Todos',       slug: 'todos',      orden: 0, activa: true },
  { id: 1, nombre: 'Mates',       slug: 'mates',      orden: 1, activa: true },
  { id: 2, nombre: 'Yerbas',      slug: 'yerbas',     orden: 2, activa: true },
  { id: 3, nombre: 'Bombillas',   slug: 'bombillas',  orden: 3, activa: true },
  { id: 4, nombre: 'Accesorios',  slug: 'accesorios', orden: 4, activa: true },
  { id: 5, nombre: 'Promos ★',   slug: 'promos',     orden: 5, activa: true },
]

const PRODUCTOS: Producto[] = [
  { id: 1, nombre: 'Mate Imperial Calabaza', descripcion: 'Clásico mate de calabaza curado.', precio: 4500, categoria_id: 1, imagen_url: null, activo: true, es_promo: false, badge: null,      orden: 1, created_at: '' },
  { id: 2, nombre: 'Yerba CBSé Hierbas 500g', descripcion: 'Suave con hierbas naturales.', precio: 1800, categoria_id: 2, imagen_url: null, activo: true, es_promo: false, badge: null,      orden: 1, created_at: '' },
  { id: 3, nombre: 'Bombilla Acero Inox',   descripcion: 'Recta de acero inoxidable.',      precio: 1200, categoria_id: 3, imagen_url: null, activo: true, es_promo: false, badge: 'Popular', orden: 1, created_at: '' },
  { id: 4, nombre: 'Termo Stanley 1L',      descripcion: 'Mantiene el calor 12hs.',         precio: 8900, categoria_id: 4, imagen_url: null, activo: true, es_promo: false, badge: null,      orden: 1, created_at: '' },
  { id: 5, nombre: 'Kit Iniciador Mate',    descripcion: 'Mate + bombilla + yerba 500g.',   precio: 6500, categoria_id: 5, imagen_url: null, activo: true, es_promo: true,  badge: 'Promo',   orden: 1, created_at: '' },
  { id: 6, nombre: 'Mate Madera Artesanal', descripcion: 'Algarrobo torneado a mano.',      precio: 5200, categoria_id: 1, imagen_url: null, activo: true, es_promo: false, badge: 'Nuevo',   orden: 2, created_at: '' },
  { id: 7, nombre: 'Yerba Taragüi 500g',   descripcion: 'La clásica de siempre.',           precio: 1650, categoria_id: 2, imagen_url: null, activo: true, es_promo: false, badge: null,      orden: 2, created_at: '' },
  { id: 8, nombre: 'Yerbera Cerámica',      descripcion: 'Artesanal con tapa, 500g.',       precio: 2100, categoria_id: 4, imagen_url: null, activo: true, es_promo: false, badge: null,      orden: 2, created_at: '' },
  { id: 9, nombre: 'Kit Yerba + Bombilla',  descripcion: 'Combo ideal para regalar.',       precio: 2500, categoria_id: 5, imagen_url: null, activo: true, es_promo: true,  badge: 'Promo',   orden: 2, created_at: '' },
]

const BADGE_STYLES: Record<string, string> = {
  Promo:   'bg-[#C8972C] text-white',
  Nuevo:   'bg-[#2D6A4A] text-white',
  Popular: 'bg-[#1B3A28] text-white',
}

export default function Vitrina() {
  const [catActiva, setCatActiva] = useState('todos')

  const filtrados = catActiva === 'todos'
    ? PRODUCTOS
    : PRODUCTOS.filter(p => {
        const cat = CATEGORIAS.find(c => c.slug === catActiva)
        return cat ? p.categoria_id === cat.id : true
      })

  const promos = PRODUCTOS.filter(p => p.es_promo)
  const mostrarBanner = catActiva === 'todos' || catActiva === 'promos'

  return (
    <div className="max-w-[430px] mx-auto min-h-screen flex flex-col">

      {/* Header */}
      <header className="bg-[#1B3A28] px-4 py-6 flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-full border-2 border-white/20 flex flex-col items-center justify-center">
          <span className="text-white text-[8px] font-bold tracking-widest uppercase leading-tight">Amargos</span>
          <span className="text-white/50 text-[7px] tracking-wider uppercase leading-tight">del</span>
          <span className="text-white text-xs font-bold tracking-widest uppercase leading-tight">Mate</span>
        </div>
        <p className="text-white/60 text-xs">Todo para tu momento de mate</p>
        <a href={buildInstagramLink()} target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-white/85 text-xs hover:bg-white/20 transition-colors">
          @amargosdelmate
        </a>
      </header>

      {/* Filtro de categorías */}
      <div className="bg-white border-b border-[#E2DBD3] sticky top-0 z-10 overflow-x-auto">
        <div className="flex gap-2 px-3 py-3 w-max">
          {CATEGORIAS.map(cat => (
            <button key={cat.slug} onClick={() => setCatActiva(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${
                catActiva === cat.slug
                  ? 'bg-[#1B3A28] text-white border-[#1B3A28]'
                  : 'bg-white text-[#5A4E42] border-[#CCC8C0] hover:border-[#1B3A28]/40'
              }`}>
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 px-3 pb-6">

        {/* Banner promo */}
        {mostrarBanner && promos.length > 0 && (
          <div className="mt-3 bg-[#1B3A28] rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-semibold">{promos[0].nombre}</p>
              <p className="text-white/55 text-xs mt-0.5">{promos[0].descripcion}</p>
            </div>
            <span className="bg-[#C8972C] text-white text-xs font-bold px-3 py-1.5 rounded-lg ml-3 shrink-0">
              ${promos[0].precio.toLocaleString('es-AR')}
            </span>
          </div>
        )}

        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#7A6E65] px-1 mt-4 mb-2">
          {catActiva === 'todos' ? 'Todos los productos' : CATEGORIAS.find(c => c.slug === catActiva)?.nombre?.replace(' ★','')}
        </p>

        {/* Grid de productos */}
        <div className="grid grid-cols-2 gap-2.5">
          {filtrados.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-[#E2DBD3] overflow-hidden flex flex-col">
              <div className="h-[100px] bg-[#E8EDE9] flex items-center justify-center relative">
                {p.imagen_url
                  ? <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover" />
                  : <div className="w-11 h-11 rounded-full bg-[#1B3A28]/15 flex items-center justify-center">
                      <span className="text-[#1B3A28] font-bold text-base">{p.nombre.charAt(0)}</span>
                    </div>
                }
                {p.badge && (
                  <span className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${BADGE_STYLES[p.badge]}`}>
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="px-2.5 pt-2.5 pb-2 flex-1 flex flex-col gap-0.5">
                <p className="text-xs font-semibold text-[#1B3A28] leading-snug">{p.nombre}</p>
                <p className="text-[10px] text-[#8A7E75] leading-snug">{p.descripcion}</p>
                <p className="text-[15px] font-bold text-[#1B3A28] mt-1">${p.precio.toLocaleString('es-AR')}</p>
              </div>
              <div className="flex gap-1.5 px-2.5 pb-2.5">
                <a href={buildWhatsappLink(p.nombre, p.precio)} target="_blank" rel="noopener noreferrer"
                   className="flex-1 flex items-center justify-center bg-[#25D366] text-white text-[11px] font-bold rounded-lg py-2">
                  WhatsApp
                </a>
                <a href={buildInstagramLink()} target="_blank" rel="noopener noreferrer"
                   className="flex-1 flex items-center justify-center border border-[#1B3A28] text-[#1B3A28] text-[11px] font-bold rounded-lg py-2">
                  Instagram
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-[#1B3A28] py-5 text-center">
        <p className="text-white/40 text-[11px]">© 2025 Amargos del Mate · Catamarca, Argentina</p>
      </footer>
    </div>
  )
}
