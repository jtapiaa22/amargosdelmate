import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Amargos del Mate — Todo para tu momento de mate',
  description:
    'Mates artesanales, yerbas premium, bombillas y accesorios. Catamarca, Argentina. Consultá por WhatsApp.',
  keywords: [
    'mate',
    'yerba',
    'bombilla',
    'accesorios mate',
    'catamarca',
    'argentina',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${outfit.className} antialiased bg-[#F5F1EB]`}>
        {children}
      </body>
    </html>
  )
}
