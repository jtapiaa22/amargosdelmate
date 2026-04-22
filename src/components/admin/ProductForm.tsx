'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Producto, Categoria, ProductoInsert } from '@/types'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

type Props = {
  categorias: Categoria[]
  producto?: Producto
}

export default function ProductForm({ categorias, producto }: Props) {
  const isEditing = !!producto
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    precio: producto?.precio?.toString() || '',
    categoria_id: producto?.categoria_id?.toString() || categorias[0]?.id?.toString() || '',
    activo: producto?.activo ?? true,
    es_promo: producto?.es_promo ?? false,
    badge: producto?.badge || '',
    orden: producto?.orden?.toString() || '0',
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(producto?.imagen_url || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function uploadImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
    const { error } = await supabase.storage.from('productos').upload(fileName, file, { cacheControl: '3600', upsert: false })
    if (error) throw new Error(`Error subiendo imagen: ${error.message}`)
    const { data: { publicUrl } } = supabase.storage.from('productos').getPublicUrl(fileName)
    return publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let imagen_url = producto?.imagen_url || null
      if (imageFile) {
        imagen_url = await uploadImage(imageFile)
      } else if (!imagePreview) {
        imagen_url = null
      }

      const data = {
        nombre: form.nombre,
        descripcion: form.descripcion || null,
        precio: parseFloat(form.precio),
        categoria_id: parseInt(form.categoria_id),
        imagen_url,
        activo: form.activo,
        es_promo: form.es_promo,
        badge: (form.badge || null) as Producto['badge'],
        orden: parseInt(form.orden),
      }

      if (isEditing && producto) {
        const { error } = await supabase.from('productos').update(data).eq('id', producto.id)
        if (error) throw new Error(error.message)
        setSuccess('✓ Producto actualizado correctamente')
      } else {
        const { error } = await supabase.from('productos').insert(data as ProductoInsert)
        if (error) throw new Error(error.message)
        setSuccess('✓ Producto creado correctamente')
      }

      setTimeout(() => router.push('/admin/dashboard'), 1200)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!producto || !confirm('¿Eliminar este producto? No se puede deshacer.')) return
    setLoading(true)
    try {
      const { error } = await supabase.from('productos').delete().eq('id', producto.id)
      if (error) throw new Error(error.message)
      router.push('/admin/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
      setLoading(false)
    }
  }

  const inputClass = 'w-full border border-[#E2DBD3] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B3A28] focus:ring-1 focus:ring-[#1B3A28]/20 text-[#1B3A28] transition-all'
  const labelClass = 'text-xs font-semibold text-[#5A4E42] uppercase tracking-wide block mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E2DBD3] p-6 md:p-8 max-w-2xl">
      <h2 className="text-[#1B3A28] text-xl font-bold mb-6">
        {isEditing ? 'Editar producto' : 'Nuevo producto'}
      </h2>

      <div className="grid gap-5">
        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className={labelClass}>Nombre *</label>
          <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Ej: Mate Imperial de Algarrobo" className={inputClass} />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className={labelClass}>Descripción</label>
          <textarea id="descripcion" name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Breve descripción..." rows={3} className={`${inputClass} resize-none`} />
        </div>

        {/* Precio + Categoría */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="precio" className={labelClass}>Precio *</label>
            <input id="precio" name="precio" type="number" step="0.01" min="0" value={form.precio} onChange={handleChange} required placeholder="0.00" className={inputClass} />
          </div>
          <div>
            <label htmlFor="categoria_id" className={labelClass}>Categoría *</label>
            <select id="categoria_id" name="categoria_id" value={form.categoria_id} onChange={handleChange} required className={`${inputClass} bg-white`}>
              {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
          </div>
        </div>

        {/* Badge + Orden */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="badge" className={labelClass}>Badge</label>
            <select id="badge" name="badge" value={form.badge} onChange={handleChange} className={`${inputClass} bg-white`}>
              <option value="">Sin badge</option>
              <option value="Promo">🏷️ Promo</option>
              <option value="Nuevo">✨ Nuevo</option>
              <option value="Popular">🔥 Popular</option>
            </select>
          </div>
          <div>
            <label htmlFor="orden" className={labelClass}>Orden</label>
            <input id="orden" name="orden" type="number" min="0" value={form.orden} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
          <label htmlFor="activo" className="flex items-center gap-2.5 cursor-pointer select-none">
            <input id="activo" name="activo" type="checkbox" checked={form.activo} onChange={handleChange} className="w-4 h-4 accent-[#1B3A28] rounded" />
            <span className="text-sm text-[#5A4E42]">Activo (visible en vitrina)</span>
          </label>
          <label htmlFor="es_promo" className="flex items-center gap-2.5 cursor-pointer select-none">
            <input id="es_promo" name="es_promo" type="checkbox" checked={form.es_promo} onChange={handleChange} className="w-4 h-4 accent-[#C8972C] rounded" />
            <span className="text-sm text-[#5A4E42]">Es promo</span>
          </label>
        </div>

        {/* Imagen */}
        <div>
          <label className={labelClass}>Imagen</label>
          {imagePreview ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-[#E2DBD3]">
              <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized={imagePreview.startsWith('blob:')} />
              <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-48 border-2 border-dashed border-[#CCC8C0] rounded-lg flex flex-col items-center justify-center gap-2 text-[#8A7E75] hover:border-[#1B3A28] hover:text-[#1B3A28] transition-all duration-300">
              <Upload className="w-8 h-8" />
              <span className="text-sm font-medium">Subir imagen</span>
              <span className="text-xs">JPG, PNG o WebP</span>
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageSelect} className="hidden" />
        </div>

        {/* Mensajes */}
        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-4 py-2.5 rounded-lg">{error}</p>}
        {success && <p className="text-green-700 text-sm bg-green-50 border border-green-200 px-4 py-2.5 rounded-lg">{success}</p>}

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="flex-1 bg-[#1B3A28] text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-[#2D6A4A] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditing ? 'Guardar cambios' : 'Crear producto'}
          </button>
          {isEditing && (
            <button type="button" onClick={handleDelete} disabled={loading} className="px-6 bg-red-500 text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-60">
              Eliminar
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
