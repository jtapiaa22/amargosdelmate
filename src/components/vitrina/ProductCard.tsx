import Image from 'next/image'
import type { Producto } from '@/types'
import { buildWhatsappLink, buildInstagramLink } from '@/lib/whatsapp'
import { MessageCircle } from 'lucide-react'

/* =============================================
 * Icono SVG de Instagram (inline)
 * ============================================= */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

/* =============================================
 * Estilos de badge por tipo
 * ============================================= */
const BADGE_STYLES: Record<string, string> = {
  Promo: 'bg-[#C8972C] text-white',
  Nuevo: 'bg-[#2D6A4A] text-white',
  Popular: 'bg-[#1B3A28] text-white',
}

/* =============================================
 * Props
 * ============================================= */
type Props = {
  producto: Producto
  index?: number
}

/* =============================================
 * Componente ProductCard
 * ============================================= */
export default function ProductCard({ producto, index = 0 }: Props) {
  const waLink = buildWhatsappLink(producto.nombre, producto.precio)
  const igLink = buildInstagramLink()

  return (
    <div
      className="bg-white rounded-xl border border-[#E2DBD3] overflow-hidden flex flex-col hover:shadow-xl hover:shadow-[#1B3A28]/8 hover:-translate-y-1 transition-all duration-300 opacity-0 animate-fade-in-up group"
      style={{
        animationDelay: `${index * 0.06}s`,
        animationFillMode: 'forwards',
      }}
    >
      {/* Imagen del producto */}
      <div className="h-[120px] md:h-[160px] lg:h-[200px] bg-[#E8EDE9] relative overflow-hidden">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#1B3A28]/10 flex items-center justify-center">
              <span className="text-[#1B3A28] font-bold text-xl md:text-2xl select-none">
                {producto.nombre.charAt(0)}
              </span>
            </div>
          </div>
        )}
        {producto.badge && (
          <span
            className={`absolute top-2 right-2 text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide animate-pulse-badge ${BADGE_STYLES[producto.badge]}`}
          >
            {producto.badge}
          </span>
        )}
      </div>

      {/* Info del producto */}
      <div className="px-3 pt-2.5 pb-2 flex-1 flex flex-col gap-0.5">
        <p className="text-xs md:text-sm font-semibold text-[#1B3A28] leading-snug line-clamp-2">
          {producto.nombre}
        </p>
        {producto.descripcion && (
          <p className="text-[10px] md:text-xs text-[#8A7E75] leading-snug line-clamp-2">
            {producto.descripcion}
          </p>
        )}
        <p className="text-[15px] md:text-base font-bold text-[#1B3A28] mt-1">
          ${producto.precio.toLocaleString('es-AR')}
        </p>
      </div>

      {/* Botones de contacto */}
      <div className="flex gap-1.5 px-3 pb-3">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] text-white text-[11px] md:text-xs font-bold rounded-lg py-2 hover:brightness-110 transition-all active:scale-95"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          WhatsApp
        </a>
        <a
          href={igLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 border border-[#1B3A28] text-[#1B3A28] text-[11px] md:text-xs font-bold rounded-lg py-2 hover:bg-[#1B3A28] hover:text-white transition-all duration-300 active:scale-95"
        >
          <InstagramIcon className="w-3.5 h-3.5" />
          Instagram
        </a>
      </div>
    </div>
  )
}
