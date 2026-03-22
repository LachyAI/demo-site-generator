import { CheckCircle } from "lucide-react"
import { DemoConfig } from "@/lib/types"

export function About({ config }: { config: DemoConfig }) {
  const ownerName = config.ownerName || "The Owner"
  const initial = ownerName.charAt(0).toUpperCase()

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto bg-slate-50 rounded-2xl p-8 md:p-12 border border-slate-200">
          {/* Avatar + name */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 rounded-full bg-navy-100 border-4 border-white shadow-lg flex items-center justify-center mb-4">
              <span className="font-heading text-2xl font-bold text-navy-700">
                {initial}
              </span>
              {/* Online dot */}
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <h3 className="font-heading font-bold text-xl text-navy-900">
              {ownerName} — Lead Handyman
            </h3>
            <p className="text-xs text-green-600 font-medium mt-1">
              Available this week
            </p>
          </div>

          {/* Bio */}
          <p className="text-slate-600 leading-relaxed text-center mb-6">
            I started {config.businessName} to provide {config.suburb} homeowners
            with reliable, quality service they can trust. Every job is handled
            with care — from the first quote to the final cleanup.
          </p>

          {/* Credentials */}
          {config.credentials.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {config.credentials.map((cred) => (
                <span
                  key={cred}
                  className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700"
                >
                  <CheckCircle size={14} className="text-green-500" />
                  {cred}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
