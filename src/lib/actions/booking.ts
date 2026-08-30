"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getClinicSettings } from "@/lib/clinic";
import {
  collectBusyFromAppointments,
  collectBusyFromBlocks,
  computeSlotsForDay,
  isWithinWorkingHours,
  rangesOverlap,
  type SlotDto,
} from "@/lib/availability";
import { addDaysYmd, todayYmd, weekdayFromYmd, ymdInIstanbul } from "@/lib/dates";

const bookingSchema = z.object({
  serviceId: z.string().min(1),
  startAt: z.string().min(1),
  patientName: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı.").max(80),
  phone: z.string().trim().min(10, "Geçerli bir telefon girin.").max(20),
  email: z.union([z.string().trim().email("Geçerli bir e-posta girin."), z.literal("")]).optional(),
  notes: z.string().trim().max(500).optional(),
  kvkk: z.string().refine((value) => value === "on", "KVKK onayı gereklidir."),
});

export type BookingState = { ok: true; id: string } | { ok: false; error: string };

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export async function getMonthAvailability(serviceId: string, year: number, monthIndex: number) {
  const [service, settings, hoursRows] = await Promise.all([
    prisma.service.findFirst({ where: { id: serviceId, published: true } }),
    getClinicSettings(),
    prisma.workingHours.findMany(),
  ]);
  if (!service) return { days: {} as Record<string, number> };

  const startYmd = `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const endYmd = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  const rangeStart = new Date(`${startYmd}T00:00:00+03:00`);
  const rangeEnd = new Date(`${endYmd}T23:59:59+03:00`);

  const [appointments, blocks] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        status: { not: "CANCELLED" },
        startAt: { lte: rangeEnd },
        endAt: { gte: rangeStart },
      },
    }),
    prisma.blockedSlot.findMany({
      where: { startAt: { lte: rangeEnd }, endAt: { gte: rangeStart } },
    }),
  ]);

  const hoursByDay = new Map(hoursRows.map((row) => [row.weekday, row]));
  const days: Record<string, number> = {};
  const today = todayYmd();
  const maxYmd = addDaysYmd(today, settings.maxAdvanceDays);

  for (let day = 1; day <= lastDay; day += 1) {
    const ymd = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (ymd < today || ymd > maxYmd) {
      days[ymd] = 0;
      continue;
    }
    const hours = hoursByDay.get(weekdayFromYmd(ymd));
    const slots = computeSlotsForDay({
      ymd,
      durationMin: service.durationMin,
      settings,
      hours,
      appointments: collectBusyFromAppointments(
        appointments.filter((item) => ymdInIstanbul(item.startAt) === ymd),
      ),
      blocks: collectBusyFromBlocks(blocks.filter((item) => ymdInIstanbul(item.startAt) === ymd || (item.startAt <= rangeEnd && item.endAt >= rangeStart))),
    });
    days[ymd] = slots.length;
  }
  return { days };
}

export async function getDaySlots(serviceId: string, ymd: string): Promise<{ slots: SlotDto[]; error?: string }> {
  const service = await prisma.service.findFirst({ where: { id: serviceId, published: true } });
  if (!service) return { slots: [], error: "Hizmet bulunamadı." };
  const settings = await getClinicSettings();
  const hours = await prisma.workingHours.findUnique({ where: { weekday: weekdayFromYmd(ymd) } });
  const dayStart = new Date(`${ymd}T00:00:00+03:00`);
  const dayEnd = new Date(`${ymd}T23:59:59+03:00`);
  const [appointments, blocks] = await Promise.all([
    prisma.appointment.findMany({
      where: { status: { not: "CANCELLED" }, startAt: { lte: dayEnd }, endAt: { gte: dayStart } },
    }),
    prisma.blockedSlot.findMany({
      where: { startAt: { lte: dayEnd }, endAt: { gte: dayStart } },
    }),
  ]);
  return {
    slots: computeSlotsForDay({
      ymd,
      durationMin: service.durationMin,
      settings,
      hours: hours ?? undefined,
      appointments: collectBusyFromAppointments(appointments),
      blocks: collectBusyFromBlocks(blocks),
    }),
  };
}

export async function bookAppointment(_prev: BookingState | null, formData: FormData): Promise<BookingState> {
  const parsed = bookingSchema.safeParse({
    serviceId: formData.get("serviceId"),
    startAt: formData.get("startAt"),
    patientName: formData.get("patientName"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    notes: formData.get("notes") ?? "",
    kvkk: formData.get("kvkk"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formu kontrol edin." };
  }

  const phoneDigits = digitsOnly(parsed.data.phone);
  if (phoneDigits.length < 10) {
    return { ok: false, error: "Geçerli bir telefon numarası girin." };
  }

  const startAt = new Date(parsed.data.startAt);
  if (Number.isNaN(startAt.getTime())) {
    return { ok: false, error: "Geçersiz saat seçimi." };
  }

  try {
    const id = await prisma.$transaction(async (tx) => {
      const service = await tx.service.findFirst({ where: { id: parsed.data.serviceId, published: true } });
      if (!service) throw new Error("Hizmet bulunamadı.");
      const settings = await tx.clinicSettings.findUnique({ where: { id: "default" } });
      if (!settings) throw new Error("Klinik ayarları eksik.");
      const endAt = new Date(startAt.getTime() + service.durationMin * 60 * 1000);
      const ymd = ymdInIstanbul(startAt);
      const hours = await tx.workingHours.findUnique({ where: { weekday: weekdayFromYmd(ymd) } });
      if (!hours || !isWithinWorkingHours(startAt, endAt, hours)) {
        throw new Error("Seçilen saat çalışma saatleri dışında.");
      }
      const minStart = new Date(Date.now() + settings.minNoticeHours * 60 * 60 * 1000);
      if (startAt < minStart) {
        throw new Error("Bu saat için son kayıt süresi doldu. Lütfen başka bir saat seçin.");
      }
      const maxYmd = addDaysYmd(todayYmd(), settings.maxAdvanceDays);
      if (ymd > maxYmd) {
        throw new Error("Bu kadar ileri bir tarih için randevu açılmıyor.");
      }

      const overlapping = await tx.appointment.findMany({
        where: {
          status: { not: "CANCELLED" },
          startAt: { lt: endAt },
          endAt: { gt: startAt },
        },
      });
      const blocks = await tx.blockedSlot.findMany({
        where: { startAt: { lt: endAt }, endAt: { gt: startAt } },
      });
      if (
        rangesOverlap(startAt, endAt, [
          ...collectBusyFromAppointments(overlapping),
          ...collectBusyFromBlocks(blocks),
        ])
      ) {
        throw new Error("Bu saat az önce doldu. Lütfen başka bir saat seçin.");
      }

      const created = await tx.appointment.create({
        data: {
          serviceId: service.id,
          startAt,
          endAt,
          patientName: parsed.data.patientName,
          phone: parsed.data.phone.trim(),
          email: parsed.data.email ? parsed.data.email : null,
          notes: parsed.data.notes ? parsed.data.notes : null,
          kvkkConsent: true,
          status: "CONFIRMED",
        },
      });
      return created.id;
    });

    revalidatePath("/randevu");
    revalidatePath("/admin");
    revalidatePath("/admin/takvim");
    revalidatePath("/admin/randevular");
    return { ok: true, id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Randevu kaydedilemedi.";
    return { ok: false, error: message };
  }
}
