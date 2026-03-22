import { MapPin } from "lucide-react"
import { DemoConfig } from "@/lib/types"

export function ServiceAreas({ config }: { config: DemoConfig }) {
  return (
    <section id="areas" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-accent-amber font-semibold text-sm uppercase tracking-wider mb-2">
            Service Areas
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900">
            Areas We Serve
          </h2>
        </div>

        {/* Suburb tags */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {config.suburbs.map((suburb) => (
            <span
              key={suburb}
              className="inline-flex items-center bg-white border border-slate-200 rounded-full px-4 py-2 text-sm font-medium text-navy-800 shadow-sm"
            >
              <MapPin size={14} className="text-accent-amber mr-1.5" />
              {suburb}
            </span>
          ))}
        </div>

        {/* Footer text */}
        <p className="text-center mt-8 text-slate-600 text-sm">
          {config.businessName} proudly serves homeowners and businesses across{" "}
          {config.serviceArea} and surrounding suburbs.
        </p>
      </div>
    </section>
  )
}
