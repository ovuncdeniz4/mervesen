import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { getClinicSettings } from "@/lib/clinic";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const clinic = await getClinicSettings().catch(() => null);
  const title = clinic?.clinicName ?? "Diş Hekimi Merve Şen Aşkar";
  const description =
    clinic?.tagline ?? "Bayraklı / İzmir’de diş hekimi muayenehanesi. Randevu ve tedavi bilgisi.";
  return {
    title: {
      default: title,
      template: `%s · ${title}`,
    },
    description,
    openGraph: { title, description, locale: "tr_TR", type: "website" },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${outfit.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
