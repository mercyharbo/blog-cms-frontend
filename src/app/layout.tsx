import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { Providers } from '@/store/provider'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.com'),
  title: {
    default: 'CMS Platform - Modern Content Management System',
    template: '%s | CMS Platform',
  },
  description:
    'A powerful and intuitive content management system for modern digital content creators and enterprises',
  keywords: [
    'CMS',
    'content management',
    'digital content',
    'enterprise CMS',
    'headless CMS',
    'content platform',
  ],
  authors: [{ name: 'Your Name', url: 'https://your-domain.com' }],
  creator: 'Your Company Name',
  publisher: 'Your Company Name',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    siteName: 'CMS Platform',
    title: 'CMS Platform - Modern Content Management System',
    description:
      'A powerful and intuitive content management system for modern digital content creators and enterprises',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CMS Platform Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CMS Platform - Modern Content Management System',
    description:
      'A powerful and intuitive content management system for modern digital content creators and enterprises',
    creator: '@yourhandle',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
          <ToastContainer
            position='top-right'
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='light'
          />
        </Providers>
      </body>
    </html>
  )
}
