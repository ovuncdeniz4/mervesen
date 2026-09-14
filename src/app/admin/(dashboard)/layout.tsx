import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/require-admin";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdmin();
  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <AdminNav email={session.user.email ?? ""} />
      <div className="flex-1 p-4 sm:p-8">{children}</div>
    </div>
  );
}
