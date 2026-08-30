import { requireAdmin } from "@/lib/require-admin";
import { getClinicSettings } from "@/lib/clinic";
import { updateClinicSettings } from "@/lib/actions/admin";
import { TestNotifyForm } from "@/components/admin/TestNotifyForm";

export default async function SettingsPage() {
  await requireAdmin();
  const clinic = await getClinicSettings();
  const fields: { name: keyof typeof clinic; label: string; rows?: number }[] = [
    { name: "clinicName", label: "Klinik adı" },
    { name: "doctorName", label: "Hekim adı" },
    { name: "phone", label: "Telefon" },
    { name: "whatsapp", label: "WhatsApp (5xx… veya 90…)" },
    { name: "instagramUrl", label: "Instagram URL" },
    { name: "email", label: "E-posta" },
    { name: "address", label: "Adres" },
    { name: "mapsUrl", label: "Harita linki" },
    { name: "mapsEmbedUrl", label: "Harita embed URL" },
    { name: "tagline", label: "Kısa slogan" },
    { name: "aboutShort", label: "Kısa tanıtım", rows: 3 },
    { name: "aboutLong", label: "Uzun tanıtım", rows: 8 },
    { name: "doctorBio", label: "Hekim biyografisi", rows: 8 },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-sage-dark">Ayarlar</h1>
      <p className="mt-2 text-sm text-ink-soft">Telefon ve WhatsApp boşsa sitede arama ve yeşil buton gizlenir.</p>
      <form action={updateClinicSettings} className="mt-6 grid max-w-3xl gap-4">
        {fields.map((field) => (
          <label key={field.name} className="block text-sm">
            {field.label}
            {field.rows ? (
              <textarea
                name={field.name}
                rows={field.rows}
                defaultValue={String(clinic[field.name] ?? "")}
                className="mt-1 w-full rounded-xl border border-cream-dark bg-paper px-3 py-2"
              />
            ) : (
              <input
                name={field.name}
                defaultValue={String(clinic[field.name] ?? "")}
                className="mt-1 w-full rounded-xl border border-cream-dark bg-paper px-3 py-2"
              />
            )}
          </label>
        ))}
        <button className="w-fit rounded-full bg-sage px-6 py-2 text-white">Kaydet</button>
      </form>
      <TestNotifyForm />
    </div>
  );
}
