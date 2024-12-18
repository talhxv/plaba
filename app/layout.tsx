import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'PLABA - Plain Language Adaptation of Biomedical Abstracts',
    description: 'Simplify complex biomedical research abstracts into easy-to-understand language.',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        {children}
        </body>
        </html>
    )
}

