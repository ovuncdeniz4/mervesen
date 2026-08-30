import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-paper p-8 ring-1 ring-cream-dark">
        <p className="text-sm uppercase tracking-widest text-gold">Yönetim</p>
        <h1 className="mt-2 font-serif text-3xl text-sage-dark">Admin girişi</h1>
        <p className="mb-6 mt-2 text-sm text-ink-soft">Randevu takvimi ve klinik ayarları.</p>
        <LoginForm />
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-sage-dark underline">
            Siteye dön
          </Link>
        </p>
      </div>
    </div>
  );
}
