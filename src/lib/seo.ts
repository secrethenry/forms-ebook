/**
 * SEO da página de captura do Guia.
 *
 * ⚠️ Se usar outro subdomínio, troque `SITE_URL` aqui.
 * `robots: noindex` de propósito: é página de link em bio / DM / tráfego, não
 * de busca orgânica — não precisa ser indexada.
 */
export const SITE_URL = "https://liberar-livro.jogodecorpo.com.br";
export const SITE_CANONICAL_URL = SITE_URL;
export const SITE_NAME = "Guia — Por Que Qualquer Mentira Funciona Com Você?";
export const SITE_TITLE = "Por Que Qualquer Mentira Funciona Com Você? — Guia grátis";
export const SITE_DESCRIPTION =
  "Baixe o guia gratuito e descubra os 3 mecanismos que deixam qualquer pessoa vulnerável à manipulação — e como desativá-los. Por Henrique Yoiti, certificado pelo Paul Ekman Group.";

export const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Jogo de Corpo",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: `${SITE_URL}/icon.svg`,
      },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#henrique-yoiti`,
      name: "Henrique Yoiti",
      url: SITE_URL,
      jobTitle: "Especialista em leitura de comportamento e análise da mentira",
      worksFor: { "@id": `${SITE_URL}/#organization` },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "professional certification",
        recognizedBy: { "@type": "Organization", name: "Paul Ekman Group" },
      },
      knowsAbout: [
        "Leitura de comportamento",
        "Linguagem corporal",
        "Microexpressões",
        "Detecção de mentiras",
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_CANONICAL_URL,
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      author: { "@id": `${SITE_URL}/#henrique-yoiti` },
      inLanguage: "pt-BR",
    },
  ],
} as const;

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
