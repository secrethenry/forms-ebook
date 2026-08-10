import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, JetBrains_Mono } from "next/font/google";
import {
  SITE_CANONICAL_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  jsonLdGraph,
  serializeJsonLd,
} from "@/lib/seo";
import "./globals.css";

/**
 * Fontes self-hosted via next/font (zero CLS, sem request render-blocking).
 * - Bebas Neue: display/headlines (caixa-alta condensada, cartaz noir)
 * - Inter: corpo de texto (300–700)
 * - JetBrains Mono: "evidência forense" (countdown, credenciais, nº de aula)
 */
const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  authors: [{ name: "Henrique Yoiti", url: SITE_URL }],
  creator: "Henrique Yoiti",
  publisher: "Jogo de Corpo",
  category: "education",
  alternates: {
    canonical: SITE_CANONICAL_URL,
  },
  // Página de tráfego pago / link em DM. Indexar competiria com a LP de venda
  // em 3dm.jogodecorpo.com.br pelas mesmas palavras-chave, sem ganho.
  robots: { index: false, follow: false },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_CANONICAL_URL,
    siteName: SITE_NAME,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${bebas.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>
        {/* Sem Pixel/Clarity nesta página — captura simples e limpa. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLdGraph) }}
        />
        {children}
      </body>
    </html>
  );
}
