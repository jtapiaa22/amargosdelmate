const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

/**
 * Genera un link de WhatsApp para consultar por un producto.
 * El número se configura en .env.local → NEXT_PUBLIC_WHATSAPP_NUMBER
 */
export function buildWhatsappLink(productoNombre: string, precio: number): string {
  const mensaje = `Hola! Me interesa el producto: ${productoNombre} ($${precio.toLocaleString('es-AR')})`
  const encoded = encodeURIComponent(mensaje)

  if (!WA_NUMBER) {
    // Si no está configurado el número, abre WhatsApp sin destinatario
    return `https://wa.me/?text=${encoded}`
  }

  return `https://wa.me/${WA_NUMBER}?text=${encoded}`
}

export function buildInstagramLink(): string {
  const handle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'amargosdelmate'
  return `https://instagram.com/${handle}`
}
