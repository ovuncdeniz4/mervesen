/** Hasta yüzündeki hizmet başlık ve metinleri. Süre sitede gösterilmez. */

export type ServiceCatalogItem = {
  slug: string;
  name: string;
  content: string;
  durationMin: number;
  sortOrder: number;
  featured: boolean;
  imagePath: string;
};

function firstParagraph(content: string): string {
  return content.trim().split(/\n\n+/)[0].replace(/\s+/g, " ").trim();
}

const catalog: Omit<ServiceCatalogItem, "imagePath">[] = [
  {
    slug: "genel-muayene",
    name: "Genel Diş Muayenesi",
    durationMin: 30,
    sortOrder: 1,
    featured: true,
    content: `Genel diş muayenesi, ağız ve diş sağlığının bütüncül olarak değerlendirilmesini, mevcut problemlerin erken dönemde tespit edilmesini ve kişiye özel bir tedavi planı oluşturulmasını amaçlar.

İlk muayenede öncelikle şikâyetleriniz ve beklentileriniz dinlenir. Ardından dişler, diş etleri, ağız içi dokular, çene eklemi ve kapanış ilişkisi birlikte değerlendirilir. Gerekli durumlarda teşhisi desteklemek amacıyla panoramik veya periapikal röntgen gibi radyografik görüntülemeler önerilebilir.

Muayene sonucunda mevcut diş ve diş eti problemleri, öncelikli tedavi ihtiyaçları ve uzun vadeli ağız sağlığı planı belirlenir. Önerilen tedavi seçenekleri ve süreç, hastanın anlayabileceği sade bir dille açıklanarak birlikte değerlendirilir.

Düzenli diş hekimi kontrolleri, çürük ve diş eti hastalıklarının erken fark edilmesine ve ilerleyen dönemde daha kapsamlı tedavilere duyulan ihtiyacın azaltılmasına yardımcı olabilir. Özellikle herhangi bir şikâyet olmasa bile düzenli kontroller, ağız ve diş sağlığının korunması açısından önemlidir.

İzmir genel diş muayenesi ve Bayraklı diş hekimi hizmetleri hakkında bilgi almak, ağız ve diş sağlığınızı kapsamlı şekilde değerlendirmek veya mevcut şikâyetleriniz için uygun tedavi seçeneklerini öğrenmek için kliniğimizle iletişime geçebilirsiniz.`,
  },
  {
    slug: "implant",
    name: "İmplant Tedavisi",
    durationMin: 45,
    sortOrder: 2,
    featured: true,
    content: `İmplant tedavisi, eksik dişlerin yerine çene kemiğine yerleştirilen titanyum implantlar ve üzerine hazırlanan protezlerle diş fonksiyonunun ve estetik görünümün yeniden kazandırılmasını amaçlayan bir tedavidir.

Dental implant, kaybedilen dişin kökünü taklit eden ve çene kemiğine yerleştirilen biyouyumlu bir yapıdır. İmplantın üzerine yerleştirilen kuron veya diğer protez seçenekleri sayesinde eksik dişin çiğneme ve konuşma fonksiyonlarının yeniden sağlanması hedeflenir. Tek diş eksikliğinde, komşu dişlerin kesilmesine gerek kalmadan implant destekli bir restorasyon planlanabilir.

İmplant tedavisine uygunluk; çene kemiğinin hacmi ve yapısı, diş etlerinin durumu, ağız hijyeni ve genel sağlık durumu birlikte değerlendirilerek belirlenir. Diyabet ve hipertansiyon gibi sistemik durumlar her zaman implant tedavisine engel değildir; tedavi planlaması kişinin mevcut sağlık durumu ve ihtiyaçlarına göre yapılır.

Tek diş eksikliği, birden fazla diş eksikliği veya tam dişsizlik durumlarında farklı implant ve protez seçenekleri değerlendirilebilir. İmplant tedavisi; muayene ve radyografik değerlendirme, cerrahi olarak implantın yerleştirilmesi, iyileşme süreci ve uygun zamanda implant üstü protezin hazırlanması gibi aşamalardan oluşur. Bazı vakalarda kemik yetersizliği nedeniyle kemik grefti veya sinüs lifting gibi ek cerrahi işlemler gerekebilir.

İmplant tedavisinin başarısında doğru planlama kadar ağız hijyeni ve düzenli kontroller de önemlidir. İmplantların da doğal dişler gibi düzenli olarak temizlenmesi ve kontrol edilmesi gerekir.

İzmir implant tedavisi ve Bayraklı implant uygulamaları hakkında bilgi almak, eksik dişiniz için implantın uygun olup olmadığını değerlendirmek veya size özel tedavi seçeneklerini öğrenmek için kliniğimizle iletişime geçebilirsiniz.`,
  },
  {
    slug: "ortodonti",
    name: "Ortodonti ve Şeffaf Plak Tedavisi",
    durationMin: 30,
    sortOrder: 3,
    featured: true,
    content: `Ortodonti, dişlerin dizilimini ve çenelerin birbiriyle olan ilişkisini düzenleyerek daha sağlıklı bir kapanış, dengeli bir çiğneme fonksiyonu ve estetik bir diş dizilimi elde etmeyi amaçlayan bir tedavi alanıdır.

Çapraşık dişler, dişler arasındaki boşluklar, kapanış bozuklukları ve dişlerin ideal konumunda olmaması gibi durumlarda ortodontik tedavi planlanabilir. Ortodonti tedavisi yalnızca çocuklar ve gençler için değildir; diş ve diş eti sağlığı uygun olan yetişkin hastalarda da ortodontik tedavi uygulanabilir. Tedavinin uygulanabilirliği yaşın yanı sıra dişlerin, diş etlerinin, çene yapısının ve genel ağız sağlığının değerlendirilmesiyle belirlenir.

Dişlerin doğru konumlandırılması yalnızca estetik açıdan değil, ağız hijyeninin kolaylaştırılması, çiğneme fonksiyonunun iyileştirilmesi ve diş eti sağlığının korunması açısından da önemlidir.

Ortodontik tedavide klasik metal veya estetik braketlerin yanı sıra, uygun vakalarda şeffaf plak (aligner) tedavisi de uygulanabilir. Şeffaf plaklar çıkarılabilir yapıda olduğu için yemek yeme ve ağız bakımını kolaylaştırabilir. Tedavinin başarılı şekilde ilerleyebilmesi için plakların hekimin önerdiği süre boyunca düzenli kullanılması gerekir.

Tedavi başlangıcında ve plak değişimleri sonrasında dişlerde hafif baskı, hassasiyet veya sıkışma hissi oluşabilir. Bu durum çoğunlukla geçicidir. Tedavi süresi; dişlerin mevcut konumu, kapanış ilişkisi ve vakanın kapsamına göre kişiden kişiye değişiklik gösterir.

Tedavi tamamlandıktan sonra elde edilen diş diziliminin korunması için pekiştirme apareyleri kullanılabilir. Düzenli kontroller, tedavinin planlanan şekilde ilerlemesi ve sonuçların korunması açısından önemlidir.

İzmir ortodonti ve Bayraklı şeffaf plak tedavisi hakkında bilgi almak, çocukluk veya yetişkinlik döneminde dişlerinizdeki çapraşıklık ya da kapanış problemlerini değerlendirmek ve size uygun ortodontik tedavi seçeneklerini öğrenmek için kliniğimizle iletişime geçebilirsiniz.`,
  },
  {
    slug: "zirkonyum",
    name: "Zirkonyum Kaplama",
    durationMin: 45,
    sortOrder: 4,
    featured: true,
    content: `Zirkonyum kaplama, dişlerin estetik görünümünü ve fonksiyonunu yeniden kazandırmak amacıyla kullanılan, metal altyapı içermeyen seramik esaslı bir restorasyondur. Doğal diş görünümüne yakın estetik özellikleri ve dayanıklılığı sayesinde hem ön hem de arka dişlerde tercih edilebilir.

Zirkonyum kaplamalar metal altyapı içermediği için ışık geçirgenliği açısından doğal diş yapısına daha yakın bir görünüm sunabilir. Doğru planlama ve diş eti sağlığı ile birlikte uygulandığında diş eti hattında metal kaynaklı koyu renk yansıması oluşma ihtimalini ortadan kaldırır.

Kaplamanın rengi, şekli ve boyutu; komşu dişlerin rengi, yüz ve dudak yapısı ile hastanın estetik beklentileri dikkate alınarak belirlenir. Dişin kaplama için hazırlanması genellikle lokal anestezi altında gerçekleştirilir ve tedavi sürecinde geçici restorasyon kullanılarak günlük yaşamın mümkün olduğunca konforlu şekilde devam etmesi sağlanır.

Zirkonyum kaplama; ileri madde kaybı, kırık, şekil veya renk bozuklukları gibi durumlarda, dişin mevcut yapısı ve fonksiyonu değerlendirilerek planlanabilir. Her diş için kaplama gerekmeyebilir; mümkün olan durumlarda daha koruyucu tedavi seçenekleri öncelikle değerlendirilir.

Zirkonyum kaplamaların uzun süre sağlıklı şekilde kullanılabilmesi için doğru kapanışın sağlanması, düzenli ağız bakımı ve kontroller önemlidir. Diş sıkma veya gıcırdatma alışkanlığı bulunan kişilerde gece plağı kullanımı önerilebilir. Sert cisimleri dişlerle kırmak veya açmak ise hem doğal dişlere hem de kaplamalara zarar verebileceğinden kaçınılmalıdır.

İzmir zirkonyum kaplama ve Bayraklı zirkonyum diş uygulamaları hakkında bilgi almak, dişleriniz için zirkonyum kaplamanın uygun olup olmadığını değerlendirmek veya alternatif restorasyon seçeneklerini öğrenmek için kliniğimizle iletişime geçebilirsiniz.`,
  },
  {
    slug: "kaplama-ve-hareketli-protez",
    name: "Kaplama ve Hareketli Protez Tedavileri",
    durationMin: 45,
    sortOrder: 5,
    featured: false,
    content: `Dişlerdeki ileri madde kayıplarının onarılması ve kısmi veya tam dişsizlik durumlarında çiğneme, konuşma ve ağız fonksiyonlarının yeniden kazandırılması için farklı sabit ve hareketli protez seçenekleri sunulabilir.

Dişte geniş madde kaybı, kırık veya çürük nedeniyle dolgunun yeterli olmadığı durumlarda kaplama (kuron) tedavisi değerlendirilebilir. Dişin mevcut yapısına ve ihtiyaçlarına göre zirkonyum gibi metal desteksiz seramikler veya metal destekli porselen kaplamalar tercih edilebilir. Özellikle arka bölgelerde dayanıklılık ve fonksiyon ön planda değerlendirilirken, ön bölgelerde estetik beklentiler de tedavi planına dahil edilir.

Bir veya birden fazla dişin eksik olduğu, implant tedavisinin uygun olmadığı veya farklı nedenlerle tercih edilmediği durumlarda hareketli protez tedavileri planlanabilir. Kısmi dişsizliklerde kullanılan hareketli bölümlü protezler; doğal dişlerden destek alarak eksik dişlerin tamamlanmasına yardımcı olur.

Klasik bölümlü protezlerde protezin ağızda tutuculuğunu sağlayan kroşe (kanca) sistemleri kullanılabilir. Daha estetik bir görünüm istenen ve uygun diş yapısına sahip hastalarda ise hassas bağlantılı (çıtçıtlı protezler) protezler değerlendirilebilir. Bu sistemlerde protezin tutuculuğunu sağlayan bağlantı elemanları dışarıdan daha az görünür ve ya hiç görünmez ve daha estetik bir sonuç elde edilmesine yardımcı olabilir.

Tüm dişlerin kaybedildiği tam dişsizlik durumlarında ise total protezler (damak protezi -vakumlu protezler) kullanılabilir. Özellikle alt çenede tutuculuk problemi yaşayan uygun hastalarda vakum etkisinden yararlanmayı amaçlayan protez tasarımları değerlendirilebilir. Protezin tutuculuğu; çene kemiğinin yapısı, ağız dokuları ve mevcut anatomik koşullara göre kişiden kişiye değişebilir.

Hangi protez seçeneğinin uygun olduğu; mevcut dişlerin durumu, diş eti ve kemik yapısı, çene ilişkileri, ağız içi koşullar ve hastanın beklentileri birlikte değerlendirilerek belirlenir. Amaç, mümkün olduğunca doğal diş dokusunu koruyarak hastanın çiğneme, konuşma ve estetik ihtiyaçlarına uygun bir tedavi planı oluşturmaktır.

İzmir kaplama ve protez tedavileri ile Bayraklı hareketli protez uygulamaları hakkında bilgi almak, eksik dişleriniz için uygun protez seçeneklerini değerlendirmek veya mevcut protezinizle ilgili sorunlarınızı görüşmek için kliniğimizle iletişime geçebilirsiniz.`,
  },
  {
    slug: "lamine",
    name: "Lamine Kaplama (Yaprak Porselen)",
    durationMin: 45,
    sortOrder: 6,
    featured: true,
    content: `Lamine kaplama (yaprak porselen), dişlerin ön yüzeyine uygulanan ince porselen restorasyonlarla estetik görünümü iyileştirmeyi amaçlayan bir tedavidir. Özellikle diş rengi değişiklikleri, küçük kırıklar, aralıklı dişler, hafif çapraşıklıklar ve şekil bozukluklarının düzeltilmesinde tercih edilir.

Klasik kaplamalara göre diş dokusundan çok daha az aşındırma gerektirdiği için koruyucu bir yaklaşım sunar. Kişinin yüz yapısı, dudak formu ve mevcut diş yapısı değerlendirilerek doğal, yüzle uyumlu ve estetik bir gülüş planlanır.

Her hasta lamine kaplama için uygun olmayabilir. Diş sıkma (bruksizm), ileri derecede kapanış bozuklukları veya yetersiz mine dokusu bulunan hastalarda farklı tedavi seçenekleri değerlendirilebilir. Muayene sonrasında kişinin ağız ve diş yapısına uygun tedavi planı oluşturulur.

Lamine kaplamaların uzun ömürlü olabilmesi için düzenli ağız bakımı, rutin diş hekimi kontrolleri ve gerekli durumlarda gece plağı kullanımı önemlidir. Doğru planlama ve bakım ile yaprak porselen uygulamaları doğal diş görünümüne yakın, estetik ve uzun süreli sonuçlar sağlayabilir.

İzmir lamine kaplama ve yaprak porselen tedavileri hakkında detaylı bilgi almak için kliniğimizle iletişime geçebilir, size uygun tedavi seçenekleri hakkında değerlendirme randevusu oluşturabilirsiniz.`,
  },
  {
    slug: "dis-beyazlatma",
    name: "Diş Beyazlatma",
    durationMin: 45,
    sortOrder: 7,
    featured: false,
    content: `Diş beyazlatma, diş minesinde ve dentin tabakasında zamanla oluşan renklenmelerin açılmasını amaçlayan estetik bir diş hekimliği uygulamasıdır. Çay, kahve, sigara kullanımı, bazı ilaçlar ve yaşa bağlı renk değişiklikleri nedeniyle oluşan koyulaşmaların giderilmesinde tercih edilir.

Tedavi öncesinde dişler ve diş etleri detaylı olarak değerlendirilir; çürük, diş taşı, çatlak veya mevcut restorasyonlar kontrol edilir. Uygun hastalarda ofis tipi beyazlatma uygulamaları veya kişiye özel plaklarla ev tipi beyazlatma yöntemleri kullanılabilir.

Diş beyazlatma işlemi kişiye özel planlanır ve elde edilen sonuçlar dişlerin başlangıç rengine, mine yapısına ve renklenmenin nedenine göre değişiklik gösterebilir. Mevcut dolgu, kaplama ve porselen restorasyonlar beyazlamadığından, gerekli durumlarda işlem sonrasında renk uyumu ayrıca değerlendirilir.

İşlem sonrasında kısa süreli sıcak-soğuk hassasiyeti görülebilir ve genellikle geçicidir. Hekim önerilerine uyulması, düzenli ağız bakımı ve renklenmeye neden olan alışkanlıkların azaltılması beyazlatma sonuçlarının korunmasına yardımcı olur.

İzmir diş beyazlatma tedavileri hakkında detaylı bilgi almak ve sizin için uygun yöntemi belirlemek için kliniğimizle iletişime geçebilir, muayene randevusu oluşturabilirsiniz.`,
  },
  {
    slug: "kanal-tedavisi",
    name: "Kanal Tedavisi",
    durationMin: 45,
    sortOrder: 8,
    featured: false,
    content: `Kanal tedavisi, dişin iç kısmında bulunan pulpa dokusunun iltihaplanması, enfekte olması veya canlılığını kaybetmesi durumunda uygulanan bir tedavidir. Amaç, ağrıya neden olan enfeksiyonu ortadan kaldırmak ve dişi çekime gerek kalmadan ağızda korumaktır.

Tedavi sırasında kök kanalları özel ekipmanlarla temizlenir, şekillendirilir ve biyouyumlu materyallerle doldurulur. Güncel yöntemler ve lokal anestezi sayesinde kanal tedavisi çoğu hasta için konforlu bir şekilde gerçekleştirilebilir. Enfeksiyonun durumuna göre tedavi tek seansta veya birkaç seansta tamamlanabilir.

Kanal tedavisi gerektiren durumlar arasında derin çürükler, diş travmaları, ilerlemiş çatlaklar ve diş kökü enfeksiyonları yer alır. Erken teşhis ve tedavi, apse oluşumu, kemik kaybı ve diş kaybı riskinin azaltılmasına yardımcı olur.

Tedavi sonrasında diş, canlılığını kaybettiği için zamanla daha kırılgan hale gelebilir. Bu nedenle gerekli görülen vakalarda dolgu, onlay veya kuron (kaplama) ile dişin dayanıklılığı artırılabilir. Düzenli kontroller ve iyi ağız bakımı, kanal tedavisi yapılan dişlerin uzun yıllar sağlıklı şekilde kullanılmasına katkı sağlar.

İzmir kanal tedavisi uygulamaları hakkında detaylı bilgi almak ve dişinizi çekmeden koruma seçeneklerini değerlendirmek için kliniğimizle iletişime geçebilir, muayene randevusu oluşturabilirsiniz.`,
  },
  {
    slug: "dis-eti-tedavisi",
    name: "Diş Eti Tedavisi",
    durationMin: 45,
    sortOrder: 9,
    featured: false,
    content: `Diş eti tedavisi, diş eti iltihabı (gingivitis) ve ileri seviye diş eti hastalıklarının (periodontitis) kontrol altına alınmasını amaçlayan uygulamaları kapsar. Sağlıklı diş etleri yalnızca estetik bir gülüş için değil, dişlerin ve implantların uzun ömürlü olması için de büyük önem taşır.

Diş eti hastalıklarının en sık belirtileri arasında diş eti kanaması, şişlik, kızarıklık, ağız kokusu, diş eti çekilmesi ve dişlerde sallanma yer alır. Erken dönemde teşhis edilen gingivitis vakaları, profesyonel diş taşı temizliği ve doğru ağız bakım alışkanlıklarıyla çoğu zaman tamamen kontrol altına alınabilir.

Daha ileri vakalarda ise diş eti altında biriken bakteri ve diş taşı birikimlerinin uzaklaştırılması için kök yüzeyi düzleştirme gibi periodontal tedavilere ihtiyaç duyulabilir. Sigara kullanımı, diyabet ve yetersiz ağız hijyeni tedavi sürecini ve iyileşmeyi olumsuz etkileyebilir.

Tedavinin başarısı, klinikte yapılan işlemlerin yanı sıra hastanın günlük ağız bakımına da bağlıdır. Doğru diş fırçalama, diş ipi veya arayüz fırçası kullanımı ve düzenli diş hekimi kontrolleri, diş eti sağlığının korunmasında önemli rol oynar.

İzmir diş eti tedavisi uygulamalarında amacımız, diş eti hastalığını kontrol altına alırken doğal dişlerinizi mümkün olduğunca uzun süre sağlıklı şekilde korumaktır. Diş eti kanaması, çekilme veya ağız kokusu şikayetleriniz varsa değerlendirme için kliniğimizle iletişime geçebilirsiniz.`,
  },
  {
    slug: "dolgu",
    name: "Dolgu ve Konservatif Diş Tedavileri",
    durationMin: 30,
    sortOrder: 10,
    featured: false,
    content: `Dolgu tedavisi, çürük veya hasar görmüş diş dokusunun temizlenerek dişin mümkün olduğunca doğal yapısı korunacak şekilde onarılmasını amaçlayan konservatif bir diş tedavisidir. Diş rengindeki kompozit dolgular, hem ön hem de arka dişlerde estetik ve fonksiyonel onarım sağlamak amacıyla kullanılabilir.

Çürük ne kadar erken teşhis edilirse, tedavi sırasında kaybedilen sağlıklı diş dokusu da o kadar az olur. Dişte hassasiyet, yiyeceklerin arasına sıkışması, takılma hissi veya renk değişikliği gibi belirtiler çürük açısından değerlendirilmelidir. Ancak çürüklerin her zaman belirti vermeyebileceği unutulmamalıdır; düzenli diş hekimi kontrolleri erken teşhis açısından önemlidir.

Dolgu tedavisi sırasında çürük dokusu uzaklaştırılır ve dişin doğal formuna uygun şekilde restorasyon yapılır. Özellikle kompozit dolgular, dişin rengi ve anatomik yapısıyla uyumlu olacak şekilde şekillendirilerek doğal bir görünüm elde edilmesine yardımcı olur.

Dişteki madde kaybının fazla olduğu durumlarda ise yalnızca dolgu yeterli olmayabilir. Dişin durumuna göre inley, onley veya kuron (kaplama) gibi farklı restoratif tedavi seçenekleri değerlendirilebilir. Amaç, mümkün olduğunca sağlıklı diş dokusunu koruyarak dişin fonksiyonunu ve dayanıklılığını yeniden kazandırmaktır.

Yeni çürüklerin oluşmasını önlemek için düzenli diş fırçalama, diş aralarının temizlenmesi ve özellikle şekerli veya karbonhidrat içeren atıştırmalıkların tüketim sıklığının azaltılması önemlidir.

İzmir dolgu tedavisi ve Bayraklı konservatif diş tedavileri hakkında bilgi almak, mevcut dolgu ihtiyacınızı değerlendirmek veya dişiniz için en uygun restorasyon seçeneğini öğrenmek için kliniğimizle iletişime geçebilirsiniz.`,
  },
  {
    slug: "cocuk-dis",
    name: "Çocuk Diş Hekimliği",
    durationMin: 30,
    sortOrder: 11,
    featured: false,
    content: `Çocuk diş hekimliği, süt ve daimi dişlerin sağlığını korumaya, çürükleri erken dönemde tedavi etmeye ve çocukların diş hekimi deneyimini güvenli ve olumlu hale getirmeye yönelik uygulamaları kapsar.

İlk diş hekimi ziyareti, ilk süt dişlerinin sürmesinden itibaren veya en geç 1 yaş civarında planlanabilir. Erken kontrollerin amacı yalnızca mevcut bir problemi tedavi etmek değil; çocuğun ağız ve diş gelişimini takip etmek, çürük riskini değerlendirmek ve diş hekimiyle olumlu bir ilişki kurmasını sağlamaktır.

Süt dişleri, çocuğun beslenmesi ve konuşmasının yanı sıra daimi dişlerin doğru konumda sürmesine rehberlik eden önemli yapılardır. Bu nedenle süt dişlerindeki çürüklerin tedavi edilmesi ve erken diş kayıplarının mümkün olduğunca önlenmesi önemlidir. Gerekli durumlarda dolgu, pulpa tedavileri ve koruyucu uygulamalar planlanabilir.

Çürük oluşumunu önlemek amacıyla fissür örtücüler ve flor uygulamaları, çocuğun yaşına ve çürük riskine göre değerlendirilebilir. Düzenli diş hekimi kontrolleri ile çürükler erken dönemde fark edilerek daha basit tedavilerle müdahale edilebilir.

Çocuk diş hekimliği yaklaşımımızda kısa ve çocuğun yaşına uygun seanslar, sade bir iletişim ve ebeveyn iş birliği önemlidir. Gece biberonu, sık şekerli veya asitli içecek tüketimi ve ağız bakım alışkanlıkları da çocuğun çürük riski açısından değerlendirilir.

İzmir çocuk diş hekimi ve Bayraklı çocuk diş hekimliği hizmetleri hakkında bilgi almak, çocuğunuzun ağız ve diş sağlığını değerlendirmek veya koruyucu diş hekimliği uygulamaları hakkında bilgi edinmek için kliniğimizle iletişime geçebilirsiniz.`,
  },
  {
    slug: "yirmilik-dis",
    name: "Yirmi Yaş Dişi ve Genel Ağız, Diş ve Çene Cerrahileri",
    durationMin: 45,
    sortOrder: 12,
    featured: false,
    content: `Gömülü veya sorunlu yirmi yaş dişlerinin yanı sıra, ağız, diş ve çene bölgesindeki cerrahi gerektiren durumların değerlendirilmesi ve tedavisi.

Yirmi yaş dişleri; çenede yer darlığı, gömülü veya yarı gömülü kalma, komşu dişlere baskı ve tekrarlayan enfeksiyonlar nedeniyle çeşitli sorunlara yol açabilir. Ancak her yirmi yaş dişinin çekilmesi gerekmez. Çekim kararı, klinik muayene ve gerekli radyografik görüntülemeler değerlendirilerek verilir.

Gömülü yirmi yaş dişinin çevresinde tekrarlayan perikoronit (kapşon iltihabı), kist oluşumu, komşu dişte çürük veya periodontal sorun gibi durumlar mevcutsa cerrahi çekim gündeme gelebilir. İşlem, dişin konumuna ve cerrahi zorluk derecesine göre planlanır ve çoğunlukla lokal anestezi altında gerçekleştirilir.

Genel ağız, diş ve çene cerrahileri kapsamında gömülü diş çekimleri, komplike diş çekimleri, kök ucu ve çevresindeki enfeksiyonlara yönelik cerrahi işlemler ve cerrahi değerlendirme gerektiren diğer durumlar hastanın ihtiyaçlarına göre planlanabilir.

Cerrahi işlem sonrasında oluşabilecek hafif ağrı, şişlik ve hassasiyet iyileşme sürecinin doğal bir parçası olabilir. İlk gün tükürmekten, pipet kullanmaktan ve çok sıcak yiyecek ve içeceklerden kaçınmak; hekimin önerdiği ağız bakımına uymak iyileşme sürecine yardımcı olur.

İzmir yirmi yaş dişi çekimi ve Bayraklı ağız, diş ve çene cerrahisi hizmetleri hakkında bilgi almak, gömülü dişinizin değerlendirilmesini sağlamak veya cerrahi tedavi seçeneklerini öğrenmek için kliniğimizle iletişime geçebilirsiniz.`,
  },
  {
    slug: "gulus-tasarimi",
    name: "Gülüş Tasarımı",
    durationMin: 45,
    sortOrder: 13,
    featured: true,
    content: `Gülüş tasarımı; dişlerin rengi, şekli, boyutu, diş eti seviyesi ve kapanış ilişkisi gibi birçok faktörün birlikte değerlendirilerek kişiye özel bir estetik ve fonksiyonel tedavi planının oluşturulmasıdır.

Gülüş tasarımı tek başına uygulanan bir işlem değildir. Yüz hatları, dudakların gülüş sırasında konumu, dişlerin oranları, diş eti seviyesi ve kapanış birlikte değerlendirilir. Kişinin ihtiyaçlarına göre diş beyazlatma, kompozit lamine (kompozit bonding), lamine (yaprak porselen), zirkonyum kaplama, diş eti düzenlemeleri veya ortodontik tedaviler planın bir parçası olabilir.

Tedavi öncesinde hastanın beklentileri, günlük alışkanlıkları ve mevcut ağız-diş sağlığı değerlendirilir. Uygun vakalarda dijital gülüş tasarımı veya mock-up uygulamaları ile planlanan değişikliklerin tedavi öncesinde değerlendirilmesi mümkün olabilir.

Gülüş tasarımında amaç yalnızca daha beyaz veya düzgün dişler elde etmek değil; dişlerin yüz ve dudak yapısıyla, diş etleriyle ve kapanışla uyumlu bir görünüm oluştururken ağız sağlığını ve fonksiyonunu korumaktır. Bu nedenle estetik planlama, mevcut dişlerin ve diş etlerinin sağlık durumu göz önünde bulundurularak yapılır.

İzmir gülüş tasarımı ve Bayraklı estetik diş hekimliği uygulamaları hakkında bilgi almak, gülüşünüz için hangi tedavi seçeneklerinin uygun olduğunu öğrenmek ve kişiye özel tedavi planınızı değerlendirmek için kliniğimizle iletişime geçebilirsiniz.`,
  },
];

export const servicesCatalog: ServiceCatalogItem[] = catalog.map((item) => ({
  ...item,
  imagePath: `/images/services/${item.slug}.jpg`,
}));

export function serviceSummary(content: string): string {
  return firstParagraph(content);
}
