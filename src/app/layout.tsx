import React from 'react'
import { ThemeProvider } from 'next-themes'
import { StackProvider, StackTheme } from '@stackframe/stack'
import { stackClientApp } from '@/_stack/client'
import type { Metadata } from 'next'
import { Montserrat_Alternates, Roboto_Flex } from 'next/font/google'
import './globals.css'

const robotoFlex = Roboto_Flex({
    variable: '--font-roboto-flex',
    subsets: ['latin'],
})

const montserratAlternates = Montserrat_Alternates({
    variable: '--font-montserrat-alternates',
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
            <body
                className={`${robotoFlex.variable} ${montserratAlternates.variable} antialiased bg-background text-foreground`}
            >
                <StackProvider app={stackClientApp}>
                    <StackTheme>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="dark"
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                        </ThemeProvider>
                    </StackTheme>
                </StackProvider>
            </body>
        </html>
    )
}
