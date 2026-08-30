import { formatDateTime } from "@/lib/dates";

/** Randevu / iletişim e-posta bildirimi. Resend ücretsiz kota. Anahtar veya alıcı yoksa no-op. */

export type NotifyResult = { ok: true; to: string } | { ok: false; error: string };

/** Domain doğrulanmadan tek izinli gönderen. example.com Resend’de çalışmaz. */
const RESEND_SANDBOX_FROM = "Dt. Merve Şen Aşkar <beth.t@example.com>";
const PLACEHOLDER_FROM_DOMAINS = new Set(["example.com", "your-domain.com", "localhost"]);

function emailFromHeader(from: string): string {
  const angled = from.match(/<([^>]+)>/);
  return (angled?.[1] ?? from).trim().toLowerCase();
}

function domainFromHeader(from: string): string {
  return emailFromHeader(from).split("@")[1] ?? "";
}

function resolveFrom(): string {
  const raw = process.env.NOTIFY_FROM?.trim();
  if (!raw) return RESEND_SANDBOX_FROM;
  const domain = domainFromHeader(raw);
  if (!domain || PLACEHOLDER_FROM_DOMAINS.has(domain)) {
    console.warn("NOTIFY_FROM placeholder/example.com yok sayıldı; onboarding@resend.dev kullanılıyor.");
    return RESEND_SANDBOX_FROM;
  }
  return raw;
}

function notifyConfig(): { apiKey: string; to: string; from: string } | { error: string } {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.NOTIFY_EMAIL?.trim();
  if (!apiKey) {
    return { error: "RESEND_API_KEY Vercel’de yok. Env ekledikten sonra Redeploy şart." };
  }
  if (!to || !to.includes("@") || to.endsWith(".local") || to.toLowerCase().endsWith("@example.com")) {
    return {
      error:
        "NOTIFY_EMAIL gerçek bir gelen kutusu olmalı (you@example.com değil). ADMIN_EMAIL (.local) mail düşmez. Resend hesabınızın e-postası ile aynı olmalı.",
    };
  }
  return { apiKey, to, from: resolveFrom() };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function isUnverifiedDomainError(message: string): boolean {
  return /domain is not verified|verify your domain|resend\.com\/domains/i.test(message);
}

function friendlyResendError(message: string): string {
  if (/example\.com domain is not verified/i.test(message)) {
    return "Gönderen example.com olamaz. Vercel’de NOTIFY_FROM varsa silin ve Redeploy edin. Alan adı eklemeniz gerekmez.";
  }
  if (isUnverifiedDomainError(message)) {
    return "NOTIFY_FROM Resend’de doğrulanmamış. Vercel’de NOTIFY_FROM’u silin; kod beth.t@example.com kullanır. Kendi alan adınızı ancak resend.com/domains’de doğruladıktan sonra yazın.";
  }
  if (/only send testing emails to your own email/i.test(message)) {
    return "Resend ücretsiz planda mail yalnızca hesap e-postanıza gider. NOTIFY_EMAIL’i Resend’e kayıt olduğunuz adres yapın.";
  }
  return message;
}

async function postResend(
  config: { apiKey: string; to: string },
  from: string,
  subject: string,
  text: string,
  html: string,
): Promise<{ ok: boolean; status: number; body: string }> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [config.to],
      subject,
      text,
      html,
    }),
  });
  return { ok: response.ok, status: response.status, body: await response.text() };
}

async function sendEmail(subject: string, text: string, html: string): Promise<NotifyResult> {
  const config = notifyConfig();
  if ("error" in config) {
    console.error("Bildirim atlandı:", config.error);
    return { ok: false, error: config.error };
  }

  let from = config.from;
  let result = await postResend(config, from, subject, text, html);
  if (!result.ok && isUnverifiedDomainError(result.body) && domainFromHeader(from) !== "resend.dev") {
    console.warn("NOTIFY_FROM doğrulanmamış, onboarding@resend.dev ile yeniden deneniyor.");
    from = RESEND_SANDBOX_FROM;
    result = await postResend(config, from, subject, text, html);
  }

  if (!result.ok) {
    console.error("E-posta bildirimi gönderilemedi.", result.status, result.body);
    let detail = `Resend ${result.status}`;
    try {
      const parsed = JSON.parse(result.body) as { message?: string };
      if (parsed.message) detail = parsed.message;
    } catch {
      if (result.body) detail = result.body.slice(0, 280);
    }
    return { ok: false, error: friendlyResendError(detail) };
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
