import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const services = [
  {
    slug: "genel-muayene",
    name: "Genel muayene",
    summary: "Ağız ve diş sağlığının bütüncül değerlendirilmesi, erken teşhis ve kişiye özel tedavi planı.",
    durationMin: 30,
    sortOrder: 1,
    featured: true,
    content: `İlk muayene, doğru tedavinin temelidir. Kliniğimizde şikâyetinizi dinledikten sonra dişler, diş etleri, çene eklemi ve kapanış birlikte değerlendirilir.

Muayene sonunda acil ihtiyaçlar ile uzun vadeli plan netleştirilir. Gerektiğinde röntgen önerilir; her adım size sade bir dille anlatılır.

Düzenli kontrol, büyük müdahaleleri çoğu zaman önler. Altı aylık rutin muayene, hem sağlıklı dişler hem de daha konforlu bir süreç demektir.`,
  },
  {
    slug: "implant",
    name: "İmplant tedavisi",
    summary: "Eksik dişin yerine, kemiğe yerleştirilen titanyum kök ile sabit ve doğal görünümlü çözüm.",
    durationMin: 60,
    sortOrder: 2,
    featured: true,
    content: `İmplant, kaybedilen dişin kökünü taklit eden bir titanyum vidanın çene kemiğine yerleştirilmesidir. Üzerine yapılan kuron, komşu dişlere zarar vermeden çiğneme ve konuşmayı destekler.

Kimlere uygun olduğu, kemik hacmi, genel sağlık ve ağız hijyeni ile belirlenir. Diyabet veya tansiyon gibi durumlar her zaman engel değildir; planlama bireysel yapılır.

Tek diş, birden fazla diş veya tam dişsizlik için farklı protez seçenekleri vardır. Süreç, değerlendirme, yerleştirme ve iyileşme sonrası üst yapı olmak üzere aşamalara ayrılır.`,
  },
  {
    slug: "ortodonti",
    name: "Ortodonti ve şeffaf plak",
    summary: "Çapraşık dişler ve kapanış bozuklukları için tel veya şeffaf plak ile hizalama.",
    durationMin: 45,
    sortOrder: 3,
    featured: true,
    content: `Ortodonti, dişlerin dizilimi ve çenelerin birbiriyle uyumunu düzenler. Estetik bir gülüşün yanında çiğneme fonksiyonu ve diş eti sağlığı da hedeflenir.

Klasik braketlerin yanı sıra uygun vakalarda şeffaf plak tedavisi de planlanabilir. Plaklar çıkarılabilir olduğu için hijyen kolaylaşır; başarı, günde yeterli süre kullanımına bağlıdır.

İlk seanslarda hafif baskı normaldir ve birkaç gün içinde azalır. Tedavi süresi vakanın karmaşıklığına göre değişir; pekiştirme apareyi ile sonuç korunur.`,
  },
  {
    slug: "zirkonyum",
    name: "Zirkonyum kaplama",
    summary: "Metal desteksiz, ışık geçirgen ve dayanıklı kaplama ile doğal diş görünümü.",
    durationMin: 60,
    sortOrder: 4,
    featured: true,
    content: `Zirkonyum, hem ön hem arka dişlerde estetik ve dayanıklılığı bir arada sunan bir kaplama malzemesidir. Metal alt yapı olmadığı için diş eti kenarında koyu yansıma beklenmez.

Renk ve form, komşu dişlerinize göre seçilir. Hazırlık genellikle lokal anestezi altında yapılır; geçici kaplama ile günlük yaşam devam eder.

Uzun ömür, doğru kapanış, gece plağı ihtiyacı ve düzenli bakıma bağlıdır. Sert cisimleri dişle kırmak kaplamaya zarar verebilir.`,
  },
  {
    slug: "lamine",
    name: "Lamine kaplama",
    summary: "Dişin ön yüzüne uygulanan ince porselen yapraklarla form ve renk düzenlemesi.",
    durationMin: 60,
    sortOrder: 5,
    featured: false,
    content: `Lamine (yaprak porselen), dişin ön yüzeyine yapıştırılan ince bir restorasyondur. Renk değişimi, hafif çapraşıklık, kırık kenar veya form bozukluğunda gülüşü yumuşakça dönüştürebilir.

Dişten kaldırılan doku, klasik kaplamaya göre daha azdır. Yine de her vaka lamine için uygun değildir; diş sıkma, ileri kapanış sorunları veya yetersiz mine alternatif plan gerektirebilir.

Bakımda renkli içecekler sonrası su içmek, gece plağı ve düzenli kontrol önerilir. Lamine doğal diş gibi fırçalanır; abrazif macunlardan kaçınılır.`,
  },
  {
    slug: "dis-beyazlatma",
    name: "Diş beyazlatma",
    summary: "Ofis veya ev tipi uygulamalarla diş minesindeki renklenmeleri açma.",
    durationMin: 45,
    sortOrder: 6,
    featured: true,
    content: `Beyazlatma, mine ve dentindeki renklenmeleri açan bir estetik uygulamadır. Çay, kahve, sigara veya yaşlanmaya bağlı matlaşma sık başvuru nedenidir.

Önce çürük, taş ve çatlak kontrolü yapılır. Uygun olmayan ağızda beyazlatma hassasiyeti artırabilir. Ofis tipi tek seans veya ev tipi plak ile ilerlenir.

Sonuç kişiden kişiye değişir; dolgu ve kaplamalar beyazlamaz, gerekirse renk uyumu ayrıca planlanır. İşlem sonrası kısa süreli hassasiyet beklenen bir durumdur.`,
  },
  {
    slug: "kanal-tedavisi",
    name: "Kanal tedavisi",
    summary: "İltihaplı veya hasarlı dişin iç dokusunun temizlenerek dişi ağızda tutma tedavisi.",
    durationMin: 60,
    sortOrder: 7,
    featured: false,
    content: `Kanal tedavisi, dişin içindeki canlı doku (pulpa) iltihaplandığında veya öldüğünde uygulanır. Amaç, dişi çekmeden ağızda tutmak ve ağrıyı gidermektir.

Kök kanalları temizlenir, şekillendirilir ve doldurulur. Çoğu vaka lokal anestezi ile konforlu geçer. Gerekirse birden fazla seans planlanır.

Tedavi sonrası diş kırılganlaşabileceği için genellikle kuron ile güçlendirilir. Erken müdahale, apse ve kemik kaybı riskini azaltır.`,
  },
  {
    slug: "dis-eti-tedavisi",
    name: "Diş eti tedavisi",
    summary: "Diş eti iltihabı ve periodontitis için temizlik, kök yüzeyi düzenleme ve bakım planı.",
    durationMin: 45,
    sortOrder: 8,
    featured: false,
    content: `Diş eti hastalıkları kanama, şişlik, kötü koku ve ilerleyen dönemde diş kaybına yol açabilir. Erken evre (gingivit) çoğu zaman profesyonel temizlik ve ev bakımı ile geri döner.

İlerlemiş vakalarda kök yüzeyi düzleştirme ve daha sıkı takip gerekir. Sigara, şeker hastalığı ve ağız solunumu iyileşmeyi zorlaştırabilir.

Tedavinin kalıcı olması, doğru fırçalama, diş ipi veya arayüz fırçası ve düzenli kontrollere bağlıdır. Diş eti sağlığı, implant ve kaplama başarısını da etkiler.`,
  },
  {
    slug: "dolgu",
    name: "Dolgu ve konservatif tedavi",
    summary: "Çürüğün temizlenerek dişin doğal formunun estetik dolgu ile onarılması.",
    durationMin: 45,
    sortOrder: 9,
    featured: false,
    content: `Küçük ve orta çürükler, dişin kaybedilmeden onarılması için dolgu ile tedavi edilir. Günümüzde diş rengine uyumlu kompozit dolgular hem ön hem arka dişlerde tercih edilir.

Çürük ne kadar erken yakalanırsa o kadar az doku kalkar. Hassasiyet, takılma veya yiyeceklerin araya kaçması çürüğün habercisi olabilir.

Büyük madde kaybında inley, onley veya kaplama daha doğru olabilir. Şekerli atıştırmalık sıklığını azaltmak ve florürlü macun kullanmak yeni çürükleri yavaşlatır.`,
  },
  {
    slug: "cocuk-dis",
    name: "Çocuk diş hekimliği",
    summary: "Süt dişi çürükleri, koruyucu uygulamalar ve çocuğa nazik bir klinik deneyimi.",
    durationMin: 30,
    sortOrder: 10,
    featured: false,
    content: `Çocuklarda ilk diş hekimi ziyareti, süt dişleri çıkar çıkmaz veya ilk yaş civarında planlanabilir. Amaç yalnızca tedavi değil, kliniği güvenli bir yer olarak tanıtmaktır.

Süt dişleri yer tutucu görevi görür; erken kayıp çapraşıklığa zemin hazırlayabilir. Fissür örtücü ve flor uygulamaları çürüğü önlemede etkilidir.

Randevuda kısa seanslar, sade anlatım ve ebeveyn iş birliği önemlidir. Evde gece biberonu ve şekerli içecek alışkanlığı varsa bunlar birlikte gözden geçirilir.`,
  },
  {
    slug: "yirmilik-dis",
    name: "Yirmi yaş dişi ve cerrahi",
    summary: "Gömülü veya sorunlu yirmi yaş dişlerinin değerlendirilmesi ve çekimi.",
    durationMin: 60,
    sortOrder: 11,
    featured: false,
    content: `Yirmi yaş dişleri çene sonunda yer darlığı, gömülü kalma veya tekrarlayan iltihap nedeniyle sorun çıkarabilir. Her yirmi yaş dişinin çekilmesi şart değildir; karar muayene ve görüntüleme ile verilir.

Gömülü diş çevresinde kist, komşu dişte çürük veya sık sık perikoronit (kapşon iltihabı) varsa çekim önerilir. İşlem lokal anestezi ile yapılır; iyileşme ağız bakımı ve verilen önerilere bağlıdır.

Çekim sonrası tükürmemek, pipet kullanmamak ve ilk gün sıcak yiyecekten kaçınmak yuvanın sağlıklı kapanmasına yardım eder. Şişlik ve hafif ağrı beklenen bir süreçtir.`,
  },
  {
    slug: "gulus-tasarimi",
    name: "Gülüş tasarımı",
    summary: "Diş eti, renk, form ve kapanışı birlikte ele alan kişiye özel estetik planlama.",
    durationMin: 45,
    sortOrder: 12,
    featured: true,
    content: `Gülüş tasarımı tek bir işlem değil, yüz hatlarınız, diş eti seviyesi, diş boyu ve rengi ile kapanışın birlikte planlanmasıdır. Beyazlatma, lamine, zirkonyum veya ortodonti bu planın parçası olabilir.

Önce beklentiniz ve günlük alışkanlıklarınız konuşulur. Dijital veya mock-up denemeler, sonucu önceden görmenize yardımcı olur.

Kalıcı estetik, sağlıklı diş eti ve doğru fonksiyon olmadan uzun ömürlü olmaz. Bu yüzden tasarım her zaman tedavi ihtiyacı ile birlikte kurgulanır.`,
  },
];

