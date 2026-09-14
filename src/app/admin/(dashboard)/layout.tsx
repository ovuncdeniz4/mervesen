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
    <div className="admin-shell">
      <AdminNav email={session.user.email ?? ""} />
      <div className="admin-main">{children}</div>
    </div>
  );
}
