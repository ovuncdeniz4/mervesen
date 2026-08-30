import { whatsappLink } from "@/lib/clinic";

export function WhatsAppButton({ whatsapp }: { whatsapp: string }) {
  const href = whatsappLink(whatsapp, "Merhaba, randevu için yazıyorum.");
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105"
      aria-label="WhatsApp ile yazın"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
        <path d="M20.5 3.5A11 11 0 0 0 2.1 16.7L1 22l5.4-1.1A11 11 0 0 0 20.5 3.5zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.2.7.7-3.1-.2-.3A9.1 9.1 0 1 1 12 20.5zm5.2-6.8c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.3-.4.1-.3c0-.1 0-.3-.1-.4l-.9-2.1c-.2-.5-.5-.4-.6-.4h-.5c-.2 0-.4.1-.6.3s-.8.8-.8 1.9.8 2.2.9 2.3a13 13 0 0 0 5 3.7c.7.3 1.2.4 1.6.3s1.3-.5 1.5-1 .2-.9.1-1-.2-.2-.5-.3z" />
      </svg>
    </a>
  );
}
