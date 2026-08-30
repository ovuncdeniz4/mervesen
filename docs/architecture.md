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
- `src/lib/content/` — hizmet metinleri, hakkımızda, Google yorumları
- `prisma/` — şema ve seed
- `public/images/` — klinik, hekim ve hizmet görselleri
- `docs/` — bu mimari dosya

Yeni ekran eklerken mevcut rota ve klasör hiyerarşisine uy; paralel `pages/` veya ikinci bir app kökü açma.

## Public sayfalar

| Rota | Amaç |
|------|------|
| `/` | Hero, tedaviler, hekim, klinik galerisi, Google yorumları, Instagram |
| `/hakkimizda` | Sabit hakkımızda metni, hekim ve klinik görselleri |
| `/hizmetler` | Tedavi listesi (süre gösterilmez) |
| `/hizmetler/[slug]` | Tedavi detay + stok görsel |
| `/randevu` | Bilgi + canlı slot; hizmet seçimi yok |
| `/iletisim` | Adres, harita, form, telefon/WhatsApp, yorumlar |
| `/sss` | Sık sorulanlar |
| `/kvkk` | Aydınlatma metni |

Tüm hasta yüzü Türkçe. SEO: sayfa `metadata` + anasayfada LocalBusiness JSON-LD.

## Randevu kuralları

1. Hasta hizmet seçmez. Ad soyad, telefon (e-posta/not isteğe bağlı) ve KVKK sonrası takvimden boş slot seçer.
2. Public slot süresi `ClinicSettings.slotIntervalMin` (varsayılan 30 dk). Kayıt içerde `genel-muayene` hizmetine bağlanır.
3. Takvim yalnızca müsait slot gösterir: çalışma saatleri − `CONFIRMED` randevular − `BlockedSlot`.
4. Geçmiş, `minNoticeHours` içi ve `maxAdvanceDays` dışı slot yok.
5. Kapalı gün ve blok aralıklarında slot üretilmez.
6. Rezervasyon Prisma transaction içinde overlap kontrolü ile atomik yazılır; çakışırsa hata döner.
7. Durumlar: `CONFIRMED` (anında), `CANCELLED`, `COMPLETED`.
8. KVKK onayı olmadan kayıt oluşmaz.

Hasta yüzünde tedavi süresi gösterilmez; süre kişiden kişiye değişir. `Service.durationMin` yalnızca admin manuel randevuda kullanılır.

WhatsApp ve telefon `ClinicSettings` üzerinden gelir (0554 993 01 23). Yazma ve arama yalnızca sağ alttaki FAB düğmelerindedir.

Admin iptal, erteleme, manuel randevu ve blok ekleyebilir. İptal edilen slot tekrar açılır. Admin manuel randevuda hizmet seçebilir.

## Admin

- `/admin/login` — e-posta + şifre
- `/admin` — özet
- `/admin/takvim` — gün görünümü
- `/admin/randevular` — liste ve durum
- `/admin/hizmetler` — CRUD + yayın
- `/admin/saatler` — çalışma saatleri ve bloklar
- `/admin/mesajlar` — iletişim formu
- `/admin/ayarlar` — telefon, WhatsApp, Instagram, adres, bio

Admin olmayan istekler `/admin/login`e yönlendirilir. Session HTTP-only cookie.

## Veri

- `ClinicSettings` — tek satır iletişim, Instagram ve metin
- `Service` — slug, içerik, `imagePath`, `durationMin` (iç kullanım), `published`
- `WorkingHours` — weekday 0–6 (Pazar=0)
- `BlockedSlot` — tatil / öğle arası
- `Appointment` — hasta ve zaman aralığı
- `ContactMessage` — iletişim formu
- `AdminUser` — giriş

## Medya ve sosyal

- Klinik/hekim görselleri `public/images/clinic` ve `public/images/doctor` (anasayfa hero: `doctor/hero.jpg` + sola uzatılmış `doctor/hero-wide.jpg`)
- Hizmet stok görselleri `public/images/services/{slug}.jpg`
- Instagram: `https://www.instagram.com/dtmervesen/` — before-after için profil embed + CTA
- Google yorumları: sitede 5.0 / 42 özeti ve Maps’ten alınan özgün yorumlar; tam liste Google Haritalar’da

## Tasarım

Sıcak krem zemin, sage/teal vurgu, serif başlık + sans gövde. Kurumsal çok şubeli poliklinik şablonu değil; tek hekim, sakin pratik. Mobil öncelikli.

## Bilinçli dışı

Online ödeme, SGK, hasta portalı, blog, çoklu hekim/şube, i18n.
