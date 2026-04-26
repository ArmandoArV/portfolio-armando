import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/FluentProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Armando Arredondo Valle | Software Engineer",
  description: "Software Engineer at Microsoft. Building cloud-native systems, AI solutions & real-time applications.",
  openGraph: {
    title: "Armando Arredondo Valle | Software Engineer",
    description: "Software Engineer at Microsoft. React, Azure, Next.js, TypeScript.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased scroll-smooth`}>
      <body className="bg-slate-950 text-white font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
