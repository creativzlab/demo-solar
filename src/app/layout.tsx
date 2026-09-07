import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { ScrollRevealManager } from "@/components/ScrollRevealManager";
import "./globals.css";

const DSI_LOCATION_ID = "ahAjUrjJqfj6IS2nDuNE";
const DSI_CHAT_WIDGET_ID = "6a793242035d8918b066fca0";

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
        <link rel="preconnect" href="https://widgets.leadconnectorhq.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://widgets.leadconnectorhq.com" />
      </head>
      <body>
        <ScrollRevealManager />
        {children}
        <Script
          id="dsi-live-chat"
          src="https://widgets.leadconnectorhq.com/loader.js"
          data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id={DSI_CHAT_WIDGET_ID}
          data-location-id={DSI_LOCATION_ID}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
