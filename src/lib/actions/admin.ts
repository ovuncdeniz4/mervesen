"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import {
  collectBusyFromAppointments,
  collectBusyFromBlocks,
  isWithinWorkingHours,
  rangesOverlap,
} from "@/lib/availability";
import { istanbulDateTime, weekdayFromYmd, ymdInIstanbul } from "@/lib/dates";

function refreshAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/takvim");
  revalidatePath("/admin/randevular");
  revalidatePath("/admin/saatler");
  revalidatePath("/admin/hizmetler");
  revalidatePath("/admin/mesajlar");
  revalidatePath("/admin/ayarlar");
  revalidatePath("/");
  revalidatePath("/hizmetler");
  revalidatePath("/randevu");
  revalidatePath("/iletisim");
}

export async function updateAppointmentStatus(id: string, status: "CONFIRMED" | "CANCELLED" | "COMPLETED") {
  await requireAdmin();
  await prisma.appointment.update({ where: { id }, data: { status } });
  refreshAdmin();
}

export async function createManualAppointment(formData: FormData) {
  await requireAdmin();
  const serviceId = String(formData.get("serviceId") ?? "");
  const ymd = String(formData.get("ymd") ?? "");
  const time = String(formData.get("time") ?? "");
  const patientName = String(formData.get("patientName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  if (!serviceId || !ymd || !time || patientName.length < 2 || phone.length < 10) {
    return { ok: false as const, error: "Hizmet, tarih, saat, ad ve telefon zorunlu." };
  }
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) return { ok: false as const, error: "Hizmet bulunamadı." };
  const startAt = istanbulDateTime(ymd, time);
  const endAt = new Date(startAt.getTime() + service.durationMin * 60 * 1000);

  try {
    await prisma.$transaction(async (tx) => {
      const hours = await tx.workingHours.findUnique({ where: { weekday: weekdayFromYmd(ymd) } });
      if (!hours || !isWithinWorkingHours(startAt, endAt, hours)) {
        throw new Error("Çalışma saatleri dışında.");
      }
      const overlapping = await tx.appointment.findMany({
        where: { status: { not: "CANCELLED" }, startAt: { lt: endAt }, endAt: { gt: startAt } },
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
        throw new Error("Bu aralık dolu.");
      }
      await tx.appointment.create({
        data: {
          serviceId,
          startAt,
          endAt,
          patientName,
          phone,
          notes: notes || null,
          kvkkConsent: true,
          status: "CONFIRMED",
        },
      });
    });
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "Kayıt başarısız." };
  }
  refreshAdmin();
  return { ok: true as const };
}

export async function rescheduleAppointment(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const ymd = String(formData.get("ymd") ?? "");
  const time = String(formData.get("time") ?? "");
  if (!id || !ymd || !time) return { ok: false as const, error: "Tarih ve saat gerekli." };

  try {
    await prisma.$transaction(async (tx) => {
      const current = await tx.appointment.findUnique({ where: { id }, include: { service: true } });
      if (!current) throw new Error("Randevu bulunamadı.");
      const startAt = istanbulDateTime(ymd, time);
      const endAt = new Date(startAt.getTime() + current.service.durationMin * 60 * 1000);
      const hours = await tx.workingHours.findUnique({ where: { weekday: weekdayFromYmd(ymd) } });
      if (!hours || !isWithinWorkingHours(startAt, endAt, hours)) {
        throw new Error("Çalışma saatleri dışında.");
      }
      const overlapping = await tx.appointment.findMany({
        where: {
          id: { not: id },
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
        throw new Error("Bu aralık dolu.");
      }
      await tx.appointment.update({ where: { id }, data: { startAt, endAt, status: "CONFIRMED" } });
    });
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "Erteleme başarısız." };
  }
  refreshAdmin();
  return { ok: true as const };
}

export async function createBlockedSlot(formData: FormData) {
  await requireAdmin();
  const ymd = String(formData.get("ymd") ?? "");
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");
  const reason = String(formData.get("reason") ?? "Blok").trim() || "Blok";
  if (!ymd || !startTime || !endTime) {
    return { ok: false as const, error: "Tarih ve saat aralığı gerekli." };
  }
  const startAt = istanbulDateTime(ymd, startTime);
  const endAt = istanbulDateTime(ymd, endTime);
  if (endAt <= startAt) return { ok: false as const, error: "Bitiş, başlangıçtan sonra olmalı." };
  await prisma.blockedSlot.create({ data: { startAt, endAt, reason } });
  refreshAdmin();
  return { ok: true as const };
}

export async function deleteBlockedSlot(id: string) {
  await requireAdmin();
  await prisma.blockedSlot.delete({ where: { id } });
  refreshAdmin();
}

export async function updateWorkingHours(formData: FormData) {
  await requireAdmin();
  const rows = await prisma.workingHours.findMany();
  for (const row of rows) {
    const closed = formData.get(`closed-${row.weekday}`) === "on";
    const startTime = String(formData.get(`start-${row.weekday}`) ?? row.startTime);
    const endTime = String(formData.get(`end-${row.weekday}`) ?? row.endTime);
    const breakStartRaw = String(formData.get(`breakStart-${row.weekday}`) ?? "").trim();
    const breakEndRaw = String(formData.get(`breakEnd-${row.weekday}`) ?? "").trim();
    await prisma.workingHours.update({
      where: { id: row.id },
      data: {
        closed,
        startTime,
        endTime,
        breakStart: breakStartRaw || null,
        breakEnd: breakEndRaw || null,
      },
    });
  }
  const minNoticeHours = Number(formData.get("minNoticeHours") ?? 2);
  const maxAdvanceDays = Number(formData.get("maxAdvanceDays") ?? 60);
  const slotIntervalMin = Number(formData.get("slotIntervalMin") ?? 30);
  await prisma.clinicSettings.update({
    where: { id: "default" },
    data: {
      minNoticeHours: Number.isFinite(minNoticeHours) ? minNoticeHours : 2,
      maxAdvanceDays: Number.isFinite(maxAdvanceDays) ? maxAdvanceDays : 60,
      slotIntervalMin: Number.isFinite(slotIntervalMin) ? slotIntervalMin : 30,
    },
  });
  refreshAdmin();
}

const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2),
  summary: z.string().trim().min(10),
  content: z.string().trim().min(20),
  durationMin: z.coerce.number().min(15).max(180),
  sortOrder: z.coerce.number().int(),
  published: z.boolean(),
  featured: z.boolean(),
});

