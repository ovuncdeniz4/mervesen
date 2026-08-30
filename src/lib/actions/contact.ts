"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { notifyNewContactMessage } from "@/lib/notify";
import { normalizeTrMobile, TR_MOBILE_ERROR } from "@/lib/phone";

const schema = z.object({
  name: z.string().trim().min(2, "Ad soyad gerekli.").max(80),
  phone: z
    .string()
    .trim()
    .refine((value) => Boolean(normalizeTrMobile(value)), TR_MOBILE_ERROR),
  email: z.union([z.string().trim().email(), z.literal("")]).optional(),
  message: z.string().trim().min(10, "Mesajınız en az 10 karakter olsun.").max(2000),
  kvkk: z.string().refine((value) => value === "on", "KVKK onayı gereklidir."),
});

export type ContactState = { ok: true } | { ok: false; error: string };

export async function sendContactMessage(_prev: ContactState | null, formData: FormData): Promise<ContactState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    message: formData.get("message"),
    kvkk: formData.get("kvkk"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formu kontrol edin." };
  }

  const phone = normalizeTrMobile(parsed.data.phone);
  if (!phone) {
    return { ok: false, error: TR_MOBILE_ERROR };
  }

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      phone,
      email: parsed.data.email ? parsed.data.email : null,
      message: parsed.data.message,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mesajlar");
  await notifyNewContactMessage({
    name: parsed.data.name,
    phone,
    email: parsed.data.email,
    message: parsed.data.message,
  });
  return { ok: true };
}
