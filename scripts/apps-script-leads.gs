/**
 * Diagnóstico das 3 Dimensões — receptor de leads no Google Sheets.
 *
 * ┌─ COMO PUBLICAR ────────────────────────────────────────────────────┐
 * │ 1. Crie uma planilha nova no Google Sheets.                        │
 * │ 2. Extensões → Apps Script. Apague o conteúdo e cole ESTE arquivo. │
 * │ 3. Salve. Rode a função `setup` uma vez (cria o cabeçalho e pede   │
 * │    a autorização da sua conta).                                    │
 * │ 4. Implantar → Nova implantação → tipo "App da Web".               │
 * │      Executar como:  Eu                                            │
 * │      Quem pode acessar:  QUALQUER PESSOA   ← precisa ser este      │
 * │ 5. Copie a URL /exec gerada e cole em `src/lib/constants.ts`       │
 * │    na constante LEADS_ENDPOINT.                                    │
 * │                                                                    │
 * │ ⚠️ Toda vez que editar este script, crie uma NOVA VERSÃO da        │
 * │    implantação — senão o site continua chamando a versão antiga.   │
 * └────────────────────────────────────────────────────────────────────┘
 *
 * Dedup: o formulário envia duas vezes — "parcial" (assim que captura o
 * contato) e "completo" (depois da renda). As duas trazem o mesmo session_id;
 * a segunda ATUALIZA a linha da primeira em vez de duplicar. É isso que faz o
 * abandono na última pergunta continuar valendo como lead.
 */

var SHEET_NAME = 'Leads';

var HEADERS = [
  'recebido_em',
  'status',
  'nome',
  'whatsapp',
  'email',
  'contexto',
  'dor',
  'renda',
  'score',
  'rota',
  'prioridade',
  'dimensao',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
  'referrer',
  'session_id',
];

/** Rode uma vez na mão: cria a aba, o cabeçalho e dispara a autorização. */
function setup() {
  var sheet = getSheet_();
  SpreadsheetApp.getActiveSpreadsheet().toast('Planilha pronta: aba "' + SHEET_NAME + '".');
  return sheet.getName();
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/** Health check — abrir a URL /exec no navegador deve responder ok:true. */
function doGet() {
  return json_({ ok: true, service: 'diagnostico-3dm' });
}

function doPost(e) {
  // Um lock evita que dois envios simultâneos gravem na mesma linha.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return json_({ ok: false, error: 'busy' });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: 'empty' });
    }

    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();

    var row = HEADERS.map(function (key) {
      if (key === 'recebido_em') return new Date();
      var value = data[key];
      return value === undefined || value === null ? '' : value;
    });

    var updated = upsert_(sheet, data.session_id, row);
    return json_({ ok: true, mode: updated ? 'update' : 'insert' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Grava a linha. Se já existe uma com o mesmo session_id, sobrescreve —
 * o "completo" substitui o "parcial" do mesmo lead.
 */
function upsert_(sheet, sessionId, row) {
  if (!sessionId) {
    sheet.appendRow(row);
    return false;
  }

  var sessionCol = HEADERS.indexOf('session_id') + 1;
  var lastRow = sheet.getLastRow();

  if (lastRow > 1) {
    var ids = sheet.getRange(2, sessionCol, lastRow - 1, 1).getValues();
    for (var i = ids.length - 1; i >= 0; i--) {
      if (String(ids[i][0]) === String(sessionId)) {
        sheet.getRange(i + 2, 1, 1, HEADERS.length).setValues([row]);
        return true;
      }
    }
  }

  sheet.appendRow(row);
  return false;
}
