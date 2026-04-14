'use client'

import { useState } from 'react'
import type { Categoria, Producto } from '@/types'
import { buildInstagramLink } from '@/lib/whatsapp'
import ProductCard from './ProductCard'

type Props = {
  categorias: Categoria[]
  productos: Producto[]
}

export default function Vitrina({ categorias, productos }: Props) {
  const [catActiva, setCatActiva] = useState<string>('todos')

  const todasLasCats: Categoria[] = [
    { id: 0, nombre: 'Todos', slug: 'todos', orden: 0, activa: true },
    ...categorias,
  ]

  const filtrados = catActiva === 'todos'
    ? productos
    : productos.filter(p => {
        const cat = categorias.find(c => c.slug === catActiva)
        return cat ? p.categoria_id === cat.id : true
      })

  const promos = productos.filter(p => p.es_promo)
  const mostrarBanner = (catActiva === 'todos' || catActiva === 'promos') && promos.length > 0
  const labelSeccion = catActiva === 'todos'
    ? 'Todos los productos'
    : categorias.find(c => c.slug === catActiva)?.nombre ?? ''

  return (
    <div className="max-w-[430px] mx-auto min-h-screen flex flex-col">

      {/* Header */}
      <header className="bg-[#1B3A28] px-4 py-6 flex flex-col items-center gap-3">
        {/* Reemplazar con <Image src="/logo.png" .../> cuando tengas el archivo */}
        <div className="w-20 h-20 rounded-full border-2 border-white/20 flex flex-col items-center justify-center">
          <span className="text-white text-[8px] font-bold tracking-widest uppercase leading-tight">Amargos</span>
          <span className="text-white/50 text-[7px] tracking-wider uppercase leading-tight">del</span>
          <span className="text-white text-xs font-bold tracking-widest uppercase leading-tight">Mate</span>
        </div>
        <p className="text-white/60 text-xs tracking-wide">Todo para tu momento de mate</p>
        <a
          href={buildInstagramLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-white/85 text-xs hover:bg-white/20 transition-colors"
        >
          @amargosdelmate
        </a>
      </header>

      {/* Filtro de categorías — sticky */}
      <div className="bg-white border-b border-[#E2DBD3] sticky top-0 z-10 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-3 py-3 w-max">
          {todasLasCats.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setCatActiva(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${
                catActiva === cat.slug
                  ? 'bg-[#1B3A28] text-white border-[#1B3A28]'
                  : 'bg-white text-[#5A4E42] border-[#CCC8C0] hover:border-[#1B3A28]/50'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 px-3 pb-8">

        {/* Banner promo destacada */}
        {mostrarBanner && (
          <div className="mt-3 bg-[#1B3A28] rounded-xl px-4 py-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{promos[0].nombre}</p>
              {promos[0].descripcion && (
                <p className="text-white/55 text-xs mt-0.5 truncate">{promos[0].descripcion}</p>
              )}
            </div>
            <span className="bg-[#C8972C] text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0">
              ${promos[0].precio.toLocaleString('es-AR')}
            </span>
          </div>
        )}

        {/* Etiqueta de sección */}
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#7A6E65] px-0.5 mt-4 mb-2">
          {labelSeccion}
        </p>

        {/* Sin resultados */}
        {filtrados.length === 0 && (
          <div className="text-center py-16 text-[#8A7E75] text-sm">
            No hay productos en esta categoría todavía.
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {filtrados.map(producto => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1B3A28] py-5 text-center">
        <p className="text-white/40 text-[11px]">© 2025 Amargos del Mate · Catamarca, Argentina</p>
      </footer>
    </div>
  )
}
