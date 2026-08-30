import { telLink, whatsappLink } from "@/lib/clinic";

/** Fixed call, Instagram and WhatsApp actions. */
export function CommunicationFab({
  whatsapp,
  phone,
  instagram,
}: {
  whatsapp: string;
  phone: string;
  instagram: string;
}) {
  const wa = whatsappLink(whatsapp, "Merhaba, randevu için yazıyorum.");
  const tel = telLink(phone);
  const ig = instagram.trim() || null;
  if (!wa && !tel && !ig) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {tel ? (
        <a
          href={tel}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-sage text-white shadow-lg hover:scale-105 hover:bg-sage-dark"
          aria-label={`Ara ${phone}`}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
            <path d="M6.6 10.8c1.4 2.7 3.9 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.4 21 3 13.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z" />
          </svg>
        </a>
      ) : null}
      {ig ? (
        <a
          href={ig}
          target="_blank"
          rel="noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg hover:scale-105"
          style={{
            background:
              "radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285aeb 90%)",
          }}
          aria-label="Instagram"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
            <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 1.8H7A2.2 2.2 0 0 0 4.8 7v10A2.2 2.2 0 0 0 7 19.2h10a2.2 2.2 0 0 0 2.2-2.2V7A2.2 2.2 0 0 0 17 4.8zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.7A2.1 2.1 0 1 0 14.1 12 2.1 2.1 0 0 0 12 9.9zm4.35-3.05a.95.95 0 1 1-.95.95.95.95 0 0 1 .95-.95z" />
          </svg>
        </a>
      ) : null}
      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105"
          aria-label="WhatsApp ile yazın"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
            <path d="M20.5 3.5A11 11 0 0 0 2.1 16.7L1 22l5.4-1.1A11 11 0 0 0 20.5 3.5zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.2.7.7-3.1-.2-.3A9.1 9.1 0 1 1 12 20.5zm5.2-6.8c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.3-.4.1-.3c0-.1 0-.3-.1-.4l-.9-2.1c-.2-.5-.5-.4-.6-.4h-.5c-.2 0-.4.1-.6.3s-.8.8-.8 1.9.8 2.2.9 2.3a13 13 0 0 0 5 3.7c.7.3 1.2.4 1.6.3s1.3-.5 1.5-1 .2-.9.1-1-.2-.2-.5-.3z" />
          </svg>
        </a>
      ) : null}
    </div>
  );
}
