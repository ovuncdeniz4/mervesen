export const ADMIN_LINKS = [
  { href: "/admin", label: "Özet" },
  { href: "/admin/takvim", label: "Takvim" },
  { href: "/admin/randevular", label: "Randevular" },
  { href: "/admin/saatler", label: "Saatler" },
  { href: "/admin/hizmetler", label: "Hizmetler" },
  { href: "/admin/mesajlar", label: "Mesajlar" },
  { href: "/admin/ayarlar", label: "Ayarlar" },
] as const;

export function adminLinkActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}
