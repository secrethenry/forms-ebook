/**
 * Constantes da página de captura do Guia (PDF).
 *
 * ⚠️ LEADS_ENDPOINT é o único PREENCHER pra ir ao ar. Ver README.md e
 * `scripts/apps-script-planilha-guia.gs`.
 */

/**
 * URL /exec do Apps Script da planilha nova (aba "Leads"). Grava cada lead.
 * Verificado em 2026-07-29: insert + update (dedup por session_id).
 *
 * ⚠️ Se editar o .gs, crie uma NOVA VERSÃO da implantação — senão o site
 * continua chamando a versão antiga.
 */
export const LEADS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwOxhvTGY92ECbzvaT1fcdYUIgYCHdzejd3uvpVS9mjGSAKaR5Eusbx0qX_ITHZU1ZjKQ/exec";

/**
 * PDF entregue (Google Drive) — botão de download na tela de liberação.
 * Link `/view` abre o preview do Drive, de onde a pessoa baixa (mesmo link que
 * a página de PDF Delivery antiga usava).
 */
export const PDF_URL = "https://drive.google.com/file/d/1Czged74APqvu9M-beaWdY1U97U0lzyNv/view";

/**
 * "Aula gratuita" = a landing page da 3DM (com a VSL). É o botão principal da
 * tela de liberação; o e-book entra como bônus logo abaixo. Decisão do
 * Henrique em 2026-11-12.
 */
export const AULA_URL = "https://3dm.jogodecorpo.com.br";
