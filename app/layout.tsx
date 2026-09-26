import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#0a0b0d',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Backlog Surgeon — Surgical Scope Triage for Product Ideas',
  description:
    'An opinionated, clinical product scoping tool that triages messy, over-scoped product ideas into a defensible MVP for founders, developers, and small teams.',
  keywords: [
    'product management',
    'MVP scope',
    'scope creep',
    'product triage',
    'backlog management',
    'startup MVP',
    'product strategy',
  ],
  authors: [{ name: 'Backlog Surgeon Team' }],
  openGraph: {
    title: 'Backlog Surgeon — Surgical Scope Triage for Product Ideas',
    description:
      'Ruthlessly challenges bloated product ideas and extracts the defensible kernel: Build Now, Build Later, and Don’t Build.',
    type: 'website',
    siteName: 'Backlog Surgeon',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Backlog Surgeon — Surgical Scope Triage for Product Ideas',
    description:
      'Ruthlessly challenges bloated product ideas and extracts the defensible kernel: Build Now, Build Later, and Don’t Build.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
