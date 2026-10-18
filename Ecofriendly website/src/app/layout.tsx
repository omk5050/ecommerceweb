import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EARTHFORM — Crafted by Nature",
  description: "From Sugarcane Waste to a Better Tomorrow. Discover thoughtfully crafted bagasse products made from sugarcane residue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-ivory text-charcoal min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
