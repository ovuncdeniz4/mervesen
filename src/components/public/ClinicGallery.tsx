import Image from "next/image";
import { clinicGallery, doctorPortraits } from "@/lib/content/about";
import { existingImages } from "@/lib/public-image";

export function PhotoGrid({
  items,
  className = "",
}: {
  items: { src: string; alt: string }[];
  className?: string;
}) {
  const visible = existingImages(items);
  if (visible.length === 0) return null;
  return (
    <div className={`grid gap-3 ${className}`}>
      {visible.map((item) => (
        <figure key={item.src} className="relative min-h-56 overflow-hidden rounded-3xl bg-sage-light">
          <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
        </figure>
      ))}
    </div>
  );
}

export function ClinicGallery() {
  return <PhotoGrid items={clinicGallery} className="sm:grid-cols-2" />;
}

export function DoctorPortraits() {
  return <PhotoGrid items={doctorPortraits} className="sm:grid-cols-2" />;
}