const weekdayHours = [
  { weekday: 0, startTime: "09:30", endTime: "18:30", closed: true, breakStart: null, breakEnd: null },
  { weekday: 1, startTime: "09:30", endTime: "18:30", closed: false, breakStart: "13:00", breakEnd: "14:00" },
  { weekday: 2, startTime: "09:30", endTime: "18:30", closed: false, breakStart: "13:00", breakEnd: "14:00" },
  { weekday: 3, startTime: "09:30", endTime: "18:30", closed: false, breakStart: "13:00", breakEnd: "14:00" },
  { weekday: 4, startTime: "09:30", endTime: "18:30", closed: false, breakStart: "13:00", breakEnd: "14:00" },
  { weekday: 5, startTime: "09:30", endTime: "18:30", closed: false, breakStart: "13:00", breakEnd: "14:00" },
  { weekday: 6, startTime: "09:30", endTime: "14:00", closed: false, breakStart: null, breakEnd: null },
];

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@mervesenaskar.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "MerveAdmin2026";
  const passwordHash = await hash(password, 12);

  await prisma.appointment.deleteMany();
  await prisma.blockedSlot.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.service.deleteMany();
  await prisma.workingHours.deleteMany();
  await prisma.clinicSettings.deleteMany();
  await prisma.adminUser.deleteMany();

  await prisma.adminUser.create({ data: { email, passwordHash } });

  await prisma.clinicSettings.create({
    data: {
      clinicName: "Diş Hekimi Merve Şen Aşkar",
      doctorName: "Dt. Merve Şen Aşkar",
      phone: "",
      whatsapp: "",
      email: "",
      address: "Manavkuyu, 274/5. Sk. No:13/A, 35035 Bayraklı/İzmir",
      mapsUrl: "https://maps.app.goo.gl/5MFDPK3jqM1L9UL89?g_st=ic",
      mapsEmbedUrl:
        "https://maps.google.com/maps?q=Manavkuyu%2C%20274%2F5.%20Sk.%20No%3A13%2FA%2C%2035035%20Bayrakl%C4%B1%2F%C4%B0zmir&output=embed",
      tagline: "Bayraklı’da sakin, özenli ve anlaşılır diş hekimliği.",
      aboutShort:
        "Kliniğimiz Bayraklı Manavkuyu’da; muayeneden estetik ve cerrahi tedavilere kadar tek hekimle, acele etmeden hizmet verir.",
      aboutLong: `Diş Hekimi Merve Şen Aşkar kliniği, İzmir Bayraklı Manavkuyu’da komşu mahallelere yürüyerek veya kısa bir araç mesafesiyle ulaşılabilen, tek hekimli bir muayenehanedir.

Burada zincir poliklinik kalabalığı yerine, sizi tanıyan bir hekimle konuşmak esastır. Şikâyetiniz dinlenir, seçenekler abartısız anlatılır, tedavi temposu sizin konforunuza göre ayarlanır.

Modern teşhis ve güncel malzemeler kullanılır; her işlem öncesinde ne yapılacağı, ne kadar süreceği ve sonrasında nelere dikkat edileceği paylaşılır. Amacımız yalnızca bir işlemi bitirmek değil, uzun yıllar ağızda kalacak sağlıklı bir sonuç bırakmaktır.`,
      doctorBio: `Dt. Merve Şen Aşkar, genel diş hekimliği pratiğinde koruyucu tedaviden estetik restorasyonlara, kanal tedavisinden implant ve cerrahi değerlendirmeye kadar geniş bir yelpazede çalışır.

Hasta ile kurulan açık iletişim, onun için tedavinin bir parçasıdır. Çocuk, yetişkin ve yaşlı hastalarda aynı özenle; korku ve kaygı varsa seansı buna göre planlayarak ilerler.

Kliniğin adresi Manavkuyu, 274/5. Sokak No:13/A, Bayraklı / İzmir’dir. Randevu takviminden müsait saati seçebilir veya iletişim formundan yazabilirsiniz.`,
      minNoticeHours: 2,
      maxAdvanceDays: 60,
      slotIntervalMin: 30,
    },
  });

  for (const service of services) {
    await prisma.service.create({ data: service });
  }

  for (const row of weekdayHours) {
    await prisma.workingHours.create({ data: row });
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
