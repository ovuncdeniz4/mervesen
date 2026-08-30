"use client";

import { useEffect } from "react";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/content/about";

export function InstagramSection({ instagramUrl }: { instagramUrl: string }) {
  const href = instagramUrl || INSTAGRAM_URL;

  useEffect(() => {
    const existing = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
    if (existing) {
      const instgrm = (window as unknown as { instgrm?: { Embeds: { process: () => void } } }).instgrm;
      instgrm?.Embeds.process();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-taupe">Instagram</p>
          <h2 className="mt-2 font-serif text-3xl text-espresso sm:text-4xl">Tedavi sonuçları @ {INSTAGRAM_HANDLE}</h2>
          <p className="mt-5 leading-relaxed text-muted">
            Before-after fotoğrafları ve klinik paylaşımları Instagram hesabımızda yer alır. Siteye gelen ziyaretçiler
            buradan doğrudan profile ulaşabilir, gülüş tasarımı ve restorasyon örneklerini görebilir.
          </p>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex rounded-md bg-burgundy px-6 py-3 text-ivory transition-colors hover:bg-champagne hover:text-espresso"
          >
            Instagram’daki before-after paylaşımlarını görün
          </a>
        </div>
        <div className="overflow-hidden rounded-lg border border-champagne bg-paper">
          <blockquote
            className="instagram-media w-full"
            data-instgrm-permalink={href}
            data-instgrm-version="14"
            style={{ margin: 0, maxWidth: "100%" }}
          >
            <a href={href} target="_blank" rel="noreferrer" className="block p-6 text-espresso underline decoration-champagne underline-offset-4">
              @{INSTAGRAM_HANDLE} profilini aç
            </a>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
