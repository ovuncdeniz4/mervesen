import type { Metadata } from "next";
import { getClinicSettings } from "@/lib/clinic";
import { PublicShell } from "@/components/public/PublicShell";
import { faqs } from "@/lib/faqs";

export const metadata: Metadata = { title: "Sıkça sorulan sorular" };

export default async function FaqPage() {
  const clinic = await getClinicSettings();
  return (
    <PublicShell clinic={clinic}>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-serif text-4xl text-sage-dark sm:text-5xl">Sıkça sorulan sorular</h1>
        <div className="mt-10 space-y-4">
          {faqs.map((item) => (
            <details key={item.q} className="rounded-2xl bg-paper p-5 ring-1 ring-cream-dark">
              <summary className="cursor-pointer font-medium text-sage-dark">{item.q}</summary>
              <p className="mt-3 text-ink-soft leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
