import type { Metadata } from 'next'
import { Rubik, Pirata_One, IM_Fell_English_SC } from 'next/font/google'
import './globals.css' 
import Header from '@/components/Header'

const rubik = Rubik({ 
  subsets: ['latin'], 
  variable: '--font-rubik',
  display: 'swap',
  weight: ['400', '500', '600', '700']
})

const pirata = Pirata_One({
  subsets: ['latin'],
  variable: '--font-pirata',
  display: 'swap',
  weight: '400'
})

const imfell = IM_Fell_English_SC({
  subsets: ['latin'],
  variable: '--font-imfell',
  display: 'swap',
  weight: '400'
})

export const metadata: Metadata = {
  title: 'Anime Quote Generator — Inspirational Quotes from Your Favorite Anime',
  description: 'Generate random inspirational anime quotes from popular characters. Get fresh quotes every click!',
  icons: {
    icon: '/assest/favicon.webp',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${rubik.variable} ${pirata.variable} ${imfell.variable} font-rubik`}>
      <body> 
        <Header />
        <div id="page-content-wrapper" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, padding: '0 20px', boxSizing: 'border-box' }}>
          {children}
        </div>
      </body>
    </html>
  )
}
