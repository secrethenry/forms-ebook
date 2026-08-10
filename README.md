# Guia (PDF) — página de captura

Página enxuta: copy + formulário de 3 campos (uma pergunta por tela: nome →
e-mail → WhatsApp). Ao terminar, **libera o PDF ali mesmo** (sem redirecionar)
+ oferece o curso. Grava os leads numa planilha própria (Google Sheets).

Substitui o formulário da Brevo. **Sem Brevo, sem Pixel, sem Clarity** — captura
simples e limpa.

> Cópia do projeto do diagnóstico (`LP 3DM - FORM`), enxugada. Reaproveita o
> campo de WhatsApp internacional (seletor de 130 países).

---

## ⚠️ Setup antes de publicar

### 1. Planilha de leads (obrigatório)

Sem isto a página abre e libera o PDF normalmente, mas **nenhum lead é gravado**.

1. Abra a planilha nova que você já criou.
2. **Extensões → Apps Script**. Apague tudo e cole o conteúdo de
   [`scripts/apps-script-planilha-guia.gs`](scripts/apps-script-planilha-guia.gs).
3. Salve e rode a função `setup` uma vez (cria o cabeçalho + pede autorização:
   Avançado → Acessar (não seguro) → Permitir).
4. **Implantar → Nova implantação → App da Web**:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa** ← precisa ser este
5. Copie a URL `/exec` e cole em `LEADS_ENDPOINT` (`src/lib/constants.ts`).

> Toda vez que editar o `.gs`, crie uma **nova versão** da implantação.

### 2. Subdomínio (Cloudflare Pages)

Deploy automático a cada push. Build `pnpm build`, output `out`, Node 20+.
Aponte o subdomínio (sugestão `guia.jogodecorpo.com.br`) e, se usar outro,
troque `SITE_URL` em `src/lib/seo.ts`.

---

## O que já vem pronto (não precisa mexer)

| Constante (`src/lib/constants.ts`) | Valor |
|---|---|
| `PDF_URL` | link do Drive do guia (botão de download) |
| `COURSE_URL` | `3dm.jogodecorpo.com.br` (upsell após o PDF) |

---

## O formulário

3 perguntas, uma por tela: **nome → e-mail → WhatsApp**.

- Nome: valida nome + sobrenome.
- E-mail: valida + corretor de typo de domínio (gmial → gmail). **O lead é
  salvo aqui** (parcial) — se a pessoa desistir no WhatsApp, nome + e-mail ficam.
- WhatsApp: seletor de país (Brasil padrão). BR estrito; demais países E.164.
- Ao terminar: grava o `completo` (mesma linha, dedup por `session_id`) e
  **libera o PDF na tela** + upsell do curso.

Colunas na planilha: `recebido_em, nome, email, whatsapp` + atribuição
(`utm_*`, `fbclid`, `gclid`, `referrer`, `session_id`).

Validado com `tsc`, `eslint`, `next build` limpos + teste end-to-end no browser
(BR e Portugal, captura parcial, reveal com download + upsell).

---

## Estrutura

- `src/app/page.tsx` — copy do topo + `<GuiaForm/>`.
- `src/content/form.ts` — as 3 perguntas + copy do topo e da liberação.
- `src/components/landing/guia-form.tsx` — o form (uma pergunta por vez) + reveal.
- `src/lib/lead.ts` — validação, WhatsApp internacional, atribuição, envio.
- `src/content/countries.ts` — 130 países do seletor de WhatsApp.
- `scripts/apps-script-planilha-guia.gs` — receptor no Google Sheets.

> **Regra:** a promessa é o PDF na tela + o upsell. Não reintroduzir Brevo,
> Pixel ou Clarity sem pedido explícito.
