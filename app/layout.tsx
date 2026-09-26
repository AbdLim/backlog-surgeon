import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Backlog Surgeon',
  description: 'Surgical scope triage for product ideas.',
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
