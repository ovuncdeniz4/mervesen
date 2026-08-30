import type { Metadata } from "next";
import { getClinicSettings } from "@/lib/clinic";
import { PublicShell, Prose } from "@/components/public/PublicShell";

export const metadata: Metadata = { title: "Hakkımızda" };

export default async function AboutPage() {
  const clinic = await getClinicSettings();
  return (
    <PublicShell clinic={clinic}>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm uppercase tracking-widest text-gold">Hakkımızda</p>
        <h1 className="mt-2 font-serif text-4xl text-sage-dark sm:text-5xl">{clinic.clinicName}</h1>
        <Prose text={clinic.aboutLong} className="mt-8 text-lg" />
        <h2 className="mt-12 font-serif text-3xl text-sage-dark">{clinic.doctorName}</h2>
        <Prose text={clinic.doctorBio} className="mt-4" />
      </article>
    </PublicShell>
  );
}
