import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { formatDateTime } from "@/lib/dates";
import { deleteMessage, markMessageRead } from "@/lib/actions/admin";

export default async function MessagesPage() {
  await requireAdmin();
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-serif text-3xl text-sage-dark">Mesajlar</h1>
      <ul className="mt-6 space-y-4">
        {messages.length === 0 ? <li className="text-ink-soft">Mesaj yok.</li> : null}
        {messages.map((item) => (
          <li
            key={item.id}
            className={`rounded-2xl p-4 ring-1 ring-cream-dark ${item.read ? "bg-paper" : "bg-sage-light/40"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-ink-soft">
                  {item.phone}
                  {item.email ? ` · ${item.email}` : ""} · {formatDateTime(item.createdAt)}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <form
                  action={async () => {
                    "use server";
                    await markMessageRead(item.id, !item.read);
                  }}
                >
                  <button className="underline">{item.read ? "Okunmadı yap" : "Okundu"}</button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await deleteMessage(item.id);
                  }}
                >
                  <button className="text-red-800 underline">Sil</button>
                </form>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-ink-soft">{item.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
