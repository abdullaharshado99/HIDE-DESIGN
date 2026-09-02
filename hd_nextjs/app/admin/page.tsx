import { Suspense } from 'react'
import type { Metadata } from 'next'
import AdminPanelWrapper from '../components/AdminPanelWrapper'

export const metadata: Metadata = {
  metadataBase: new URL('https://hidesdesign.com'),
  title: 'Admin | HIDE DESIGN',
  description: 'Private admin dashboard for HIDE DESIGN product management.',
  alternates: {
    canonical: '/admin',
  },
  openGraph: {
    title: 'Admin | HIDE DESIGN',
    description: 'Private admin dashboard for HIDE DESIGN product management.',
    url: 'https://hidesdesign.com/admin',
    siteName: 'HIDE DESIGN',
    type: 'website',
    images: [
      {
        url: 'https://hidesdesign.com/file.svg',
        width: 1200,
        height: 630,
        alt: 'HIDE DESIGN admin',
      },
    ],
  },
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="admin-shell"><p>Loading Admin...</p></div>}>
      <AdminPanelWrapper />
    </Suspense>
  )
}