import Link from "next/link";
import { getClinicSettings } from "@/lib/clinic";
import { PublicShell } from "@/components/public/PublicShell";

export default async function NotFound() {
  const clinic = await getClinicSettings().catch(() => null);
  const content = (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-serif text-4xl text-sage-dark">Sayfa bulunamadı</h1>
      <p className="mt-3 text-ink-soft">Aradığınız adres taşınmış veya hiç yoktu.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-sage px-6 py-3 text-white">
        Anasayfa
      </Link>
    </div>
  );
  if (!clinic) return content;
  return <PublicShell clinic={clinic}>{content}</PublicShell>;
}
