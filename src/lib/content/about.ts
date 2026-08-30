export const aboutPage = {
  pageTitle: "Diş Hekimi Merve Şen Aşkar",
  sections: [
    {
      heading: "Hakkımızda",
      paragraphs: [
        "Diş Hekimi Merve Şen Aşkar Muayenehanesi, İzmir Bayraklı Manavkuyu’da modern diş hekimliği uygulamalarını, kişiye özel tedavi planlamasını ve hasta konforunu bir arada sunmayı amaçlayan bir muayenehanedir.",
        "Tedavi yaklaşımımızın temelinde, her hastanın ağız ve diş yapısının kendine özgü olduğunun kabulü yer alır. Muayene ve gerekli teşhis yöntemleri doğrultusunda mevcut durum, tedavi gereksinimleri ve uygulanabilecek yöntemler bilimsel ve anlaşılır bir çerçevede ele alınır. Tedavinin her aşamasında hastanın sürece hakim olması, kendini güvende hissetmesi ve bilinçli karar verebilmesi önemsenir.",
        "Kliniğimizde güncel diş hekimliği uygulamalarının yanı sıra, tedavi hassasiyetini ve teşhis doğruluğunu artırmaya yardımcı olan teknolojilerden de yararlanılmaktadır. Dental operasyon mikroskobu ve büyütme sağlayan dental lup (loupe) sistemleri, özellikle detaylı görüş ve hassasiyet gerektiren tedavilerde diş ve çevre dokularının daha yakından değerlendirilmesine ve işlemlerin daha kontrollü şekilde gerçekleştirilmesine yardımcı olur.",
        "Amacımız yalnızca mevcut şikâyeti gidermek değil; mümkün olduğunca doğal diş dokusunu koruyan, ağız sağlığını ve fonksiyonunu gözeten, estetik beklentilerle uyumlu ve uzun vadeli ağız sağlığını destekleyen tedavi planları oluşturmaktır.",
      ],
    },
    {
      heading: "Merve Şen Aşkar Kimdir?",
      paragraphs: [
        "Dt. Merve Şen Aşkar, 1995 yılında İzmir’de doğmuştur. İzmir’de doğup büyüyen Merve Şen Aşkar, diş hekimliği eğitimi ve mesleki gelişim sürecini İstanbul’da sürdürmüştür.",
        "Diş hekimliği fakültesinden onur derecesiyle mezun olan Dt. Merve Şen Aşkar, mezuniyetinin ardından mesleki gelişimini her zaman ön planda tutarak kendisini farklı diş hekimliği alanlarında geliştirmeye devam etmiştir. Estetik diş hekimliği, implantoloji ve protetik tedaviler başta olmak üzere 20’den fazla kurs ve ileri eğitim programına katılmıştır.",
        "İstanbul’daki eğitim ve çalışma deneyiminin ardından İzmir’e dönen Dt. Merve Şen Aşkar, 2020 yılından itibaren İzmir’de çeşitli kliniklerde görev alarak farklı hasta grupları ve tedavi alanlarında mesleki deneyimini geliştirmiştir. Bu deneyimin ardından 2026 yılında kendi muayenehanesini açarak hastalarına kendi kliniğinde hizmet vermeye başlamıştır.",
      ],
    },
    {
      heading: "Tedavi Yaklaşımı",
      paragraphs: [
        "Dt. Merve Şen Aşkar; gülüş tasarımı, zirkonyum kaplama, implant tedavileri, lamina veneer ve kompozit laminate gibi estetik ve protetik uygulamaların yanı sıra; kanal tedavisi, çocuk diş hekimliği, diş çekimleri, komplike gömülü yirmi yaş dişi cerrahileri, ortodontik tedaviler, botoks uygulamaları ve genel diş hekimliği uygulamalarında da kapsamlı deneyim ve titiz bir yaklaşımla hizmet vermektedir.",
        "Tedavi planlamasında yalnızca estetik görünüm değil; dişlerin ve diş etlerinin sağlığı, çiğneme fonksiyonu, kapanış ilişkisi, ağız hijyeni ve uzun vadeli ağız sağlığı birlikte değerlendirilir. Her hastaya aynı tedaviyi uygulamak yerine, mevcut ağız ve diş yapısına ve ihtiyaçlarına uygun tedavi seçenekleri belirlenerek kişiye özel bir tedavi planı oluşturulur.",
      ],
    },
    {
      heading: "Hasta Konforu ve Güven",
      paragraphs: [
        "Muayenehanemizin temel hedeflerinden biri, her hastanın kendini rahat, güvende ve konforlu hissedebileceği modern bir ortam sunmaktır.",
        "Özellikle diş hekimi korkusu ve tedavi kaygısı yaşayan hastalarda, tedavi sürecinin anlaşılır olması ve hastanın kendini güvende hissetmesi önemsenir. İşlemlerin aşamaları hakkında gerekli bilgilendirmeler yapılarak hastanın tedavi sürecine bilinçli şekilde eşlik etmesi sağlanır.",
        "Sağlıklı ve estetik gülüşlerin yalnızca başarılı bir tedaviyle değil; doğru iletişim, güven ve hastanın kendisini rahat hissettiği bir tedavi süreciyle başladığına inanıyoruz.",
      ],
    },
  ],
};

export const aboutShort =
  "Diş Hekimi Merve Şen Aşkar Muayenehanesi, İzmir Bayraklı Manavkuyu’da modern diş hekimliği uygulamalarını, kişiye özel tedavi planlamasını ve hasta konforunu bir arada sunmayı amaçlayan bir muayenehanedir.";

export const aboutLong = aboutPage.sections
  .map((section) => `${section.heading}\n\n${section.paragraphs.join("\n\n")}`)
  .join("\n\n");

export const doctorBio = aboutPage.sections
  .filter((section) => section.heading !== "Hakkımızda")
  .map((section) => `${section.heading}\n\n${section.paragraphs.join("\n\n")}`)
  .join("\n\n");

export const clinicGallery = [
  { src: "/images/clinic/reception.jpg", alt: "Klinik karşılama alanı, Merve Şen Aşkar tabelası" },
  { src: "/images/clinic/treatment-room.jpg", alt: "Tedavi odası, neon diş panosu ve ünit" },
  { src: "/images/clinic/xray-room.jpg", alt: "Tedavi odası ve panoramik röntgen ekranı" },
  { src: "/images/clinic/waiting.jpg", alt: "Bekleme alanı" },
  { src: "/images/clinic/exterior.jpg", alt: "Muayenehane dış görünümü, Bayraklı" },
];

export const doctorPortraits = [
  { src: "/images/doctor/portrait-2.jpg", alt: "Dt. Merve Şen Aşkar, beyaz önlükle klinikte" },
  { src: "/images/doctor/portrait-3.jpg", alt: "Dt. Merve Şen Aşkar" },
  { src: "/images/doctor/portrait-4.jpg", alt: "Dt. Merve Şen Aşkar klinik ortamında" },
];

export const INSTAGRAM_HANDLE = "dtmervesen";
export const INSTAGRAM_URL = "https://www.instagram.com/dtmervesen/";
export const DEFAULT_PHONE = "0554 993 01 23";
export const DEFAULT_WHATSAPP = "0554 993 01 23";
