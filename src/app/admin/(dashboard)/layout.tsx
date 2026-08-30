import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";
import { logoutAdmin } from "@/lib/actions/auth";

const links = [
  { href: "/admin", label: "Özet" },
  { href: "/admin/takvim", label: "Takvim" },
  { href: "/admin/randevular", label: "Randevular" },
  { href: "/admin/saatler", label: "Saatler" },
  { href: "/admin/hizmetler", label: "Hizmetler" },
  { href: "/admin/mesajlar", label: "Mesajlar" },
  { href: "/admin/ayarlar", label: "Ayarlar" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-white/10 bg-espresso text-champagne md:w-56 md:border-b-0 md:border-r">
        <div className="px-4 py-5">
          <p className="font-serif text-xl text-ivory">Klinik</p>
          <p className="truncate text-xs text-champagne/70">{session.user.email}</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm hover:bg-white/10 hover:text-ivory"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAdmin} className="px-4 pb-4">
          <button type="submit" className="text-sm text-taupe hover:text-ivory">
            Çıkış
          </button>
        </form>
      </aside>
      <div className="flex-1 bg-ivory p-4 sm:p-8">{children}</div>
    </div>
  );
}
