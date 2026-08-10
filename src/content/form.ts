/**
 * Captura do Guia (PDF "Por Que Qualquer Mentira Funciona Com Você?").
 * Fonte única: perguntas do form (uma por tela) + copy do topo e da liberação.
 *
 * Só 3 campos, todos digitados: nome → e-mail → WhatsApp. Sem qualificação,
 * sem score — é um lead magnet: capta o contato e libera o PDF na hora.
 */

export type FieldName = "nome" | "email" | "whatsapp";

export type Step = {
  field: FieldName;
  type: "text" | "email" | "tel";
  question: string;
  subtitle: string;
  placeholder: string;
};

/**
 * Ordem: nome → e-mail → WhatsApp. O contato (nome+e-mail) é salvo como
 * `parcial` logo após o e-mail — se a pessoa desistir no WhatsApp (campo de
 * maior atrito, ainda mais internacional), o lead não se perde.
 */
export const STEPS: Step[] = [
  {
    field: "nome",
    type: "text",
    question: "Antes de liberar seu guia: como eu te chamo?",
    subtitle: "Nome e sobrenome.",
    placeholder: "Seu nome completo",
  },
  {
    field: "email",
    type: "email",
    question: "{nome}, qual o seu melhor e-mail?",
    subtitle: "É onde eu registro o seu acesso ao guia.",
    placeholder: "seu@email.com",
  },
  {
    field: "whatsapp",
    type: "tel",
    question: "Por último, {nome}: seu WhatsApp.",
    subtitle: "Pra você não perder quando eu soltar material novo por lá.",
    placeholder: "(11) 99999-9999",
  },
];

/** Copy do topo da página (fixa, acima do form). */
export const HERO = {
  kicker: "Guia gratuito · PDF",
  title: "Por que qualquer mentira funciona com você?",
  sub: "Descubra os 3 mecanismos que deixam qualquer pessoa vulnerável à manipulação — e como desativá-los.",
} as const;

/** Copy da tela de liberação (depois de preencher). */
export const REVEAL = {
  kicker: "Acesso liberado",
  headline: "Pronto, {nome}. Seu guia está liberado.",
  pdfTitle: "Por Que Qualquer Mentira Funciona Com Você?",
  pdfDesc: "Os 3 mecanismos que te deixam vulnerável — e como desativar cada um.",
  downloadLabel: "Baixar o guia",
  upsellKicker: "O próximo passo",
  upsellText:
    "Este guia é o mapa dos 3 mecanismos. O treinamento completo — As Três Dimensões da Mentira — te dá o sistema inteiro pra ler qualquer conversa em tempo real.",
  upsellLabel: "Conhecer o treinamento",
} as const;

/** Mensagens do micro-loader antes de liberar (rápido — não é processamento real). */
export const LOADER_STEPS = ["Liberando seu acesso…"] as const;
