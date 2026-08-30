import { googleReviews, googleReviewsMeta } from "@/lib/content/reviews";

export function GoogleReviews({ mapsUrl }: { mapsUrl: string }) {
  const href = mapsUrl || googleReviewsMeta.mapsUrl;
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-gold">Google yorumları</p>
            <h2 className="mt-1 font-serif text-3xl text-sage-dark sm:text-4xl">Hastalarımız ne diyor?</h2>
            <p className="mt-2 text-ink-soft">
              Google’da {googleReviewsMeta.rating.toFixed(1)} / 5 · {googleReviewsMeta.count} değerlendirme
            </p>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-sage px-5 py-2 text-sm text-white hover:bg-sage-dark"
          >
            Yorumları Google’da gör
          </a>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {googleReviews.map((review) => (
            <blockquote key={review.author} className="rounded-3xl bg-cream p-6 ring-1 ring-cream-dark">
              <p className="text-sm leading-relaxed text-ink-soft">“{review.text}”</p>
              <footer className="mt-4 text-sm font-medium text-sage-dark">{review.author}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
