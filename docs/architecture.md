# Klinik web sitesi mimarisi

Tek hekimli pratik: **Diş Hekimi Merve Şen Aşkar** (Bayraklı / İzmir).
Public site, canlı randevu ve admin paneli aynı Next.js uygulamasında yaşar.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Prisma + SQLite (tek hekim; şema Postgres’e taşınabilir)
- Auth.js (credentials) — yalnızca admin
- Server Actions — randevu, iletişim formu, admin CRUD
- `src/` kökü, `@/` alias

Expo / React Native kullanılmaz. Bu bir web uygulamasıdır.

## Klasörler

- `src/app/` — public rotalar, `admin/` paneli, `api/auth` session
- `src/components/` — layout, UI, randevu ve admin bileşenleri
- `src/lib/` — Prisma istemcisi, auth, müsaitlik motoru, server actions
- `prisma/` — şema ve seed
- `docs/` — bu mimari dosya

Yeni ekran eklerken mevcut rota ve klasör hiyerarşisine uy; paralel `pages/` veya ikinci bir app kökü açma.

## Public sayfalar

| Rota | Amaç |
|------|------|
| `/` | Hero, tedaviler, hekim, konum, randevu CTA |
| `/hakkimizda` | Hekim ve klinik yaklaşımı |
| `/hizmetler` | Tedavi listesi |
| `/hizmetler/[slug]` | Tedavi detay |
| `/randevu` | Canlı slot seçimi ve rezervasyon |
| `/iletisim` | Adres, harita, form, telefon/WhatsApp |
| `/sss` | Sık sorulanlar |
| `/kvkk` | Aydınlatma metni |

Tüm hasta yüzü Türkçe. SEO: sayfa `metadata` + anasayfada LocalBusiness JSON-LD.

## Randevu kuralları

1. Hasta hizmet seçer (süre hizmet kaydındaki `durationMin`).
2. Takvim yalnızca müsait slot gösterir: çalışma saatleri − `CONFIRMED` randevular − `BlockedSlot`.
3. Geçmiş, `minNoticeHours` içi ve `maxAdvanceDays` dışı slot yok.
4. Kapalı gün ve blok aralıklarında slot üretilmez.
5. Rezervasyon Prisma transaction içinde overlap kontrolü ile atomik yazılır; çakışırsa hata döner.
6. Durumlar: `CONFIRMED` (anında), `CANCELLED`, `COMPLETED`.
7. KVKK onayı olmadan kayıt oluşmaz.

Admin iptal, erteleme, manuel randevu ve blok ekleyebilir. İptal edilen slot tekrar açılır.

## Admin

- `/admin/login` — e-posta + şifre
- `/admin` — özet
- `/admin/takvim` — gün görünümü
- `/admin/randevular` — liste ve durum
- `/admin/hizmetler` — CRUD + yayın
- `/admin/saatler` — çalışma saatleri ve bloklar
- `/admin/mesajlar` — iletişim formu
- `/admin/ayarlar` — telefon, WhatsApp, adres, bio

Admin olmayan istekler `/admin/login`e yönlendirilir. Session HTTP-only cookie.

## Veri

- `ClinicSettings` — tek satır iletişim ve metin
- `Service` — slug, süre, içerik, `published`
- `WorkingHours` — weekday 0–6 (Pazar=0)
- `BlockedSlot` — tatil / öğle arası
- `Appointment` — hasta ve zaman aralığı
- `ContactMessage` — iletişim formu
- `AdminUser` — giriş

## Tasarım

Sıcak krem zemin, sage/teal vurgu, serif başlık + sans gövde. Kurumsal çok şubeli poliklinik şablonu değil; tek hekim, sakin pratik. Mobil öncelikli. WhatsApp floating butonu ayarlardaki numaradan gelir.

## Bilinçli dışı

Online ödeme, SGK, hasta portalı, blog, çoklu hekim/şube, i18n.
