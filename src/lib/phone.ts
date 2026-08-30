export const TR_MOBILE_ERROR = "Geçerli bir cep telefonu girin (05xx xxx xx xx).";
export const TR_MOBILE_HINT = "Cep telefonu: 05xx xxx xx xx. Sabit hat kabul edilmez.";
export const TR_MOBILE_PLACEHOLDER = "05xx xxx xx xx";

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Türkiye cep: 05xx, +90 5xx, 90 5xx, 5xx. Kayıt 05XXXXXXXXX olarak saklanır. */
export function normalizeTrMobile(input: string): string | null {
  let digits = digitsOnly(input);
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("90") && digits.length >= 12) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (!/^5\d{9}$/.test(digits)) return null;
  return `0${digits}`;
}
