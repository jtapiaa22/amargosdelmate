import type { Producto } from '@/types'
import { buildWhatsappLink, buildInstagramLink } from '@/lib/whatsapp'

const BADGE_STYLES: Record<string, string> = {
  Promo:   'bg-[#C8972C] text-white',
  Nuevo:   'bg-[#2D6A4A] text-white',
  Popular: 'bg-[#1B3A28] text-white',
}

type Props = {
  producto: Producto
}

export default function ProductCard({ producto }: Props) {
  const waLink = buildWhatsappLink(producto.nombre, producto.precio)
  const igLink = buildInstagramLink()

  return (
    <div className="bg-white rounded-xl border border-[#E2DBD3] overflow-hidden flex flex-col">

      {/* Imagen */}
      <div className="h-[110px] bg-[#E8EDE9] flex items-center justify-center relative overflow-hidden">
        {producto.imagen_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#1B3A28]/15 flex items-center justify-center">
            <span className="text-[#1B3A28] font-bold text-lg select-none">
              {producto.nombre.charAt(0)}
            </span>
          </div>
        )}
        {producto.badge && (
          <span className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${BADGE_STYLES[producto.badge]}`}>
            {producto.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-3 pt-2.5 pb-2 flex-1 flex flex-col gap-0.5">
        <p className="text-xs font-semibold text-[#1B3A28] leading-snug line-clamp-2">
          {producto.nombre}
        </p>
        {producto.descripcion && (
          <p className="text-[10px] text-[#8A7E75] leading-snug line-clamp-2">
            {producto.descripcion}
          </p>
        )}
        <p className="text-[15px] font-bold text-[#1B3A28] mt-1">
          ${producto.precio.toLocaleString('es-AR')}
        </p>
      </div>

      {/* Botones */}
      <div className="flex gap-1.5 px-3 pb-3">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center bg-[#25D366] text-white text-[11px] font-bold rounded-lg py-2 hover:brightness-110 transition-all active:scale-95"
        >
          WhatsApp
        </a>
        <a
          href={igLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center border border-[#1B3A28] text-[#1B3A28] text-[11px] font-bold rounded-lg py-2 hover:bg-[#1B3A28]/5 transition-all active:scale-95"
        >
          Instagram
        </a>
      </div>
    </div>
  )
}
