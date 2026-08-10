/**
 * Lead — validação, atribuição e envio pro Google Sheets.
 *
 * Tudo roda no client (o site é `output: "export"`, não há API route).
 * O envio vai pro Apps Script publicado como Web App — ver
 * `scripts/apps-script-planilha-guia.gs` e o README para o passo a passo.
 *
 * Versão do lead magnet: só nome, e-mail e WhatsApp. Sem score/roteamento.
 */
import { LEADS_ENDPOINT } from "@/lib/constants";
import type { FieldName } from "@/content/form";

export type Answers = Partial<Record<FieldName, string>>;

/* ────────────────────────────── WhatsApp ────────────────────────────── */

/** DDI do Brasil — padrão do formulário e caminho da validação estrita. */
export const BR_DIAL = "55";

/** DDDs válidos no Brasil (Anatel). Só usado quando o país é o Brasil. */
const DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43,
  44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77,
  79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/** O usuário digitou o número já em formato internacional (com o "+" na frente)? */
function isIntlFormat(value: string) {
  return value.trim().startsWith("+");
}

/**
 * Máscara do campo, por país.
 * - Brasil: máscara progressiva `(11) 99999-9999`.
 * - Demais países: sem formato forçado (cada país tem o seu). Só limpa e limita.
 *   Preserva um "+" inicial — sinal de que o número já vem completo (com DDI).
 *   O teto de dígitos respeita o DDI: o E.164 tem no máximo 15 dígitos no total.
 */
export function maskPhone(value: string, dial: string = BR_DIAL) {
  if (dial === BR_DIAL) {
    const br = digitsOnly(value).slice(0, 11);
    if (br.length <= 2) return br.length ? `(${br}` : "";
    if (br.length <= 7) return `(${br.slice(0, 2)}) ${br.slice(2)}`;
    return `(${br.slice(0, 2)}) ${br.slice(2, 7)}-${br.slice(7)}`;
  }

  const intl = isIntlFormat(value);
  const max = intl ? 15 : 15 - digitsOnly(dial).length;
  return (intl ? "+" : "") + digitsOnly(value).slice(0, max);
}

/**
 * Valida o número segundo o país (DDI).
 * - Brasil: regra estrita (11 dígitos, DDD válido, 9º dígito).
 * - Demais países: regra branda alinhada ao E.164 — o total (DDI + número
 *   nacional) precisa caber entre 8 e 15 dígitos. Não barrar ninguém é o alvo.
 */
export function validatePhone(national: string, dial: string = BR_DIAL): string | null {
  const d = digitsOnly(national);

  if (dial === BR_DIAL) {
    if (d.length < 11) return "Faltam dígitos. Precisa ser DDD + 9 números.";
    if (d.length > 11) return "Número longo demais. DDD + 9 números.";
    if (!DDDS.has(Number(d.slice(0, 2)))) return "Esse DDD não existe. Confere aí.";
    if (d[2] !== "9") return "Celular no Brasil começa com 9 depois do DDD.";
    return null;
  }

  if (!d) return "Digite o número do seu WhatsApp.";
  const total = isIntlFormat(national) ? d.length : digitsOnly(dial).length + d.length;
  if (total < 8) return "Número curto demais. Confere o código do país e o número.";
  if (total > 15) return "Número longo demais. Confere aí.";
  return null;
}

/**
 * E.164 sem o `+`: DDI + número nacional (só dígitos). É o que o WhatsApp usa.
 * Se o usuário já digitou o número internacional (com "+"), os dígitos já
 * contêm o DDI — não prefixar de novo.
 */
export function toE164(national: string, dial: string = BR_DIAL) {
  const d = digitsOnly(national);
  if (dial !== BR_DIAL && isIntlFormat(national)) return d;
  return `${digitsOnly(dial)}${d}`;
}

