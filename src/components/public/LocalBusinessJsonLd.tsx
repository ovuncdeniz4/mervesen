import type { ClinicSettings } from "@prisma/client";
import { googleReviewsMeta } from "@/lib/content/reviews";

export function LocalBusinessJsonLd({ clinic }: { clinic: ClinicSettings }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: clinic.clinicName,
    description: clinic.tagline,
    telephone: clinic.phone || undefined,
    email: clinic.email || undefined,
    url: clinic.mapsUrl,
    sameAs: [clinic.instagramUrl, clinic.mapsUrl].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Manavkuyu, 274/5. Sk. No:13/A",
      addressLocality: "Bayraklı",
      addressRegion: "İzmir",
      postalCode: "35035",
      addressCountry: "TR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: googleReviewsMeta.rating,
      reviewCount: googleReviewsMeta.count,
      bestRating: 5,
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
