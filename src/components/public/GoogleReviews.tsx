import { googleReviews, googleReviewsMeta } from "@/lib/content/reviews";

export function GoogleReviews({ mapsUrl }: { mapsUrl: string }) {
  const href = mapsUrl || googleReviewsMeta.mapsUrl;
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-taupe">Google yorumları</p>
            <h2 className="mt-2 font-serif text-3xl text-espresso sm:text-4xl">Hastalarımız ne diyor?</h2>
            <p className="mt-3 text-muted">
              Google’da {googleReviewsMeta.rating.toFixed(1)} / 5 · {googleReviewsMeta.count} değerlendirme
            </p>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-burgundy px-5 py-2.5 text-sm text-ivory transition-colors hover:bg-champagne hover:text-espresso"
          >
            Yorumları Google’da gör
          </a>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {googleReviews.map((review) => (
            <blockquote key={review.author} className="rounded-lg border border-champagne bg-ivory p-6">
              <p className="text-sm leading-relaxed text-muted">“{review.text}”</p>
              <footer className="mt-4 text-sm font-medium text-espresso">{review.author}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
