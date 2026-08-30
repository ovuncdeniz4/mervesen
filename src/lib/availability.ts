import type { Appointment, BlockedSlot, ClinicSettings, WorkingHours } from "@prisma/client";
import {
  addDaysYmd,
  istanbulDateTime,
  todayYmd,
  ymdInIstanbul,
} from "@/lib/dates";

export type SlotDto = {
  startAt: string;
  endAt: string;
  label: string;
};

type Range = { startAt: Date; endAt: Date };

function overlaps(a: Range, b: Range): boolean {
  return a.startAt < b.endAt && a.endAt > b.startAt;
}

export function rangesOverlap(
  startAt: Date,
  endAt: Date,
  busy: Range[],
): boolean {
  return busy.some((item) => overlaps({ startAt, endAt }, item));
}

export function computeSlotsForDay(options: {
  ymd: string;
  durationMin: number;
  settings: ClinicSettings;
  hours: WorkingHours | undefined;
  appointments: Range[];
  blocks: Range[];
  now?: Date;
}): SlotDto[] {
  const { ymd, durationMin, settings, hours, appointments, blocks, now = new Date() } = options;
  if (!hours || hours.closed) return [];

  const today = todayYmd();
  if (ymd < today) return [];
  const maxYmd = addDaysYmd(today, settings.maxAdvanceDays);
  if (ymd > maxYmd) return [];

  const dayStart = istanbulDateTime(ymd, hours.startTime);
  const dayEnd = istanbulDateTime(ymd, hours.endTime);
  const minStart = new Date(now.getTime() + settings.minNoticeHours * 60 * 60 * 1000);
  const interval = Math.max(15, settings.slotIntervalMin);
  const durationMs = durationMin * 60 * 1000;
  const intervalMs = interval * 60 * 1000;

  const extraBusy: Range[] = [...appointments, ...blocks];
  if (hours.breakStart && hours.breakEnd) {
    extraBusy.push({
      startAt: istanbulDateTime(ymd, hours.breakStart),
      endAt: istanbulDateTime(ymd, hours.breakEnd),
    });
  }

  const slots: SlotDto[] = [];
  for (let t = dayStart.getTime(); t + durationMs <= dayEnd.getTime(); t += intervalMs) {
    const startAt = new Date(t);
    const endAt = new Date(t + durationMs);
    if (startAt < minStart) continue;
    if (rangesOverlap(startAt, endAt, extraBusy)) continue;
    const label = new Intl.DateTimeFormat("tr-TR", {
      timeZone: "Europe/Istanbul",
      hour: "2-digit",
      minute: "2-digit",
    }).format(startAt);
    slots.push({ startAt: startAt.toISOString(), endAt: endAt.toISOString(), label });
  }
  return slots;
}

export function isWithinWorkingHours(startAt: Date, endAt: Date, hours: WorkingHours): boolean {
  if (hours.closed) return false;
  const ymd = ymdInIstanbul(startAt);
  const dayStart = istanbulDateTime(ymd, hours.startTime);
  const dayEnd = istanbulDateTime(ymd, hours.endTime);
  if (startAt < dayStart || endAt > dayEnd) return false;
  if (hours.breakStart && hours.breakEnd) {
    const br = {
      startAt: istanbulDateTime(ymd, hours.breakStart),
      endAt: istanbulDateTime(ymd, hours.breakEnd),
    };
    if (overlaps({ startAt, endAt }, br)) return false;
  }
  return true;
}

export function weekdayHoursMap(rows: WorkingHours[]): Map<number, WorkingHours> {
  return new Map(rows.map((row) => [row.weekday, row]));
}

export function collectBusyFromAppointments(
  appointments: Pick<Appointment, "startAt" | "endAt" | "status">[],
): Range[] {
  return appointments
    .filter((item) => item.status !== "CANCELLED")
    .map((item) => ({ startAt: item.startAt, endAt: item.endAt }));
}

export function collectBusyFromBlocks(blocks: Pick<BlockedSlot, "startAt" | "endAt">[]): Range[] {
  return blocks.map((item) => ({ startAt: item.startAt, endAt: item.endAt }));
}
