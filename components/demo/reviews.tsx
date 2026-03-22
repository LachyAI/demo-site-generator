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
        <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 font-bold text-sm shrink-0">
          {review.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-navy-900 text-sm">{review.name}</p>
          {review.category && (
            <p className="text-xs text-slate-500">{review.category}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function Reviews({ config }: { config: DemoConfig }) {
  return (
    <section id="reviews" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-accent-amber font-semibold text-sm uppercase tracking-wider mb-2">
            Reviews
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900">
            Trusted by Your Neighbours in {config.suburb}
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
