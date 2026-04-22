'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Producto, Categoria } from '@/types'
import AdminLayout from '@/components/admin/AdminLayout'
import ProductList from '@/components/admin/ProductList'
import { Package, Grid3X3, Plus, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const [prodsRes, catsRes] = await Promise.all([
        supabase
          .from('productos')
          .select('*, categoria:categorias(id, nombre, slug, orden, activa)')
          .order('orden', { ascending: true }),
        supabase
          .from('categorias')
          .select('*')
          .order('orden', { ascending: true }),
      ])

      setProductos((prodsRes.data || []) as Producto[])
      setCategorias((catsRes.data || []) as Categoria[])
      setLoading(false)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activos = productos.filter((p) => p.activo).length
  const promos = productos.filter((p) => p.es_promo).length

  return (
    <AdminLayout>
      <h1 className="text-[#1B3A28] text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-[#7A6E65] text-sm mb-6">
        Gestioná tus productos y categorías
      </p>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        {/* Total */}
        <div className="bg-white rounded-xl border border-[#E2DBD3] p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1B3A28]/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-[#1B3A28]" />
            </div>
            <div>
              <p className="text-[10px] text-[#7A6E65] uppercase tracking-wide font-semibold">
                Total
              </p>
              <p className="text-2xl font-bold text-[#1B3A28]">
                {loading ? '—' : productos.length}
              </p>
            </div>
          </div>
        </div>

        {/* Activos */}
        <div className="bg-white rounded-xl border border-[#E2DBD3] p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] text-[#7A6E65] uppercase tracking-wide font-semibold">
                Activos
              </p>
              <p className="text-2xl font-bold text-[#1B3A28]">
                {loading ? '—' : activos}
              </p>
            </div>
          </div>
        </div>

        {/* Categorías */}
        <div className="bg-white rounded-xl border border-[#E2DBD3] p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C8972C]/10 flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-[#C8972C]" />
            </div>
            <div>
              <p className="text-[10px] text-[#7A6E65] uppercase tracking-wide font-semibold">
                Categorías
              </p>
              <p className="text-2xl font-bold text-[#1B3A28]">
                {loading ? '—' : categorias.length}
              </p>
            </div>
          </div>
        </div>

        {/* Botón agregar */}
        <div className="col-span-2 md:col-span-1">
          <a
            href="/admin/productos/nuevo"
            className="h-full min-h-[76px] bg-[#1B3A28] text-white rounded-xl p-4 flex items-center gap-3 hover:bg-[#2D6A4A] transition-colors shadow-md shadow-[#1B3A28]/10"
          >
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold">Agregar producto</span>
          </a>
        </div>
      </div>

      {/* Aviso de promos */}
      {!loading && promos > 0 && (
        <div className="mb-4 bg-[#C8972C]/10 border border-[#C8972C]/20 rounded-lg px-4 py-2.5 text-sm text-[#C8972C]">
          🏷️ Tenés <strong>{promos}</strong> producto
          {promos > 1 ? 's' : ''} marcado{promos > 1 ? 's' : ''} como promo
        </div>
      )}

      {/* Lista de productos */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[#1B3A28] text-lg font-bold">Productos</h2>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-[#E2DBD3] p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#1B3A28]/20 border-t-[#1B3A28] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#8A7E75] text-sm">Cargando productos...</p>
        </div>
      ) : (
        <ProductList productos={productos} />
      )}
    </AdminLayout>
  )
}
