'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Categoria } from '@/types'
import AdminLayout from '@/components/admin/AdminLayout'
import ProductForm from '@/components/admin/ProductForm'

export default function NuevoProducto() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCats() {
      const { data } = await supabase
        .from('categorias')
        .select('*')
        .order('orden', { ascending: true })
      setCategorias((data || []) as Categoria[])
      setLoading(false)
    }
    fetchCats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AdminLayout>
      <div className="mb-4">
        <a
          href="/admin/dashboard"
          className="text-[#7A6E65] text-xs hover:text-[#1B3A28] transition-colors"
        >
          ← Volver al dashboard
        </a>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-[#E2DBD3] p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#1B3A28]/20 border-t-[#1B3A28] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#8A7E75] text-sm">Cargando categorías...</p>
        </div>
      ) : (
        <ProductForm categorias={categorias} />
      )}
    </AdminLayout>
  )
}
