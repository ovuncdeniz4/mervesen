import { formatDateTime } from "@/lib/dates";

/** Randevu ve iletişim formu için e-posta bildirimi (Resend ücretsiz kotası). Anahtar yoksa no-op. */

function notifyConfig(): { apiKey: string; to: string; from: string } | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.NOTIFY_EMAIL?.trim() || process.env.ADMIN_EMAIL?.trim();
  if (!apiKey || !to) return null;
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

async function sendEmail(subject: string, text: string, html: string): Promise<void> {
  const config = notifyConfig();
  if (!config) return;
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
  }
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
    await sendEmail(`Yeni randevu: ${input.patientName}`, lines.join("\n"), html);
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
    await sendEmail(`Yeni mesaj: ${input.name}`, lines.join("\n"), html);
  } catch (error) {
    console.error("İletişim bildirimi başarısız.", error);
  }
}