export async function saveService(formData: FormData) {
  await requireAdmin();
  const parsed = serviceSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    content: formData.get("content"),
    durationMin: formData.get("durationMin"),
    sortOrder: formData.get("sortOrder"),
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Hizmet kaydı geçersiz." };
  }
  const { id, ...data } = parsed.data;
  if (id) {
    await prisma.service.update({ where: { id }, data });
  } else {
    await prisma.service.create({ data });
  }
  refreshAdmin();
  revalidatePath(`/hizmetler/${data.slug}`);
  return { ok: true as const };
}

export async function deleteService(id: string) {
  await requireAdmin();
  const count = await prisma.appointment.count({ where: { serviceId: id } });
  if (count > 0) {
    await prisma.service.update({ where: { id }, data: { published: false } });
  } else {
    await prisma.service.delete({ where: { id } });
  }
  refreshAdmin();
}

export async function updateClinicSettings(formData: FormData) {
  await requireAdmin();
  await prisma.clinicSettings.update({
    where: { id: "default" },
    data: {
      clinicName: String(formData.get("clinicName") ?? "").trim(),
      doctorName: String(formData.get("doctorName") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      whatsapp: String(formData.get("whatsapp") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      mapsUrl: String(formData.get("mapsUrl") ?? "").trim(),
      mapsEmbedUrl: String(formData.get("mapsEmbedUrl") ?? "").trim(),
      tagline: String(formData.get("tagline") ?? "").trim(),
      aboutShort: String(formData.get("aboutShort") ?? "").trim(),
      aboutLong: String(formData.get("aboutLong") ?? "").trim(),
      doctorBio: String(formData.get("doctorBio") ?? "").trim(),
    },
  });
  refreshAdmin();
}

export async function markMessageRead(id: string, read: boolean) {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  refreshAdmin();
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  refreshAdmin();
}

export async function dayBusy(ymd: string) {
  await requireAdmin();
  const start = istanbulDateTime(ymd, "00:00");
  const end = istanbulDateTime(ymd, "23:59");
  const [appointments, blocks] = await Promise.all([
    prisma.appointment.findMany({
      where: { startAt: { lte: end }, endAt: { gte: start } },
      include: { service: true },
      orderBy: { startAt: "asc" },
    }),
    prisma.blockedSlot.findMany({
      where: { startAt: { lte: end }, endAt: { gte: start } },
      orderBy: { startAt: "asc" },
    }),
  ]);
  return { appointments, blocks, ymd: ymdInIstanbul(start) };
}

export async function createManualAppointmentForm(formData: FormData): Promise<void> {
  await createManualAppointment(formData);
}

export async function rescheduleAppointmentForm(formData: FormData): Promise<void> {
  await rescheduleAppointment(formData);
}

export async function createBlockedSlotForm(formData: FormData): Promise<void> {
  await createBlockedSlot(formData);
}

export async function saveServiceForm(formData: FormData): Promise<void> {
  await saveService(formData);
}
