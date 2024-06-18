import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Component } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WixClientContextProvider } from "@/context/wixContext";
import { UIProvider } from "@/context/nextuiContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DAPANDA AUCTION",
  description: "A complete e-commerce application with Next.js and Wix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WixClientContextProvider>
          <UIProvider>
            <Navbar />
            {children}
            <Footer />
          </UIProvider>
        </WixClientContextProvider>
      </body>
    </html>
  );
}
