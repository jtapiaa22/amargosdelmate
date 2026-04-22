import { createClient } from '@/lib/supabase/server'
import Vitrina from '@/components/vitrina/Vitrina'
import type { Categoria, Producto } from '@/types'

export default async function Home() {
  const supabase = await createClient()

  // Traer categorías activas ordenadas
  const { data: categorias, error: errorCats } = await supabase
    .from('categorias')
    .select('*')
    .eq('activa', true)
    .order('orden', { ascending: true })

  // Traer productos activos con su categoría
  const { data: productos, error: errorProds } = await supabase
    .from('productos')
    .select(
      `
      *,
      categoria:categorias (
        id, nombre, slug, orden, activa
      )
    `
    )
    .eq('activo', true)
    .order('orden', { ascending: true })

  // Log en consola del servidor si algo falla (no rompe la UI)
  if (errorCats)
    console.error('[Vitrina] Error al traer categorías:', errorCats.message)
  if (errorProds)
    console.error('[Vitrina] Error al traer productos:', errorProds.message)

  return (
    <Vitrina
      categorias={(categorias ?? []) as Categoria[]}
      productos={(productos ?? []) as Producto[]}
    />
  )
}
