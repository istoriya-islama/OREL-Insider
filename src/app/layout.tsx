import type { Metadata } from 'next'
import { Alegreya } from 'next/font/google'
import './globals.css'

const alegreya = Alegreya({
  subsets: ['latin'], // обязательно укажи
  variable: '--font-alegreya' // если нужны разные толщины
})

export const metadata: Metadata = {
  title: 'OREL Insider',
  description: 'OREL Insider for developer',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${alegreya.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
