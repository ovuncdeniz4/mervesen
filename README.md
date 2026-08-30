# Diş Hekimi Merve Şen Aşkar

Bayraklı / İzmir’de tek hekimli klinik sitesi: tanıtım, hizmetler, canlı randevu takvimi ve admin paneli.

## Geliştirme

```bash
cp .env.example .env
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Varsayılan giriş (`.env`): `admin@mervesenaskar.local` / `MerveAdmin2026`

Telefon ve WhatsApp numaralarını admin → Ayarlar’dan girin; boşken arama ve yüzen WhatsApp gizlenir.

Mimari: [docs/architecture.md](docs/architecture.md)
