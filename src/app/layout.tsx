import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flarefix — Quality Freelancers. Zero Noise.',
  description: 'A gated freelance platform where limited access, ethical screening, and intentional bidding replace spam, volume, and distrust.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
