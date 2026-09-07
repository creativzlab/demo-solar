const BRAZILIAN_DDDS = new Set([
  "11", "12", "13", "14", "15", "16", "17", "18", "19",
  "21", "22", "24", "27", "28",
  "31", "32", "33", "34", "35", "37", "38",
  "41", "42", "43", "44", "45", "46", "47", "48", "49",
  "51", "53", "54", "55",
  "61", "62", "63", "64", "65", "66", "67", "68", "69",
  "71", "73", "74", "75", "77", "79",
  "81", "82", "83", "84", "85", "86", "87", "88", "89",
  "91", "92", "93", "94", "95", "96", "97", "98", "99",
]);

function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function brazilianNationalPhoneDigits(value: string) {
  const digits = phoneDigits(value);

  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    return digits.slice(2);
  }

  return digits;
}

export function formatBrazilianNationalPhone(value: string) {
  const digits = brazilianNationalPhoneDigits(value).slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;

  const ddd = digits.slice(0, 2);
  const subscriber = digits.slice(2);
  if (subscriber.length <= 4) return `(${ddd}) ${subscriber}`;

  const prefixLength = subscriber.length === 9 ? 5 : 4;
  return `(${ddd}) ${subscriber.slice(0, prefixLength)}-${subscriber.slice(prefixLength)}`;
}

export function isValidBrazilianPhone(value: string) {
  const digits = brazilianNationalPhoneDigits(value);
  if (digits.length !== 10 && digits.length !== 11) return false;

  const ddd = digits.slice(0, 2);
  const subscriber = digits.slice(2);
  if (!BRAZILIAN_DDDS.has(ddd) || /^(\d)\1+$/.test(subscriber)) return false;

  if (digits.length === 11) return /^9\d{8}$/.test(subscriber);
  return /^[2-5]\d{7}$/.test(subscriber);
}

export function normalizeBrazilianPhone(value: string) {
  return `+55${brazilianNationalPhoneDigits(value)}`;
}
