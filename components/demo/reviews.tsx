import { Star } from "lucide-react"
import { DemoConfig } from "@/lib/types"

function ReviewCard({ review }: { review: DemoConfig["reviews"][number] }) {
  const filledStars = Math.round(review.rating)
  const emptyStars = 5 - filledStars

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
      {/* Stars */}
      <div className="flex gap-1 mb-3">
        {Array.from({ length: filledStars }).map((_, i) => (
          <Star key={`f-${i}`} size={18} className="text-accent-amber fill-accent-amber" />
        ))}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`e-${i}`} size={18} className="text-slate-200" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-slate-700 leading-relaxed mb-4 text-sm">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Reviewer */}
      <div className="flex items-center gap-3">
        {/* Google G avatar */}
        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </div>
        <div>
          <p className="font-semibold text-navy-900 text-sm">{review.name}</p>
        </div>
      </div>
    </div>
  )
}

export function Reviews({ config }: { config: DemoConfig }) {
  const highlight = config.colors?.highlight || "#f59e0b"

  return (
    <section id="reviews" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-accent-amber font-semibold text-sm uppercase tracking-wider mb-2">
            Reviews
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900">
            Trusted by Your Neighbours in{" "}
            <span style={{ color: highlight }}>{config.suburb}</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.reviews.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      </div>
    </section>
  )
}
