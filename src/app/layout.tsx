import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Amargos del Mate',
  description: 'Todo para tu momento de mate. Mates, yerbas, bombillas y accesorios.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased bg-[#F5F1EB]">
        {children}
      </body>
    </html>
  )
}
