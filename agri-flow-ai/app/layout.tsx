import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Manrope, Noto_Sans_Devanagari } from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const _headingFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
})
const _bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
})
const _devanagariFont = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari',
})

export const metadata: Metadata = {
  title: 'AgriFlow AI — AI for Better Farming',
  description:
    'Agentic agricultural platform helping smallholder farmers detect crop spoilage risk, find the best mandi price, share transport, and get voice guidance in their local language.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f6f8f2',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`bg-background ${_headingFont.variable} ${_bodyFont.variable} ${_devanagariFont.variable}`}
    >
      <body className="antialiased font-sans">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
