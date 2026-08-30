import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { deleteService, saveServiceForm } from "@/lib/actions/admin";

export default async function ServicesAdminPage() {
  await requireAdmin();
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-10">
      <h1 className="font-serif text-3xl text-sage-dark">Hizmetler</h1>
      {services.map((service) => (
        <ServiceForm key={service.id} service={service} />
      ))}
      <section>
        <h2 className="font-serif text-2xl text-sage-dark">Yeni hizmet</h2>
        <ServiceForm />
      </section>
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
    sortOrder: number;
    published: boolean;
    featured: boolean;
  };
}) {
  return (
    <form action={saveServiceForm} className="grid gap-3 rounded-2xl bg-paper p-4 ring-1 ring-cream-dark">
      {service ? <input type="hidden" name="id" value={service.id} /> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" defaultValue={service?.name} placeholder="Ad" required className="rounded-xl border border-cream-dark px-3 py-2" />
        <input name="slug" defaultValue={service?.slug} placeholder="slug" required className="rounded-xl border border-cream-dark px-3 py-2" />
      </div>
      <input name="summary" defaultValue={service?.summary} placeholder="Kısa özet" required className="rounded-xl border border-cream-dark px-3 py-2" />
      <textarea name="content" defaultValue={service?.content} rows={6} required className="rounded-xl border border-cream-dark px-3 py-2" />
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          Süre
          <input type="number" name="durationMin" defaultValue={service?.durationMin ?? 30} className="ml-2 w-20 rounded border px-2 py-1" />
        </label>
        <label className="text-sm">
          Sıra
          <input type="number" name="sortOrder" defaultValue={service?.sortOrder ?? 99} className="ml-2 w-20 rounded border px-2 py-1" />
        </label>
        <label className="text-sm">
          <input type="checkbox" name="published" defaultChecked={service?.published ?? true} className="mr-1" />
          Yayında
        </label>
        <label className="text-sm">
          <input type="checkbox" name="featured" defaultChecked={service?.featured ?? false} className="mr-1" />
          Anasayfada
        </label>
      </div>
      <div className="flex gap-3">
        <button className="rounded-full bg-sage px-4 py-2 text-white">Kaydet</button>
        {service ? (
          <button
            formAction={async () => {
              "use server";
              await deleteService(service.id);
            }}
            className="text-sm text-red-800 underline"
          >
            Sil / gizle
          </button>
        ) : null}
      </div>
    </form>
  );
}
