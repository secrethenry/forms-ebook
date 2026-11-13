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
    question: "Antes de liberar sua aula: como eu te chamo?",
    subtitle: "Nome e sobrenome.",
    placeholder: "Seu nome completo",
  },
  {
    field: "email",
    type: "email",
    question: "{nome}, qual o seu melhor e-mail?",
    subtitle: "É onde eu registro o seu acesso à aula.",
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

/**
 * Copy do topo da página (fixa, acima do form). A promessa é a aula gratuita
 * (= LP da 3DM); o título e a frase das 3 dimensões vêm do hero da própria
 * LP, pra a pessoa reconhecer a promessa quando chegar lá. E-book = bônus.
 */
export const HERO = {
  kicker: "Aula gratuita",
  title: { lead: "Aprenda a nunca mais ser o último a descobrir", accent: "a mentira." },
  sub: "O problema não é que você não percebe a mentira. É que você só percebe uma das três dimensões dela. Na aula gratuita eu te mostro as três.",
  bonus: "De bônus: o e-book Por Que Qualquer Mentira Funciona Com Você?",
} as const;

/**
 * Copy da tela de liberação (depois de preencher). Dois botões: a aula
 * gratuita (LP da 3DM) em destaque e o e-book como bônus.
 */
export const REVEAL = {
  kicker: "Acesso liberado",
  headline: "Pronto, {nome}. Seu acesso está liberado.",
  aulaKicker: "Aula gratuita",
  aulaTitle: "As Três Dimensões da Mentira",
  aulaLabel: "Assistir à aula gratuita",
  bonusKicker: "Bônus · E-book gratuito",
  pdfTitle: "Por Que Qualquer Mentira Funciona Com Você?",
  pdfDesc: "Os 3 mecanismos que te deixam vulnerável — e como desativar cada um.",
  downloadLabel: "Baixar o e-book",
} as const;

/** Mensagens do micro-loader antes de liberar (rápido — não é processamento real). */
export const LOADER_STEPS = ["Liberando seu acesso…"] as const;
