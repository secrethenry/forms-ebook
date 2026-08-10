import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Site 100% estático → gera a pasta `out/` que o Cloudflare Pages serve direto.
  output: "export",
  images: {
    // Export estático não usa o otimizador de imagem do Next em runtime;
    // as imagens de `public/img/` já estão pré-otimizadas em .webp.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Thumbnails de facade dos vídeos do YouTube (VSL + depoimentos)
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
  // NOTA: `headers()` não é aplicado em `output: "export"`.
  // Os headers de segurança foram movidos para `public/_headers` (formato Cloudflare Pages).
};

export default nextConfig;
