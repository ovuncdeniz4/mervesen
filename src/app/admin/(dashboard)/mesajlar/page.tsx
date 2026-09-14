import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { formatDateTime } from "@/lib/dates";
import { deleteMessage, markMessageRead } from "@/lib/actions/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function MessagesPage() {
  await requireAdmin();
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="İletişim mesajları"
        description="Sitedeki iletişim formundan gelen talepler. Okunmamışlar vurgulanır."
      />

      {messages.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">Mesaj yok.</CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {messages.map((item) => (
            <li key={item.id}>
              <Card className={item.read ? "" : "ring-burgundy/30 bg-champagne/30"}>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.phone}
                        {item.email ? ` · ${item.email}` : ""} · {formatDateTime(item.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <form
                        action={async () => {
                          "use server";
                          await markMessageRead(item.id, !item.read);
                        }}
                      >
                        <Button type="submit" variant="outline" size="sm">
                          {item.read ? "Okunmadı yap" : "Okundu"}
                        </Button>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await deleteMessage(item.id);
                        }}
                      >
                        <Button type="submit" variant="destructive" size="sm">
                          Sil
                        </Button>
                      </form>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{item.message}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
