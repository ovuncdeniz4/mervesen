# Diş Hekimi Merve Şen Aşkar

Bayraklı / İzmir’de tek hekimli klinik sitesi: tanıtım, hizmetler, canlı randevu takvimi ve admin paneli.

## Geliştirme

Postgres bağlantısı gerekir (Vercel Storage’daki veritabanı veya yerel Postgres). `.env` içine `DATABASE_URL` ve `DIRECT_URL` yazın — tek URL varsa ikisine de aynı değeri koyun.

```bash
cp .env.example .env
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Telefon: `0554 993 01 23` · WhatsApp aynı numara · Instagram: [@dtmervesen](https://www.instagram.com/dtmervesen/)

## Vercel’de yayınlama

1. [vercel.com/new](https://vercel.com/new) → GitHub deposu `ovuncdeniz4/mervesen` → Production branch `main`.
2. Storage’da oluşturduğunuz Postgres’i bu projeye **bağlayın** (Connect). Vercel çoğu zaman `DATABASE_URL` ekler.
3. **Settings → Environment Variables** (Production):

   | İsim | Değer |
   |------|--------|
   | `DATABASE_URL` | Storage’daki **pooled / Prisma** bağlantı dizesi |
   | `DIRECT_URL` | Storage’daki **direct / non-pooling** dize (yalnızca bir dize varsa `DATABASE_URL` ile aynı) |
   | `AUTH_SECRET` | `openssl rand -base64 32` çıktısı |
   | `AUTH_TRUST_HOST` | `true` |
   | `ADMIN_EMAIL` | Sizin admin e-postanız |
   | `ADMIN_PASSWORD` | Yeni güçlü şifre (demo şifreyi kullanmayın) |

4. Deploy. Build `prisma db push` ve seed çalıştırır (hizmetler + ilk admin; klinik saatlerini ve ayarları tekrar ezmez).
5. **Settings → Domains** ile kendi alan adınızı ekleyin.

### Randevu e-posta bildirimi (ücretsiz)

SMS ücretlidir; bildirim e-posta ile gider. [Resend](https://resend.com) ücretsiz kotası (ayda birkaç bin mail) yeterli.

1. resend.com’da ücretsiz hesap açın, **API Keys** → bir anahtar kopyalayın.
2. Vercel → **Settings → Environment Variables** (Production + Preview):
   - `RESEND_API_KEY` — o anahtar
   - `NOTIFY_EMAIL` — Resend’e **kayıt olduğunuz e-posta ile birebir aynı**. `NOTIFY_FROM` gerekmez.
3. Env kaydettikten sonra **Deployments → ⋮ → Redeploy**. Eski deploy eski env ile çalışır.
4. Site yayına girdikten sonra `/admin/ayarlar` → **Test maili gönder**. Başarı/hata metni ekranda çıkar.

Mail gelmezse kontrol sırası:

1. Test butonundaki hata metni (eksik env, `.local` alıcı, Resend reddi).
2. Resend paneli → **Emails**: gönderildi mi, bounce mu, “only send to your email” mi.
3. Gelen kutu **spam / junk**.
4. Vercel → ilgili deployment → **Logs**: `[notify]` satırı (from, NOTIFY_FROM, HTTP, Resend body). API anahtarı loglanmaz.
5. Resend logunda `Verify example.com` **genel 403 metnidir**, domain eklemeyin. Satırın **From** alanı `onboarding@resend.dev`, **To** alanı Resend kayıt e-postanız olmalı. To farklıysa `NOTIFY_EMAIL`’i düzeltip Redeploy edin.
6. Kendi alan adınızı Resend’de doğrulamadan `NOTIFY_EMAIL` hesap e-postasından farklı olamaz.

Admin: `https://your-domain.com/admin/login`

Mimari: [docs/architecture.md](docs/architecture.md)
