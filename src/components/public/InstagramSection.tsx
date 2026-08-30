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
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-sm uppercase tracking-widest text-gold">Instagram</p>
          <h2 className="mt-1 font-serif text-3xl text-sage-dark sm:text-4xl">Tedavi sonuçları @ {INSTAGRAM_HANDLE}</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Before-after fotoğrafları ve klinik paylaşımları Instagram hesabımızda yer alır. Siteye gelen ziyaretçiler
            buradan doğrudan profile ulaşabilir, gülüş tasarımı ve restorasyon örneklerini görebilir.
          </p>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-full bg-sage px-6 py-3 text-white hover:bg-sage-dark"
          >
            Instagram’daki before-after paylaşımlarını görün
          </a>
        </div>
        <div className="overflow-hidden rounded-3xl bg-paper ring-1 ring-cream-dark">
          <blockquote
            className="instagram-media w-full"
            data-instgrm-permalink={href}
            data-instgrm-version="14"
            style={{ margin: 0, maxWidth: "100%" }}
          >
            <a href={href} target="_blank" rel="noreferrer" className="block p-6 text-sage-dark underline">
              @{INSTAGRAM_HANDLE} profilini aç
            </a>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
