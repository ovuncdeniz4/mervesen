"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { logoutAdmin } from "@/lib/actions/auth";
import { ADMIN_LINKS, adminLinkActive } from "@/components/admin/admin-links";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

/** Admin kenar menü + mobilde sheet. shadcn yalnızca bu yüzeyde. */
export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden bg-sidebar text-sidebar-foreground md:flex md:w-56 md:flex-col md:border-r md:border-sidebar-border">
        <NavBrand email={email} />
        <NavLinks pathname={pathname} />
        <LogoutButton />
      </aside>
      <div className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-3 py-2 text-sidebar-foreground md:hidden">
        <p className="font-serif text-lg text-ivory">Klinik</p>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="sidebar" size="icon-sm">
              <MenuIcon />
              <span className="sr-only">Menü</span>
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
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {ADMIN_LINKS.map((item) => {
        const active = adminLinkActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3 py-2 text-sm ${
              active ? "bg-sidebar-accent text-ivory" : "hover:bg-sidebar-accent/80 hover:text-ivory"
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
      <Button type="submit" variant="sidebar-ghost" className="w-full justify-start">
        Çıkış
      </Button>
    </form>
  );
}
