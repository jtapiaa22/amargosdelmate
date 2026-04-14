export type Categoria = {
  id: number
  nombre: string
  slug: string
  orden: number
  activa: boolean
}

export type Producto = {
  id: number
  nombre: string
  descripcion: string | null
  precio: number
  categoria_id: number
  imagen_url: string | null
  activo: boolean
  es_promo: boolean
  badge: 'Promo' | 'Nuevo' | 'Popular' | null
  orden: number
  created_at: string
  categoria?: Categoria
}

export type ProductoInsert = Omit<Producto, 'id' | 'created_at' | 'categoria'>
export type ProductoUpdate = Partial<ProductoInsert>

export type AdminUser = {
  id: string
  email: string
}
