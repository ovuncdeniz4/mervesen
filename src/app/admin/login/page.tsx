import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="text-xs uppercase tracking-lux text-taupe">Yönetim</p>
          <CardTitle className="font-serif text-3xl">Admin girişi</CardTitle>
          <CardDescription>Randevu takvimi ve klinik ayarları.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-6 text-center">
            <Button variant="link" asChild>
              <Link href="/">Siteye dön</Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
