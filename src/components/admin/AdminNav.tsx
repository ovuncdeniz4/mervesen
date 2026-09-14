"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { logoutAdmin } from "@/lib/actions/auth";
import { ADMIN_LINKS, adminLinkActive } from "@/components/admin/admin-links";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

/** Admin kenar menü; mobilde hamburger + sheet, masaüstünde sabit sütun. */
export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <>
      <aside className="admin-sidebar">
        <NavBrand email={email} />
        <NavLinks pathname={pathname} />
        <LogoutButton />
      </aside>

      <div className="admin-topbar">
        <p className="font-serif text-lg text-ivory">Klinik</p>
        <Sheet key={pathname}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-11 border-champagne/40 bg-transparent px-3 text-ivory"
            >
              <MenuIcon />
              Menü
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-sidebar text-sidebar-foreground">
            <SheetHeader>
              <SheetTitle className="font-serif text-ivory">Klinik</SheetTitle>
            </SheetHeader>
            <NavLinks pathname={pathname} />
            <LogoutButton />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

function NavBrand({ email }: { email: string }) {
  return (
    <div className="px-4 py-5">
      <p className="font-serif text-xl text-ivory">Klinik</p>
      <p className="truncate text-xs text-sidebar-foreground/70">{email}</p>
    </div>
  );
}

function NavLinks({ pathname }: { pathname: string }) {
  return (
    <nav className="admin-nav-links flex-1">
      {ADMIN_LINKS.map((item) => {
        const active = adminLinkActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3 py-2.5 text-sm ${
              active ? "bg-sidebar-accent text-ivory" : "text-champagne hover:bg-sidebar-accent/80 hover:text-ivory"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function LogoutButton() {
  return (
    <form action={logoutAdmin} className="p-4">
      <Separator className="mb-4 bg-sidebar-border" />
      <Button type="submit" variant="ghost" className="h-11 w-full justify-start text-sidebar-foreground">
        Çıkış
      </Button>
    </form>
  );
}
