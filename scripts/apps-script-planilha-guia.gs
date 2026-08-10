/**
 * Captura de leads do Guia (PDF "Por Que Qualquer Mentira Funciona Com Você?")
 * — receptor no Google Sheets.
 *
 * ┌─ COMO PUBLICAR (na SUA planilha nova) ─────────────────────────────┐
 * │ 1. Abra a planilha nova que você já criou.                         │
 * │ 2. Extensões → Apps Script. Apague tudo e cole ESTE arquivo.       │
 * │ 3. Salve. Rode a função `setup` uma vez (cria o cabeçalho e pede   │
 * │    a autorização da sua conta Google).                             │
 * │      Avançado → Acessar (não seguro) → Permitir.                   │
 * │ 4. Implantar → Nova implantação → tipo "App da Web".               │
 * │      Executar como:  Eu                                            │
 * │      Quem pode acessar:  QUALQUER PESSOA   ← precisa ser este      │
 * │ 5. Copie a URL /exec gerada e me mande.                            │
 * │                                                                    │
 * │ ⚠️ Toda vez que editar este script, crie uma NOVA VERSÃO da        │
 * │    implantação — senão o site continua chamando a versão antiga.   │
 * └────────────────────────────────────────────────────────────────────┘
 *
 * Colunas: contato (nome/email/whatsapp) + atribuição (de onde o lead veio).
 * Dedup por session_id: reenvio do mesmo visitante atualiza a linha, não duplica.
 */

var SHEET_NAME = 'Leads';

var HEADERS = [
  'recebido_em',
  'nome',
  'email',
  'whatsapp',
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
  return json_({ ok: true, service: 'guia-pdf-leads' });
}

function doPost(e) {
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

/** Grava a linha; se já existe uma com o mesmo session_id, sobrescreve. */
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
