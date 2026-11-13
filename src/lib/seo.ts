/**
 * SEO da página de captura da aula gratuita (+ e-book bônus).
 *
 * ⚠️ Se usar outro subdomínio, troque `SITE_URL` aqui.
 * `robots: noindex` de propósito: é página de link em bio / DM / tráfego, não
 * de busca orgânica — não precisa ser indexada.
 */
export const SITE_URL = "https://liberar-livro.jogodecorpo.com.br";
export const SITE_CANONICAL_URL = SITE_URL;
export const SITE_NAME = "Aula gratuita — As Três Dimensões da Mentira";
export const SITE_TITLE = "Aula gratuita: As Três Dimensões da Mentira — Henrique Yoiti";
export const SITE_DESCRIPTION =
  "Assista à aula gratuita e aprenda a nunca mais ser o último a descobrir a mentira. De bônus, o e-book Por Que Qualquer Mentira Funciona Com Você? Por Henrique Yoiti, certificado pelo Paul Ekman Group.";

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
