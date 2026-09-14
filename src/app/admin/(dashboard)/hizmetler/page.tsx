import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { deleteService, saveServiceForm } from "@/lib/actions/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function ServicesAdminPage() {
  await requireAdmin();
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Hizmetler"
        description="Sitede görünen tedaviler. Süre yalnızca admin takviminde kullanılır, hasta yüzünde gösterilmez."
      />

      {services.map((service) => (
        <ServiceForm key={service.id} service={service} />
      ))}

      <ServiceForm />
    </div>
  );
}

function ServiceForm({
  service,
}: {
  service?: {
    id: string;
    name: string;
    slug: string;
    summary: string;
    content: string;
    durationMin: number;
    imagePath: string;
    sortOrder: number;
    published: boolean;
    featured: boolean;
  };
}) {
  const isNew = !service;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? "Yeni hizmet" : service.name}</CardTitle>
        {isNew ? (
          <CardDescription>Slug benzersiz olmalı; görsel yolu public klasörüne göre.</CardDescription>
        ) : (
          <CardDescription>{service.slug}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form action={saveServiceForm} className="grid gap-4">
          {service ? <input type="hidden" name="id" value={service.id} /> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`name-${service?.id ?? "new"}`}>Ad</Label>
              <Input id={`name-${service?.id ?? "new"}`} name="name" defaultValue={service?.name} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`slug-${service?.id ?? "new"}`}>Slug</Label>
              <Input id={`slug-${service?.id ?? "new"}`} name="slug" defaultValue={service?.slug} required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`summary-${service?.id ?? "new"}`}>Kısa özet</Label>
            <Input id={`summary-${service?.id ?? "new"}`} name="summary" defaultValue={service?.summary} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`content-${service?.id ?? "new"}`}>İçerik</Label>
            <Textarea
              id={`content-${service?.id ?? "new"}`}
              name="content"
              rows={6}
              defaultValue={service?.content}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`imagePath-${service?.id ?? "new"}`}>Görsel yolu</Label>
            <Input
              id={`imagePath-${service?.id ?? "new"}`}
              name="imagePath"
              defaultValue={service?.imagePath}
              placeholder="/images/services/..."
            />
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`durationMin-${service?.id ?? "new"}`}>Süre (dk, sitede gizlenir)</Label>
              <Input
                id={`durationMin-${service?.id ?? "new"}`}
                type="number"
                name="durationMin"
                defaultValue={service?.durationMin ?? 30}
                className="w-28"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`sortOrder-${service?.id ?? "new"}`}>Sıra</Label>
              <Input
                id={`sortOrder-${service?.id ?? "new"}`}
                type="number"
                name="sortOrder"
                defaultValue={service?.sortOrder ?? 99}
                className="w-28"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="published"
                defaultChecked={service?.published ?? true}
                className="size-4 accent-burgundy"
              />
              Yayında
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={service?.featured ?? false}
                className="size-4 accent-burgundy"
              />
              Anasayfada
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit">Kaydet</Button>
            {service ? (
              <button
                type="submit"
                className={buttonVariants({ variant: "destructive" })}
                formAction={async () => {
                  "use server";
                  await deleteService(service.id);
                }}
              >
                Sil / gizle
              </button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
