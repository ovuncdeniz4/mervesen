import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getClinicSettings } from "@/lib/clinic";
import { PublicShell, Prose } from "@/components/public/PublicShell";
import { serviceImageSrc } from "@/lib/public-image";

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
  const imageSrc = serviceImageSrc(service.slug, service.imagePath);

  return (
    <PublicShell clinic={clinic}>
      <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
        <Link href="/hizmetler" className="text-sm text-espresso underline decoration-champagne underline-offset-4">
          ← Tüm hizmetler
        </Link>
        {imageSrc ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg border border-champagne">
            <Image
              src={imageSrc}
              alt={service.name}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 768px, 100vw"
              priority
            />
          </div>
        ) : null}
        <h1 className="mt-8 font-serif text-4xl text-espresso sm:text-5xl">{service.name}</h1>
        <Prose text={service.content} className="mt-8" />
        <Link
          href="/randevu"
          className="mt-12 inline-block rounded-md bg-burgundy px-6 py-3 text-ivory transition-colors hover:bg-champagne hover:text-espresso"
        >
          Randevu al
        </Link>
      </article>
    </PublicShell>
  );
}
