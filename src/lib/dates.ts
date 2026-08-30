/** Turkey has no DST; clinic hours are Europe/Istanbul (UTC+3). */
export const TIMEZONE = "Europe/Istanbul";
export const ISTANBUL_OFFSET = "+03:00";

export function istanbulDateTime(ymd: string, hhmm: string): Date {
  return new Date(`${ymd}T${hhmm}:00${ISTANBUL_OFFSET}`);
}

export function ymdInIstanbul(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function todayYmd(): string {
  return ymdInIstanbul(new Date());
}

export function weekdayFromYmd(ymd: string): number {
  return istanbulDateTime(ymd, "12:00").getUTCDay();
}

export function addDaysYmd(ymd: string, days: number): string {
  const date = istanbulDateTime(ymd, "12:00");
  date.setUTCDate(date.getUTCDate() + days);
  return ymdInIstanbul(date);
}

export function formatTimeIstanbul(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateLong(ymd: string): string {
  const date = istanbulDateTime(ymd, "12:00");
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "long",
  }).format(date);
}

export function hmFromDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";
  return `${hour}:${minute}`;
}

export const WEEKDAY_LABELS = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
];

export function weekdayLabel(weekday: number): string {
  return WEEKDAY_LABELS[weekday] ?? "";
}

export function parseHm(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToHm(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function monthGrid(year: number, monthIndex: number): (string | null)[] {
  const firstYmd = `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`;
  const firstWeekday = weekdayFromYmd(firstYmd);
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(`${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function splitYmd(ymd: string): { year: number; monthIndex: number; day: number } {
  const [year, month, day] = ymd.split("-").map(Number);
  return { year, monthIndex: month - 1, day };
}
