import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getClinicSettings, telLink, whatsappLink } from "@/lib/clinic";
import { PublicShell, Prose } from "@/components/public/PublicShell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) return { title: "Hizmet" };
  return { title: service.name, description: service.summary };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [clinic, service] = await Promise.all([
    getClinicSettings(),
    prisma.service.findFirst({ where: { slug, published: true } }),
  ]);
  if (!service) notFound();
  const wa = whatsappLink(clinic.whatsapp, `Merhaba, ${service.name} hakkında bilgi almak istiyorum.`);
  const tel = telLink(clinic.phone);

  return (
    <PublicShell clinic={clinic}>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link href="/hizmetler" className="text-sm text-sage-dark">
          ← Tüm hizmetler
        </Link>
        {service.imagePath ? (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-[2rem]">
            <Image
              src={service.imagePath}
              alt={service.name}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 768px, 100vw"
              priority
            />
          </div>
        ) : null}
        <h1 className="mt-6 font-serif text-4xl text-sage-dark sm:text-5xl">{service.name}</h1>
        <Prose text={service.content} className="mt-8" />
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/randevu" className="rounded-full bg-sage px-6 py-3 text-white hover:bg-sage-dark">
            Randevu al
          </Link>
          {wa ? (
            <a href={wa} target="_blank" rel="noreferrer" className="rounded-full bg-[#25D366] px-6 py-3 text-white">
              WhatsApp
            </a>
          ) : null}
          {tel ? (
            <a href={tel} className="rounded-full border border-sage px-6 py-3 text-sage-dark">
              Ara · {clinic.phone}
            </a>
          ) : null}
        </div>
      </article>
    </PublicShell>
  );
}
