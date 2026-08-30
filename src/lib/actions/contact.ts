"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2, "Ad soyad gerekli.").max(80),
  phone: z.string().trim().min(10, "Geçerli bir telefon girin.").max(20),
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

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email ? parsed.data.email : null,
      message: parsed.data.message,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mesajlar");
  return { ok: true };
}
