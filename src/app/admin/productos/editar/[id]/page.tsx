'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Producto, Categoria } from '@/types'
import AdminLayout from '@/components/admin/AdminLayout'
import ProductForm from '@/components/admin/ProductForm'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function EditarProducto({ params, searchParams }: PageProps) {
  const { id } = use(params)
  // const _query = use(searchParams) // Omitimos si no se usa

  const [producto, setProducto] = useState<Producto | null>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const [prodRes, catsRes] = await Promise.all([
        supabase
          .from('productos')
          .select('*, categoria:categorias(id, nombre, slug, orden, activa)')
          .eq('id', parseInt(id))
          .single(),
        supabase
          .from('categorias')
          .select('*')
          .order('orden', { ascending: true }),
      ])

      if (prodRes.error || !prodRes.data) {
        setNotFound(true)
      } else {
        setProducto(prodRes.data as Producto)
      }

      setCategorias((catsRes.data || []) as Categoria[])
      setLoading(false)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

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
          <p className="text-[#8A7E75] text-sm">Cargando producto...</p>
        </div>
      ) : notFound ? (
        <div className="bg-white rounded-xl border border-[#E2DBD3] p-12 text-center">
          <p className="text-[#8A7E75] text-sm mb-2">
            Producto no encontrado.
          </p>
          <a
            href="/admin/dashboard"
            className="text-[#1B3A28] text-sm font-semibold hover:underline"
          >
            Volver al dashboard →
          </a>
        </div>
      ) : (
        <ProductForm categorias={categorias} producto={producto!} />
      )}
    </AdminLayout>
  )
}
