import type { Metadata } from "next";
import Image from "next/image";
import { getClinicSettings, telLink, whatsappLink } from "@/lib/clinic";
import { PublicShell } from "@/components/public/PublicShell";
import { ClinicGallery, DoctorPortraits } from "@/components/public/ClinicGallery";
import { aboutPage } from "@/lib/content/about";
import { publicImageExists } from "@/lib/public-image";

export const metadata: Metadata = { title: "Hakkımızda" };

export default async function AboutPage() {
  const clinic = await getClinicSettings();
  const tel = telLink(clinic.phone);
  const wa = whatsappLink(clinic.whatsapp, "Merhaba, randevu için yazıyorum.");

  return (
    <PublicShell clinic={clinic}>
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm uppercase tracking-widest text-gold">Hakkımızda</p>
        <h1 className="mt-2 font-serif text-4xl text-sage-dark sm:text-5xl">{aboutPage.pageTitle}</h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-12">
            {aboutPage.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-3xl text-sage-dark">{section.heading}</h2>
                <div className="mt-4 space-y-4 text-lg leading-relaxed text-ink-soft">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <aside className="space-y-4">
            {publicImageExists("/images/doctor/portrait-1.jpg") ? (
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem]">
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

        <section className="mt-16">
          <h2 className="font-serif text-3xl text-sage-dark">Klinik görselleri</h2>
          <p className="mt-2 text-ink-soft">{clinic.address}</p>
          <div className="mt-6">
            <ClinicGallery />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {wa ? (
              <a href={wa} target="_blank" rel="noreferrer" className="rounded-full bg-[#25D366] px-5 py-2 text-white">
                WhatsApp
              </a>
            ) : null}
            {tel ? (
              <a href={tel} className="rounded-full border border-sage px-5 py-2 text-sage-dark">
                Ara · {clinic.phone}
              </a>
            ) : null}
          </div>
        </section>
      </article>
    </PublicShell>
  );
}
