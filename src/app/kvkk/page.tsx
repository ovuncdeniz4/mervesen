import type { Metadata } from "next";
import { getClinicSettings } from "@/lib/clinic";
import { PublicShell } from "@/components/public/PublicShell";

export const metadata: Metadata = { title: "KVKK" };

export default async function KvkkPage() {
  const clinic = await getClinicSettings();
  return (
    <PublicShell clinic={clinic}>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 leading-relaxed text-ink-soft">
        <h1 className="font-serif text-4xl text-sage-dark">Kişisel verilerin korunması</h1>
        <p className="mt-6">
          {clinic.clinicName} (“Klinik”), 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusudur.
          Randevu ve iletişim formları üzerinden ad, soyad, telefon, e-posta ve sağlık şikâyetine ilişkin notlarınız
          toplanır.
        </p>
        <h2 className="mt-8 font-serif text-2xl text-sage-dark">Amaç</h2>
        <p className="mt-2">
          Veriler randevu oluşturmak, sizinle iletişime geçmek, tedavi sürecini planlamak ve yasal saklama
          yükümlülüklerini yerine getirmek için işlenir.
        </p>
        <h2 className="mt-8 font-serif text-2xl text-sage-dark">Aktarım</h2>
        <p className="mt-2">
          Verileriniz, yasal zorunluluklar dışında üçüncü kişilere pazarlama amacıyla satılmaz. Barındırma ve teknik
          altyapı sağlayıcıları, hizmetin çalışması için sınırlı erişime sahip olabilir.
        </p>
        <h2 className="mt-8 font-serif text-2xl text-sage-dark">Haklarınız</h2>
        <p className="mt-2">
          KVKK m.11 kapsamındaki haklarınızı {clinic.address} adresine yazılı başvurarak veya iletişim formundan
          kullanarak iletebilirsiniz. Randevu kaydınızı silmemizi istediğinizde, mevzuatın zorunlu kıldığı saklama
          süreleri saklı kalır.
        </p>
      </article>
    </PublicShell>
  );
}
