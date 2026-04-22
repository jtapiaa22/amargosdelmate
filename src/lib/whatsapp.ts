const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

/**
 * Genera un link de WhatsApp para consultar por un producto.
 * El número se configura en .env.local → NEXT_PUBLIC_WHATSAPP_NUMBER
 */
export function buildWhatsappLink(
  productoNombre: string,
  precio: number
): string {
  const mensaje = `Hola! Me interesa el producto: ${productoNombre} ($${precio.toLocaleString('es-AR')})`
  const encoded = encodeURIComponent(mensaje)

  if (!WA_NUMBER) {
    return `https://wa.me/?text=${encoded}`
  }

  return `https://wa.me/${WA_NUMBER}?text=${encoded}`
}

/**
 * Genera el link al perfil de Instagram del negocio.
 * El handle se configura en .env.local → NEXT_PUBLIC_INSTAGRAM_HANDLE
 */
export function buildInstagramLink(): string {
  const handle =
    process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'amargosdelmate'
  return `https://instagram.com/${handle}`
}