/* ─────────────────────────────── E-mail ─────────────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const DOMAIN_TYPOS: Record<string, string> = {
  "gmail.con": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.com.br": "gmail.com",
  "gmai.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmail.vom": "gmail.com",
  "gnail.com": "gmail.com",
  "hotmail.con": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "hotmail.cm": "hotmail.com",
  "outlook.con": "outlook.com",
  "outlok.com": "outlook.com",
  "yahoo.con": "yahoo.com",
  "yaho.com": "yahoo.com",
  "icloud.con": "icloud.com",
  "bol.com": "bol.com.br",
  "uol.com": "uol.com.br",
};

export function validateEmail(value: string): string | null {
  if (!EMAIL_RE.test(value.trim())) return "Esse e-mail não parece completo.";
  return null;
}

/** Sugere correção de domínio digitado errado. `null` = nada a sugerir. */
export function suggestEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 0) return null;
  const domain = email.slice(at + 1);
  const fixed = DOMAIN_TYPOS[domain];
  return fixed ? `${email.slice(0, at)}@${fixed}` : null;
}

/* ──────────────────────────────── Nome ──────────────────────────────── */

export function validateName(value: string): string | null {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (value.trim().length < 5 || parts.length < 2) return "Nome e sobrenome, por favor.";
  return null;
}

export function firstName(value = "") {
  return value.trim().split(/\s+/)[0] ?? "";
}

/* ───────────────────────────── Atribuição ───────────────────────────── */

export type Attribution = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  fbclid: string;
  gclid: string;
  referrer: string;
};

const ATTR_KEY = "guia_attr";
const SESSION_KEY = "guia_sid";

/** Primeira atribuição, persistida — sobrevive a refresh e a navegação. */
export function captureAttribution(): Attribution {
  const empty: Attribution = {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
    fbclid: "",
    gclid: "",
    referrer: "",
  };
  if (typeof window === "undefined") return empty;

  try {
    const saved = localStorage.getItem(ATTR_KEY);
    if (saved) return { ...empty, ...(JSON.parse(saved) as Partial<Attribution>) };
  } catch {
    /* localStorage bloqueado (webview/privado) — segue sem persistir */
  }

  const q = new URLSearchParams(window.location.search);
  const attr: Attribution = {
    utm_source: q.get("utm_source") ?? "",
    utm_medium: q.get("utm_medium") ?? "",
    utm_campaign: q.get("utm_campaign") ?? "",
    utm_content: q.get("utm_content") ?? "",
    utm_term: q.get("utm_term") ?? "",
    fbclid: q.get("fbclid") ?? "",
    gclid: q.get("gclid") ?? "",
    referrer: document.referrer ?? "",
  };

  try {
    localStorage.setItem(ATTR_KEY, JSON.stringify(attr));
  } catch {
    /* idem */
  }
  return attr;
}

export function sessionId() {
  if (typeof window === "undefined") return "";
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) return saved;
    const id =
      typeof crypto?.randomUUID === "function"
        ? crypto.randomUUID()
        : `s_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return `s_${Date.now()}`;
  }
}

/* ─────────────────────────────── Envio ──────────────────────────────── */

export type LeadStatus = "parcial" | "completo";

export type LeadPayload = {
  session_id: string;
  nome: string;
  email: string;
  whatsapp: string;
} & Attribution;

export function buildPayload(answers: Answers): LeadPayload {
  return {
    session_id: sessionId(),
    nome: answers.nome?.trim() ?? "",
    email: answers.email?.trim().toLowerCase() ?? "",
    // answers.whatsapp já vem em E.164 (DDI + nacional) do seletor de país.
    whatsapp: digitsOnly(answers.whatsapp ?? ""),
    ...captureAttribution(),
  };
}

/**
 * Envia pro Apps Script. `text/plain` de propósito: mantém a requisição
 * "simples" (sem preflight CORS), que é o único jeito de o Apps Script
 * responder sem configuração extra.
 *
 * Nunca lança: liberar o guia não pode depender da gravação. Se o envio falhar,
 * o PDF é liberado do mesmo jeito — o dedup por session_id cobre reenvios.
 */
export async function submitLead(payload: LeadPayload): Promise<boolean> {
  if (!LEADS_ENDPOINT) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[lead] LEADS_ENDPOINT vazio — payload:", payload);
    }
    return false;
  }

  try {
    const res = await fetch(LEADS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}
