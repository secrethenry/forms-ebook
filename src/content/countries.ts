/**
 * Países + código de discagem (DDI) para o seletor do campo de WhatsApp.
 *
 * Ordem deliberada: Brasil primeiro (é o padrão e ~95% do público), depois os
 * países mais prováveis de um lead internacional do Henrique, e então o resto
 * em ordem alfabética. O NOME vem antes da bandeira de propósito: o seletor
 * nativo (`<select>`) pula por digitação a partir do início do texto — com a
 * bandeira na frente, digitar "Portu" não acharia Portugal.
 *
 * `dial` é só dígitos, sem o "+". Vários países compartilham o mesmo DDI
 * (EUA/Canadá = 1; Rússia/Cazaquistão = 7) — por isso a chave é o ISO `code`,
 * não o DDI. Pro E.164 tanto faz qual país do +1: o número é 1XXXXXXXXXX.
 */

export type Country = {
  /** ISO 3166-1 alpha-2. Chave única (o DDI não é único). */
  code: string;
  /** Nome em português, exibido no seletor. */
  name: string;
  /** Código de discagem (DDI), só dígitos. */
  dial: string;
  /** Bandeira (emoji regional indicator). */
  flag: string;
};

export const COUNTRIES: Country[] = [
  // Brasil primeiro (padrão)
  { code: "BR", name: "Brasil", dial: "55", flag: "🇧🇷" },

  // Mais prováveis pra este público
  { code: "PT", name: "Portugal", dial: "351", flag: "🇵🇹" },
  { code: "US", name: "Estados Unidos", dial: "1", flag: "🇺🇸" },
  { code: "CA", name: "Canadá", dial: "1", flag: "🇨🇦" },
  { code: "GB", name: "Reino Unido", dial: "44", flag: "🇬🇧" },
  { code: "ES", name: "Espanha", dial: "34", flag: "🇪🇸" },
  { code: "AR", name: "Argentina", dial: "54", flag: "🇦🇷" },
  { code: "MX", name: "México", dial: "52", flag: "🇲🇽" },
  { code: "CO", name: "Colômbia", dial: "57", flag: "🇨🇴" },
  { code: "CL", name: "Chile", dial: "56", flag: "🇨🇱" },
  { code: "PE", name: "Peru", dial: "51", flag: "🇵🇪" },
  { code: "UY", name: "Uruguai", dial: "598", flag: "🇺🇾" },
  { code: "PY", name: "Paraguai", dial: "595", flag: "🇵🇾" },
  { code: "BO", name: "Bolívia", dial: "591", flag: "🇧🇴" },
  { code: "EC", name: "Equador", dial: "593", flag: "🇪🇨" },
  { code: "VE", name: "Venezuela", dial: "58", flag: "🇻🇪" },
  { code: "AO", name: "Angola", dial: "244", flag: "🇦🇴" },
  { code: "MZ", name: "Moçambique", dial: "258", flag: "🇲🇿" },
  { code: "CV", name: "Cabo Verde", dial: "238", flag: "🇨🇻" },
  { code: "FR", name: "França", dial: "33", flag: "🇫🇷" },
  { code: "DE", name: "Alemanha", dial: "49", flag: "🇩🇪" },
  { code: "IT", name: "Itália", dial: "39", flag: "🇮🇹" },
  { code: "CH", name: "Suíça", dial: "41", flag: "🇨🇭" },
  { code: "IE", name: "Irlanda", dial: "353", flag: "🇮🇪" },
  { code: "NL", name: "Países Baixos", dial: "31", flag: "🇳🇱" },
  { code: "JP", name: "Japão", dial: "81", flag: "🇯🇵" },
  { code: "AU", name: "Austrália", dial: "61", flag: "🇦🇺" },

  // Resto, em ordem alfabética
  { code: "ZA", name: "África do Sul", dial: "27", flag: "🇿🇦" },
  { code: "AL", name: "Albânia", dial: "355", flag: "🇦🇱" },
  { code: "SA", name: "Arábia Saudita", dial: "966", flag: "🇸🇦" },
  { code: "DZ", name: "Argélia", dial: "213", flag: "🇩🇿" },
  { code: "AM", name: "Armênia", dial: "374", flag: "🇦🇲" },
  { code: "AT", name: "Áustria", dial: "43", flag: "🇦🇹" },
  { code: "AZ", name: "Azerbaijão", dial: "994", flag: "🇦🇿" },
  { code: "BS", name: "Bahamas", dial: "1", flag: "🇧🇸" },
  { code: "BH", name: "Bahrein", dial: "973", flag: "🇧🇭" },
  { code: "BD", name: "Bangladesh", dial: "880", flag: "🇧🇩" },
  { code: "BE", name: "Bélgica", dial: "32", flag: "🇧🇪" },
  { code: "BZ", name: "Belize", dial: "501", flag: "🇧🇿" },
  { code: "BY", name: "Bielorrússia", dial: "375", flag: "🇧🇾" },
  { code: "BA", name: "Bósnia e Herzegovina", dial: "387", flag: "🇧🇦" },
  { code: "BW", name: "Botsuana", dial: "267", flag: "🇧🇼" },
  { code: "BG", name: "Bulgária", dial: "359", flag: "🇧🇬" },
  { code: "KH", name: "Camboja", dial: "855", flag: "🇰🇭" },
  { code: "CM", name: "Camarões", dial: "237", flag: "🇨🇲" },
  { code: "QA", name: "Catar", dial: "974", flag: "🇶🇦" },
  { code: "KZ", name: "Cazaquistão", dial: "7", flag: "🇰🇿" },
  { code: "CN", name: "China", dial: "86", flag: "🇨🇳" },
  { code: "CY", name: "Chipre", dial: "357", flag: "🇨🇾" },
  { code: "KR", name: "Coreia do Sul", dial: "82", flag: "🇰🇷" },
  { code: "CR", name: "Costa Rica", dial: "506", flag: "🇨🇷" },
  { code: "CI", name: "Costa do Marfim", dial: "225", flag: "🇨🇮" },
  { code: "HR", name: "Croácia", dial: "385", flag: "🇭🇷" },
  { code: "CU", name: "Cuba", dial: "53", flag: "🇨🇺" },
  { code: "DK", name: "Dinamarca", dial: "45", flag: "🇩🇰" },
  { code: "EG", name: "Egito", dial: "20", flag: "🇪🇬" },
  { code: "SV", name: "El Salvador", dial: "503", flag: "🇸🇻" },
  { code: "AE", name: "Emirados Árabes Unidos", dial: "971", flag: "🇦🇪" },
  { code: "SK", name: "Eslováquia", dial: "421", flag: "🇸🇰" },
  { code: "SI", name: "Eslovênia", dial: "386", flag: "🇸🇮" },
  { code: "EE", name: "Estônia", dial: "372", flag: "🇪🇪" },
  { code: "ET", name: "Etiópia", dial: "251", flag: "🇪🇹" },
  { code: "PH", name: "Filipinas", dial: "63", flag: "🇵🇭" },
  { code: "FI", name: "Finlândia", dial: "358", flag: "🇫🇮" },
  { code: "GA", name: "Gabão", dial: "241", flag: "🇬🇦" },
  { code: "GH", name: "Gana", dial: "233", flag: "🇬🇭" },
  { code: "GE", name: "Geórgia", dial: "995", flag: "🇬🇪" },
  { code: "GR", name: "Grécia", dial: "30", flag: "🇬🇷" },
  { code: "GT", name: "Guatemala", dial: "502", flag: "🇬🇹" },
  { code: "GW", name: "Guiné-Bissau", dial: "245", flag: "🇬🇼" },
  { code: "HT", name: "Haiti", dial: "509", flag: "🇭🇹" },
  { code: "HN", name: "Honduras", dial: "504", flag: "🇭🇳" },
  { code: "HK", name: "Hong Kong", dial: "852", flag: "🇭🇰" },
  { code: "HU", name: "Hungria", dial: "36", flag: "🇭🇺" },
  { code: "YE", name: "Iêmen", dial: "967", flag: "🇾🇪" },
  { code: "IN", name: "Índia", dial: "91", flag: "🇮🇳" },
  { code: "ID", name: "Indonésia", dial: "62", flag: "🇮🇩" },
  { code: "IR", name: "Irã", dial: "98", flag: "🇮🇷" },
  { code: "IQ", name: "Iraque", dial: "964", flag: "🇮🇶" },
  { code: "IS", name: "Islândia", dial: "354", flag: "🇮🇸" },
  { code: "IL", name: "Israel", dial: "972", flag: "🇮🇱" },
  { code: "JM", name: "Jamaica", dial: "1", flag: "🇯🇲" },
  { code: "JO", name: "Jordânia", dial: "962", flag: "🇯🇴" },
  { code: "KW", name: "Kuwait", dial: "965", flag: "🇰🇼" },
  { code: "LA", name: "Laos", dial: "856", flag: "🇱🇦" },
  { code: "LV", name: "Letônia", dial: "371", flag: "🇱🇻" },
  { code: "LB", name: "Líbano", dial: "961", flag: "🇱🇧" },
  { code: "LY", name: "Líbia", dial: "218", flag: "🇱🇾" },
  { code: "LI", name: "Liechtenstein", dial: "423", flag: "🇱🇮" },
  { code: "LT", name: "Lituânia", dial: "370", flag: "🇱🇹" },
  { code: "LU", name: "Luxemburgo", dial: "352", flag: "🇱🇺" },
  { code: "MO", name: "Macau", dial: "853", flag: "🇲🇴" },
  { code: "MK", name: "Macedônia do Norte", dial: "389", flag: "🇲🇰" },
  { code: "MY", name: "Malásia", dial: "60", flag: "🇲🇾" },
  { code: "MT", name: "Malta", dial: "356", flag: "🇲🇹" },
  { code: "MA", name: "Marrocos", dial: "212", flag: "🇲🇦" },
  { code: "MU", name: "Maurício", dial: "230", flag: "🇲🇺" },
  { code: "MD", name: "Moldávia", dial: "373", flag: "🇲🇩" },
  { code: "MC", name: "Mônaco", dial: "377", flag: "🇲🇨" },
  { code: "MN", name: "Mongólia", dial: "976", flag: "🇲🇳" },
  { code: "ME", name: "Montenegro", dial: "382", flag: "🇲🇪" },
  { code: "NP", name: "Nepal", dial: "977", flag: "🇳🇵" },
  { code: "NI", name: "Nicarágua", dial: "505", flag: "🇳🇮" },
  { code: "NG", name: "Nigéria", dial: "234", flag: "🇳🇬" },
  { code: "NO", name: "Noruega", dial: "47", flag: "🇳🇴" },
  { code: "NZ", name: "Nova Zelândia", dial: "64", flag: "🇳🇿" },
  { code: "OM", name: "Omã", dial: "968", flag: "🇴🇲" },
  { code: "PA", name: "Panamá", dial: "507", flag: "🇵🇦" },
  { code: "PK", name: "Paquistão", dial: "92", flag: "🇵🇰" },
  { code: "PL", name: "Polônia", dial: "48", flag: "🇵🇱" },
  { code: "PR", name: "Porto Rico", dial: "1", flag: "🇵🇷" },
  { code: "KE", name: "Quênia", dial: "254", flag: "🇰🇪" },
  { code: "CZ", name: "República Tcheca", dial: "420", flag: "🇨🇿" },
  { code: "DO", name: "República Dominicana", dial: "1", flag: "🇩🇴" },
  { code: "RO", name: "Romênia", dial: "40", flag: "🇷🇴" },
  { code: "RW", name: "Ruanda", dial: "250", flag: "🇷🇼" },
  { code: "RU", name: "Rússia", dial: "7", flag: "🇷🇺" },
  { code: "SN", name: "Senegal", dial: "221", flag: "🇸🇳" },
  { code: "RS", name: "Sérvia", dial: "381", flag: "🇷🇸" },
  { code: "SG", name: "Singapura", dial: "65", flag: "🇸🇬" },
  { code: "SY", name: "Síria", dial: "963", flag: "🇸🇾" },
  { code: "LK", name: "Sri Lanka", dial: "94", flag: "🇱🇰" },
  { code: "SD", name: "Sudão", dial: "249", flag: "🇸🇩" },
  { code: "SE", name: "Suécia", dial: "46", flag: "🇸🇪" },
  { code: "ST", name: "São Tomé e Príncipe", dial: "239", flag: "🇸🇹" },
  { code: "TH", name: "Tailândia", dial: "66", flag: "🇹🇭" },
  { code: "TW", name: "Taiwan", dial: "886", flag: "🇹🇼" },
  { code: "TZ", name: "Tanzânia", dial: "255", flag: "🇹🇿" },
  { code: "TL", name: "Timor-Leste", dial: "670", flag: "🇹🇱" },
  { code: "TT", name: "Trinidad e Tobago", dial: "1", flag: "🇹🇹" },
  { code: "TN", name: "Tunísia", dial: "216", flag: "🇹🇳" },
  { code: "TR", name: "Turquia", dial: "90", flag: "🇹🇷" },
  { code: "UA", name: "Ucrânia", dial: "380", flag: "🇺🇦" },
  { code: "UG", name: "Uganda", dial: "256", flag: "🇺🇬" },
  { code: "VN", name: "Vietnã", dial: "84", flag: "🇻🇳" },
  { code: "ZM", name: "Zâmbia", dial: "260", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbábue", dial: "263", flag: "🇿🇼" },
];

const BY_CODE: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c]),
);

export const DEFAULT_COUNTRY = "BR";

export function countryByCode(code: string): Country {
  return BY_CODE[code] ?? BY_CODE[DEFAULT_COUNTRY];
}

export function dialFor(code: string): string {
  return countryByCode(code).dial;
}
