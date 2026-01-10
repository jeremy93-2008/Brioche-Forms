import { Toaster } from '@/_components/ui/sonner'
import { stackClientApp } from '@/_stack/client'
import { StackProvider, StackTheme } from '@stackframe/stack'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Montserrat_Alternates, Poppins } from 'next/font/google'
import React from 'react'
import './globals.css'

const poppins = Poppins({
    variable: '--font-poppins',
    subsets: ['latin'],
    weight: ['400', '700'],
})

const montserratAlternates = Montserrat_Alternates({
    variable: '--font-montserrat',
    subsets: ['latin'],
    weight: ['400', '700'],
})

export const metadata: Metadata = {
    title: 'Brioche - Forms Builder',
    description:
        'Create and share forms effortlessly with Brioche, the intuitive forms builder designed for simplicity and efficiency.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <link rel="icon" href="/brioche.svg" />
            <body
                className={`${poppins.variable} ${montserratAlternates.variable} antialiased`}
            >
                <StackProvider app={stackClientApp} lang="es-ES">
                    <StackTheme>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="dark"
                            enableSystem
                        >
                            <Toaster position="top-center" />
                            {children}
                        </ThemeProvider>
                    </StackTheme>
                </StackProvider>
            </body>
        </html>
    )
}
