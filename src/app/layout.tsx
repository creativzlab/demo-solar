import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ScrollRevealManager } from "@/components/ScrollRevealManager";
import "./globals.css";

const siteFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
  variable: "--font-plus-jakarta-sans",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://demosolar.creativzlab.com"),
  title: "Demanda Solar Infinita | Demonstração",
  description: "Experiência demonstrativa de orçamento e qualificação para empresas de energia solar.",
  alternates: { canonical: "/" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={siteFont.variable} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body>
        <ScrollRevealManager />
        {children}
      </body>
    </html>
  );
}
