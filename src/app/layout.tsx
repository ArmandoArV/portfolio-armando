import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/FluentProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.armandoav.com"),
  alternates: {
    canonical: "https://www.armandoav.com",
  },
  title: "Armando Arredondo Valle | Software Engineer at Microsoft",
  description:
    "Software Engineer at Microsoft building cloud-native systems, AI solutions & real-time applications. React, Azure, .NET, Go, TypeScript. Explore my interactive 3D portfolio.",
  keywords: [
    "Armando Arredondo Valle",
    "Software Engineer",
    "Microsoft",
    "React",
    "Azure",
    "TypeScript",
    "Next.js",
    ".NET",
    "Go",
    "AI",
    "Machine Learning",
    "Full Stack Developer",
    "Cloud Engineer",
  ],
  authors: [{ name: "Armando Arredondo Valle", url: "https://www.armandoav.com" }],
  creator: "Armando Arredondo Valle",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.armandoav.com",
    siteName: "Armando Arredondo Valle",
    title: "Armando Arredondo Valle | Software Engineer at Microsoft",
    description:
      "Software Engineer at Microsoft. React, Azure, .NET, Go, TypeScript. Interactive 3D portfolio with AI concierge.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Armando Arredondo Valle | Software Engineer at Microsoft",
    description:
      "Interactive 3D portfolio — explore planets, talk to an AI concierge, and discover my work at Microsoft.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased scroll-smooth`}>
      <body className="bg-slate-950 leading-relaxed text-slate-400 antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
