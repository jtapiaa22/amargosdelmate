'use client'

// TODO: agregar protección de ruta (middleware o useEffect con redirect)

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F5F1EB] p-6">
      <h1 className="text-[#1B3A28] text-2xl font-bold mb-2">Panel de Administración</h1>
      <p className="text-[#7A6E65] text-sm mb-8">Amargos del Mate</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#E2DBD3] p-4">
          <p className="text-xs text-[#7A6E65] uppercase tracking-wide font-semibold mb-1">Productos</p>
          <p className="text-3xl font-bold text-[#1B3A28]">—</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2DBD3] p-4">
          <p className="text-xs text-[#7A6E65] uppercase tracking-wide font-semibold mb-1">Categorías</p>
          <p className="text-3xl font-bold text-[#1B3A28]">5</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <a href="/admin/productos/nuevo"
           className="bg-[#1B3A28] text-white text-sm font-semibold px-4 py-3 rounded-xl text-center hover:bg-[#2D6A4A] transition-colors">
          + Agregar producto
        </a>
        <a href="/"
           className="border border-[#1B3A28] text-[#1B3A28] text-sm font-semibold px-4 py-3 rounded-xl text-center hover:bg-[#1B3A28]/5 transition-colors">
          Ver vitrina
        </a>
      </div>
    </div>
  )
}
