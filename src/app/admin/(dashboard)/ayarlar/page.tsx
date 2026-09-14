import { requireAdmin } from "@/lib/require-admin";
import { getClinicSettings } from "@/lib/clinic";
import { updateClinicSettings } from "@/lib/actions/admin";
import { TestNotifyForm } from "@/components/admin/TestNotifyForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
    <div className="space-y-6">
      <AdminPageHeader
        title="Klinik ayarları"
        description="Telefon ve WhatsApp boşsa sitede arama ve yeşil buton gizlenir."
      />

      <Card>
        <CardHeader>
          <CardTitle>Klinik bilgileri</CardTitle>
          <CardDescription>Herkese açık sitede kullanılan iletişim ve içerik alanları.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateClinicSettings} className="grid max-w-3xl gap-4">
            {fields.map((field) => (
              <div key={field.name} className="grid gap-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.rows ? (
                  <Textarea
                    id={field.name}
                    name={field.name}
                    rows={field.rows}
                    defaultValue={String(clinic[field.name] ?? "")}
                  />
                ) : (
                  <Input id={field.name} name={field.name} defaultValue={String(clinic[field.name] ?? "")} />
                )}
              </div>
            ))}
            <Button type="submit" className="w-fit">
              Kaydet
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Randevu e-postası</CardTitle>
          <CardDescription>Resend env’ini randevu almadan doğrulamak için test maili.</CardDescription>
        </CardHeader>
        <CardContent>
          <TestNotifyForm />
        </CardContent>
      </Card>
    </div>
  );
}
