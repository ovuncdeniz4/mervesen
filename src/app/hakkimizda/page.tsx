import type { Metadata } from "next";
import Image from "next/image";
import { getClinicSettings } from "@/lib/clinic";
import { PublicShell } from "@/components/public/PublicShell";
import { ClinicGallery, DoctorPortraits } from "@/components/public/ClinicGallery";
import { aboutPage } from "@/lib/content/about";
import { publicImageExists } from "@/lib/public-image";

export const metadata: Metadata = { title: "Hakkımızda" };

export default async function AboutPage() {
  const clinic = await getClinicSettings();

  return (
    <PublicShell clinic={clinic}>
      <article className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <p className="text-xs uppercase tracking-[0.2em] text-taupe">Hakkımızda</p>
        <h1 className="mt-3 font-serif text-4xl text-espresso sm:text-5xl">{aboutPage.pageTitle}</h1>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-14">
            {aboutPage.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-3xl text-espresso">{section.heading}</h2>
                <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <aside className="space-y-4">
            {publicImageExists("/images/doctor/portrait-1.jpg") ? (
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-champagne">
                <Image
                  src="/images/doctor/portrait-1.jpg"
                  alt={clinic.doctorName}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 35vw, 100vw"
                />
              </div>
            ) : null}
            <DoctorPortraits />
          </aside>
        </div>

        <section className="mt-20">
          <h2 className="font-serif text-3xl text-espresso">Klinik görselleri</h2>
          <p className="mt-3 text-muted">{clinic.address}</p>
          <div className="mt-8">
            <ClinicGallery />
          </div>
        </section>
      </article>
    </PublicShell>
  );
}
