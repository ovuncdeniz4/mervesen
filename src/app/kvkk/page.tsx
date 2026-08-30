import type { Metadata } from "next";
import { getClinicSettings } from "@/lib/clinic";
import { PublicShell } from "@/components/public/PublicShell";

export const metadata: Metadata = { title: "KVKK" };

export default async function KvkkPage() {
  const clinic = await getClinicSettings();
  return (
    <PublicShell clinic={clinic}>
      <article className="mx-auto max-w-3xl px-4 py-20 leading-relaxed text-muted sm:px-6 sm:py-24">
        <h1 className="font-serif text-4xl text-espresso">Kişisel verilerin korunması</h1>
        <p className="mt-8">
          {clinic.clinicName} (“Klinik”), 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusudur.
          Randevu ve iletişim formları üzerinden ad, soyad, telefon, e-posta ve sağlık şikâyetine ilişkin notlarınız
          toplanır.
        </p>
        <h2 className="mt-10 font-serif text-2xl text-espresso">Amaç</h2>
        <p className="mt-3">
          Veriler randevu oluşturmak, sizinle iletişime geçmek, tedavi sürecini planlamak ve yasal saklama
          yükümlülüklerini yerine getirmek için işlenir.
        </p>
        <h2 className="mt-10 font-serif text-2xl text-espresso">Aktarım</h2>
        <p className="mt-3">
          Verileriniz, yasal zorunluluklar dışında üçüncü kişilere pazarlama amacıyla satılmaz. Barındırma ve teknik
          altyapı sağlayıcıları, hizmetin çalışması için sınırlı erişime sahip olabilir.
        </p>
        <h2 className="mt-10 font-serif text-2xl text-espresso">Haklarınız</h2>
        <p className="mt-3">
          KVKK m.11 kapsamındaki haklarınızı {clinic.address} adresine yazılı başvurarak veya iletişim formundan
          kullanarak iletebilirsiniz. Randevu kaydınızı silmemizi istediğinizde, mevzuatın zorunlu kıldığı saklama
          süreleri saklı kalır.
        </p>
      </article>
    </PublicShell>
  );
}
