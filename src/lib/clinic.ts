import { cache } from "react";
import { prisma } from "@/lib/db";

export const getClinicSettings = cache(async () => {
  const settings = await prisma.clinicSettings.findUnique({ where: { id: "default" } });
  if (!settings) {
    throw new Error("Klinik ayarları bulunamadı. prisma db seed çalıştırın.");
  }
  return settings;
});

export const getPublishedServices = cache(async () => {
  return prisma.service.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
});

export const getWorkingHours = cache(async () => {
  return prisma.workingHours.findMany({ orderBy: { weekday: "asc" } });
});

export function whatsappLink(whatsapp: string, text?: string): string | null {
  const digits = whatsapp.replace(/\D/g, "");
  if (digits.length < 10) return null;
  const international = digits.startsWith("90") ? digits : `90${digits.replace(/^0/, "")}`;
  const url = new URL(`https://wa.me/${international}`);
  if (text) url.searchParams.set("text", text);
  return url.toString();
}

export function telLink(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `tel:+${digits.startsWith("90") ? digits : `90${digits.replace(/^0/, "")}`}`;
}

export function formatPhoneDisplay(phone: string): string {
  return phone.trim() || "Telefonu admin panelinden ekleyin";
}
