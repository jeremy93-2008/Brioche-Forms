import React from "react";
import type { Metadata } from "next";
import {Roboto_Flex, Montserrat_Alternates} from "next/font/google";
import "./globals.css";

const robotoFlex = Roboto_Flex({
    variable: "--font-roboto-flex",
    subsets: ["latin"],
});

const montserratAlternates = Montserrat_Alternates({
    variable: "--font-montserrat-alternates",
    subsets: ["latin"],
    weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Brioche - Forms Builder",
  description: "Create and share forms effortlessly with Brioche, the intuitive forms builder designed for simplicity and efficiency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${robotoFlex.variable} ${montserratAlternates.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
