import { formatDateTime } from "@/lib/dates";

/** Randevu / iletişim e-posta bildirimi. Resend ücretsiz kota. Anahtar veya alıcı yoksa no-op. */

export type NotifyResult =
  | { ok: true; to: string; from: string; resendId?: string; log: string }
  | { ok: false; error: string; log: string };

/** Resend sandbox. example.com gönderen 403 verir; kendi domain’iniz yoksa yalnızca bu adres. */
const RESEND_SANDBOX_FROM = "beth.t@example.com";

function emailFromHeader(from: string): string {
  const angled = from.match(/<([^>]+)>/);
  return (angled?.[1] ?? from).trim().toLowerCase();
}

function domainFromHeader(from: string): string {
  return emailFromHeader(from).split("@")[1] ?? "";
}

function envSnapshot(): { hasApiKey: boolean; notifyEmail: string; notifyFromEnv: string } {
  return {
    hasApiKey: Boolean(process.env.RESEND_API_KEY?.trim()),
    notifyEmail: process.env.NOTIFY_EMAIL?.trim() || "(empty)",
    notifyFromEnv: process.env.NOTIFY_FROM?.trim() || "(unset)",
  };
}

function formatNotifyLog(input: {
  fromUsed?: string;
  ignoredPlaceholder?: boolean;
  retried?: boolean;
  status?: number | null;
  resendId?: string;
  resendBody?: string;
  extra?: string;
}): string {
  const env = envSnapshot();
  const lines = [
    `RESEND_API_KEY: ${env.hasApiKey ? "var" : "YOK"}`,
    `NOTIFY_EMAIL: ${env.notifyEmail}`,
    `NOTIFY_FROM env: ${env.notifyFromEnv}`,
  ];
  if (input.ignoredPlaceholder) {
    lines.push("NOTIFY_FROM yok sayıldı (sandbox: onboarding@resend.dev)");
  }
  if (input.fromUsed) lines.push(`from gönderildi: ${input.fromUsed}`);
  if (input.retried) lines.push("yeniden deneme: onboarding@resend.dev");
  if (input.status != null) lines.push(`HTTP: ${input.status}`);
  if (input.resendId) lines.push(`Resend id: ${input.resendId}`);
  if (input.resendBody) lines.push(`Resend body: ${input.resendBody.slice(0, 800)}`);
  if (input.extra) lines.push(input.extra);
  return lines.join("\n");
}

function resolveFrom(): { from: string; ignoredPlaceholder: boolean } {
  const raw = process.env.NOTIFY_FROM?.trim();
  if (raw) {
    return { from: RESEND_SANDBOX_FROM, ignoredPlaceholder: true };
  }
  return { from: RESEND_SANDBOX_FROM, ignoredPlaceholder: false };
}

function notifyConfig(): { apiKey: string; to: string; from: string; ignoredPlaceholder: boolean } | { error: string; log: string } {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.NOTIFY_EMAIL?.trim();
  if (!apiKey) {
    const error = "RESEND_API_KEY Vercel’de yok. Env ekledikten sonra Redeploy şart.";
    const log = formatNotifyLog({ extra: error });
    console.error("[notify]", log);
    return { error, log };
  }
  if (!to || !to.includes("@") || to.endsWith(".local") || to.toLowerCase().endsWith("@example.com")) {
    const error =
      "NOTIFY_EMAIL gerçek bir gelen kutusu olmalı (you@example.com değil). ADMIN_EMAIL (.local) mail düşmez. Resend hesabınızın e-postası ile aynı olmalı.";
    const log = formatNotifyLog({ extra: error });
    console.error("[notify]", log);
    return { error, log };
  }
  const resolved = resolveFrom();
  return { apiKey, to, from: resolved.from, ignoredPlaceholder: resolved.ignoredPlaceholder };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function isUnverifiedDomainError(message: string): boolean {
  return /domain not verified|domain is not verified|verify example|update your from domain|verify your domain|resend\.com\/domains/i.test(
    message,
  );
}

function hintForResend(message: string): string {
  if (
    /only send testing emails to your own email/i.test(message) ||
    (/example\.com/i.test(message) && /not verified|verify example|from domain/i.test(message)) ||
    isUnverifiedDomainError(message)
  ) {
    return "example.com eklemeyin (sahte örnek). Gönderen zaten beth.t@example.com. 403 genelde NOTIFY_EMAIL’in Resend hesap e-postasıyla aynı olmamasındandır. Resend → Settings’teki kayıt e-postasını Vercel NOTIFY_EMAIL yapın, Redeploy edin. Log satırında From = onboarding@resend.dev, To = o adres olmalı.";
  }
  return "";
}

function parseResendBody(body: string): { message: string; id?: string } {
  try {
    const parsed = JSON.parse(body) as { message?: string; id?: string; name?: string };
    const message = parsed.message || parsed.name || body.slice(0, 400);
    return { message, id: parsed.id };
  } catch {
    return { message: body.slice(0, 400) };
  }
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
    return { ok: false, error: config.error, log: config.log };
  }

  let from = config.from;
  let retried = false;
  if (config.ignoredPlaceholder) {
    console.warn("[notify] NOTIFY_FROM placeholder/example.com yok sayıldı; onboarding@resend.dev kullanılıyor.");
  }

  let result = await postResend(config, from, subject, text, html);
  if (!result.ok && isUnverifiedDomainError(result.body) && domainFromHeader(from) !== "resend.dev") {
    console.warn("[notify] FROM doğrulanmamış, onboarding@resend.dev ile yeniden deneniyor. İlk cevap:", result.body);
    from = RESEND_SANDBOX_FROM;
    retried = true;
    result = await postResend(config, from, subject, text, html);
  }

  const parsed = parseResendBody(result.body);
  const log = formatNotifyLog({
    fromUsed: from,
    ignoredPlaceholder: config.ignoredPlaceholder,
    retried,
    status: result.status,
    resendId: parsed.id,
    resendBody: result.body,
  });

  if (!result.ok) {
    console.error("[notify] gönderilemedi\n" + log);
    const hint = hintForResend(parsed.message);
    const error = hint ? `${hint}\n\nResend: ${parsed.message}` : parsed.message;
    return { ok: false, error, log };
  }

  console.info("[notify] gönderildi\n" + log);
  return { ok: true, to: config.to, from, resendId: parsed.id, log };
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
    if (!result.ok) console.error("[notify] randevu bildirimi başarısız\n" + result.log);
  } catch (error) {
    console.error("[notify] randevu bildirimi istisna", error);
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
    if (!result.ok) console.error("[notify] iletişim bildirimi başarısız\n" + result.log);
  } catch (error) {
    console.error("[notify] iletişim bildirimi istisna", error);
  }
}

export async function sendTestNotification(): Promise<NotifyResult> {
  return sendEmail(
    "Test: randevu bildirimi",
    "Bu bir test mailidir. Bunu görüyorsanız bildirim çalışıyor.",
    "<p>Bu bir <strong>test</strong> mailidir. Bunu görüyorsanız bildirim çalışıyor.</p>",
  );
}
