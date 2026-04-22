'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Producto } from '@/types'
import Image from 'next/image'
import { Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'

type Props = { productos: Producto[] }

export default function ProductList({ productos: initialProducts }: Props) {
  const [productos, setProductos] = useState(initialProducts)
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const supabase = createClient()

  async function toggleActive(id: number, currentActive: boolean) {
    setLoadingId(id)
    const { error } = await supabase.from('productos').update({ activo: !currentActive }).eq('id', id)
    if (!error) setProductos(prev => prev.map(p => p.id === id ? { ...p, activo: !currentActive } : p))
    setLoadingId(null)
  }

  async function deleteProduct(id: number) {
    if (!confirm('¿Eliminar este producto? No se puede deshacer.')) return
    setLoadingId(id)
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (!error) setProductos(prev => prev.filter(p => p.id !== id))
    setLoadingId(null)
  }

  if (productos.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E2DBD3] p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-[#E8EDE9] flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🧉</span>
        </div>
        <p className="text-[#8A7E75] text-sm mb-2">No hay productos todavía.</p>
        <a href="/admin/productos/nuevo" className="text-[#1B3A28] text-sm font-semibold hover:underline">Crear el primero →</a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2DBD3] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2DBD3] bg-[#F5F1EB]/50">
              <th className="text-left text-[10px] font-semibold text-[#7A6E65] uppercase tracking-wider px-4 py-3">Producto</th>
              <th className="text-left text-[10px] font-semibold text-[#7A6E65] uppercase tracking-wider px-4 py-3 hidden md:table-cell">Categoría</th>
              <th className="text-right text-[10px] font-semibold text-[#7A6E65] uppercase tracking-wider px-4 py-3">Precio</th>
              <th className="text-center text-[10px] font-semibold text-[#7A6E65] uppercase tracking-wider px-4 py-3">Estado</th>
              <th className="text-right text-[10px] font-semibold text-[#7A6E65] uppercase tracking-wider px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} className="border-b border-[#E2DBD3]/50 last:border-0 hover:bg-[#F5F1EB]/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#E8EDE9] flex-shrink-0 relative">
                      {p.imagen_url ? (
                        <Image src={p.imagen_url} alt={p.nombre} fill className="object-cover" sizes="40px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#1B3A28] font-bold text-sm">{p.nombre.charAt(0)}</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1B3A28] truncate max-w-[140px] md:max-w-[250px]">{p.nombre}</p>
                      {p.badge && <span className="text-[9px] font-bold text-[#C8972C] uppercase">{p.badge}</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs text-[#7A6E65]">{p.categoria?.nombre || '—'}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-bold text-[#1B3A28]">${p.precio.toLocaleString('es-AR')}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleActive(p.id, p.activo)} disabled={loadingId === p.id}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${p.activo ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
                    {loadingId === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : p.activo ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {p.activo ? 'Activo' : 'Oculto'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <a href={`/admin/productos/editar/${p.id}`} className="p-2 text-[#7A6E65] hover:text-[#1B3A28] hover:bg-[#E8EDE9] rounded-lg transition-colors" title="Editar">
                      <Edit className="w-4 h-4" />
                    </a>
                    <button onClick={() => deleteProduct(p.id)} disabled={loadingId === p.id} className="p-2 text-[#7A6E65] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" title="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
