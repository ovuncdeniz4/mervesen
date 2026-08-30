import { formatDateTime } from "@/lib/dates";

/** Randevu / iletişim e-posta bildirimi. Resend ücretsiz kota. Anahtar veya alıcı yoksa no-op. */

export type NotifyResult = { ok: true; to: string } | { ok: false; error: string };

function notifyConfig(): { apiKey: string; to: string; from: string } | { error: string } {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.NOTIFY_EMAIL?.trim();
  if (!apiKey) {
    return { error: "RESEND_API_KEY Vercel’de yok. Env ekledikten sonra Redeploy şart." };
  }
  if (!to || !to.includes("@") || to.endsWith(".local")) {
    return {
      error:
        "NOTIFY_EMAIL gerçek bir gelen kutusu olmalı. ADMIN_EMAIL (.local) mail düşmez. Resend hesabınızın e-postası ile aynı olmalı.",
    };
  }
  const from = process.env.NOTIFY_FROM?.trim() || "Diş Hekimi Merve Şen Aşkar <beth.t@example.com>";
  return { apiKey, to, from };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function sendEmail(subject: string, text: string, html: string): Promise<NotifyResult> {
  const config = notifyConfig();
  if ("error" in config) {
    console.error("Bildirim atlandı:", config.error);
    return { ok: false, error: config.error };
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      subject,
      text,
      html,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    console.error("E-posta bildirimi gönderilemedi.", response.status, body);
    let detail = `Resend ${response.status}`;
    try {
      const parsed = JSON.parse(body) as { message?: string };
      if (parsed.message) detail = parsed.message;
    } catch {
      if (body) detail = body.slice(0, 280);
    }
    return { ok: false, error: detail };
  }
  return { ok: true, to: config.to };
}

export async function notifyNewAppointment(input: {
  startAt: Date;
  patientName: string;
  phone: string;
  email?: string | null;
  notes?: string | null;
}): Promise<void> {
  const when = formatDateTime(input.startAt);
  const lines = [
    "Yeni randevu alındı.",
    when,
    `Hasta: ${input.patientName}`,
    `Telefon: ${input.phone}`,
  ];
  if (input.email) lines.push(`E-posta: ${input.email}`);
  if (input.notes) lines.push(`Not: ${input.notes}`);
  const html = `
    <p><strong>Yeni randevu alındı.</strong></p>
    <p>${escapeHtml(when)}</p>
    <p>Hasta: ${escapeHtml(input.patientName)}<br/>Telefon: ${escapeHtml(input.phone)}${
      input.email ? `<br/>E-posta: ${escapeHtml(input.email)}` : ""
    }${input.notes ? `<br/>Not: ${escapeHtml(input.notes)}` : ""}</p>
  `;
  try {
    const result = await sendEmail(`Yeni randevu: ${input.patientName}`, lines.join("\n"), html);
    if (result.ok) console.info("Randevu bildirimi gönderildi:", result.to);
  } catch (error) {
    console.error("Randevu bildirimi başarısız.", error);
  }
}

export async function notifyNewContactMessage(input: {
  name: string;
  phone: string;
  email?: string | null;
  message: string;
}): Promise<void> {
  const lines = ["Yeni iletişim mesajı.", `Gönderen: ${input.name}`, `Telefon: ${input.phone}`];
  if (input.email) lines.push(`E-posta: ${input.email}`);
  lines.push("", input.message);
  const html = `
    <p><strong>Yeni iletişim mesajı.</strong></p>
    <p>Gönderen: ${escapeHtml(input.name)}<br/>Telefon: ${escapeHtml(input.phone)}${
      input.email ? `<br/>E-posta: ${escapeHtml(input.email)}` : ""
    }</p>
    <p>${escapeHtml(input.message).replaceAll("\n", "<br/>")}</p>
  `;
  try {
    const result = await sendEmail(`Yeni mesaj: ${input.name}`, lines.join("\n"), html);
    if (result.ok) console.info("İletişim bildirimi gönderildi:", result.to);
  } catch (error) {
    console.error("İletişim bildirimi başarısız.", error);
  }
}

export async function sendTestNotification(): Promise<NotifyResult> {
  return sendEmail(
    "Test: randevu bildirimi",
    "Bu bir test mailidir. Bunu görüyorsanız bildirim çalışıyor.",
    "<p>Bu bir <strong>test</strong> mailidir. Bunu görüyorsanız bildirim çalışıyor.</p>",
  );
}
