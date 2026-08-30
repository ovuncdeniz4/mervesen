import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="w-full max-w-md rounded-lg border border-champagne bg-paper p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-taupe">Yönetim</p>
        <h1 className="mt-2 font-serif text-3xl text-espresso">Admin girişi</h1>
        <p className="mb-6 mt-2 text-sm text-muted">Randevu takvimi ve klinik ayarları.</p>
        <LoginForm />
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-espresso underline decoration-champagne underline-offset-4">
            Siteye dön
          </Link>
        </p>
      </div>
    </div>
  );
}
