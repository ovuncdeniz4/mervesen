import type { Metadata } from "next";
import { getClinicSettings } from "@/lib/clinic";
import { PublicShell } from "@/components/public/PublicShell";
import { faqs } from "@/lib/faqs";

export const metadata: Metadata = { title: "Sıkça sorulan sorular" };

export default async function FaqPage() {
  const clinic = await getClinicSettings();
  return (
    <PublicShell clinic={clinic}>
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
        <h1 className="font-serif text-4xl text-espresso sm:text-5xl">Sıkça sorulan sorular</h1>
        <div className="mt-12 space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="rounded-lg border border-champagne bg-paper p-5">
              <summary className="cursor-pointer font-medium text-espresso">{item.q}</summary>
              <p className="mt-3 leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
