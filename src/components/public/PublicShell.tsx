import type { ClinicSettings } from "@prisma/client";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { CommunicationFab } from "@/components/public/CommunicationFab";

export function PublicShell({
  clinic,
  children,
}: {
  clinic: ClinicSettings;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header clinic={clinic} />
      <main className="flex-1 pb-24">{children}</main>
      <Footer clinic={clinic} />
      <CommunicationFab whatsapp={clinic.whatsapp} phone={clinic.phone} />
    </>
  );
}

export function Prose({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`space-y-4 text-ink-soft leading-relaxed ${className}`}>
      {text.split(/\n\n+/).map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>
      ))}
    </div>
  );
}
