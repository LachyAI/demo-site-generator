import { Phone, CheckCircle } from "lucide-react"
import { DemoConfig } from "@/lib/types"

export function Hero({ config }: { config: DemoConfig }) {
  return (
    <section className="relative bg-navy-900 text-white py-20 md:py-28 overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-navy-800/50 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        {/* Trust pill */}
        <span className="inline-block px-4 py-1.5 bg-navy-700 text-accent-amber text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
          Trusted Local Handyman
        </span>

        {/* H1 */}
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          Reliable Handyman in {config.suburb}
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-navy-200 mb-8 max-w-2xl mx-auto">
          Fast, clean, and done right. Repairs, installs &amp; maintenance with clear pricing. Book this week.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a
            href="#quote"
            className="bg-accent-amber hover:bg-accent-amber-hover text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Get a Free Quote
          </a>
          <a
            href={`tel:${config.phone}`}
            className="flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            <Phone size={20} />
            Call {config.phone}
          </a>
        </div>

        {/* Credential pills */}
        {config.credentials.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {config.credentials.map((cred) => (
              <span
                key={cred}
                className="inline-flex items-center gap-1.5 bg-navy-800 text-navy-200 px-3 py-1 rounded-full text-xs font-medium"
              >
                <CheckCircle size={14} className="text-green-400" />
                {cred}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
