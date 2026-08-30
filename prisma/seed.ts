import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { aboutLong, aboutShort, DEFAULT_PHONE, DEFAULT_WHATSAPP, doctorBio, INSTAGRAM_URL } from "../src/lib/content/about";
import { serviceSummary, servicesCatalog } from "../src/lib/content/services";

const prisma = new PrismaClient();

const weekdayHours = [
  { weekday: 0, startTime: "09:30", endTime: "18:30", closed: true, breakStart: null, breakEnd: null },
  { weekday: 1, startTime: "09:30", endTime: "18:30", closed: false, breakStart: "13:00", breakEnd: "14:00" },
  { weekday: 2, startTime: "09:30", endTime: "18:30", closed: false, breakStart: "13:00", breakEnd: "14:00" },
  { weekday: 3, startTime: "09:30", endTime: "18:30", closed: false, breakStart: "13:00", breakEnd: "14:00" },
  { weekday: 4, startTime: "09:30", endTime: "18:30", closed: false, breakStart: "13:00", breakEnd: "14:00" },
  { weekday: 5, startTime: "09:30", endTime: "18:30", closed: false, breakStart: "13:00", breakEnd: "14:00" },
  { weekday: 6, startTime: "09:30", endTime: "14:00", closed: false, breakStart: null, breakEnd: null },
];

const clinicData = {
  clinicName: "Diş Hekimi Merve Şen Aşkar",
  doctorName: "Dt. Merve Şen Aşkar",
  phone: DEFAULT_PHONE,
  whatsapp: DEFAULT_WHATSAPP,
  email: "",
  address: "Manavkuyu, 274/5. Sk. No:13/A, 35035 Bayraklı/İzmir",
  mapsUrl: "https://maps.app.goo.gl/5MFDPK3jqM1L9UL89?g_st=ic",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=Manavkuyu%2C%20274%2F5.%20Sk.%20No%3A13%2FA%2C%2035035%20Bayrakl%C4%B1%2F%C4%B0zmir&output=embed",
  tagline: "Bayraklı’da kişiye özel, anlaşılır ve özenli diş hekimliği.",
  aboutShort,
  aboutLong,
  doctorBio,
  instagramUrl: INSTAGRAM_URL,
  minNoticeHours: 2,
  maxAdvanceDays: 60,
  slotIntervalMin: 30,
};

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@mervesenaskar.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "MerveAdmin2026";
  const passwordHash = await hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash },
    update: { passwordHash },
  });

  const clinic = await prisma.clinicSettings.findUnique({ where: { id: "default" } });
  if (!clinic) {
    await prisma.clinicSettings.create({ data: { id: "default", ...clinicData } });
  }

  const keepSlugs = servicesCatalog.map((item) => item.slug);
  for (const service of servicesCatalog) {
    const data = {
      name: service.name,
      summary: serviceSummary(service.content),
      content: service.content,
      durationMin: service.durationMin,
      imagePath: service.imagePath,
      sortOrder: service.sortOrder,
      featured: service.featured,
      published: true,
    };
    await prisma.service.upsert({
      where: { slug: service.slug },
      create: { slug: service.slug, ...data },
      update: data,
    });
  }

  await prisma.service.updateMany({
    where: { slug: { notIn: keepSlugs } },
    data: { published: false },
  });

  const hoursCount = await prisma.workingHours.count();
  if (hoursCount === 0) {
    await prisma.workingHours.createMany({ data: weekdayHours });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
