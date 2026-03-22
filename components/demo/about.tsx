import { CheckCircle, MapPin, GraduationCap, Briefcase, Heart } from "lucide-react"
import { DemoConfig } from "@/lib/types"

export function About({ config }: { config: DemoConfig }) {
  const ownerName = config.ownerName || "The Owner"
  const about = config.about
  const highlight = config.colors?.highlight || "#f59e0b"

  if (!about || (!about.bio && !about.hometown && !about.experience && !about.education && !about.passion)) {
    return null
  }

  const details = [
    { icon: MapPin, label: "From", value: about.hometown },
    { icon: Briefcase, label: "Experience", value: about.experience },
    { icon: GraduationCap, label: "Education", value: about.education },
    { icon: Heart, label: "Why I Do This", value: about.passion },
  ].filter(d => d.value)

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <p className="font-semibold text-sm uppercase tracking-wider mb-2" style={{ color: highlight }}>
            About
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900">
            Meet <span style={{ color: highlight }}>{ownerName}</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {about.bio && (
            <p className="text-lg text-slate-600 leading-relaxed text-center mb-12">
              {about.bio}
            </p>
          )}

          {details.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {details.map((detail) => {
                const Icon = detail.icon
                return (
                  <div
                    key={detail.label}
                    className="flex items-start gap-4 bg-slate-50 rounded-xl border border-slate-100 p-5"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${highlight}15` }}
                    >
                      <Icon size={20} style={{ color: highlight }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        {detail.label}
                      </p>
                      <p className="text-sm text-navy-900 font-medium leading-relaxed">
                        {detail.value}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {config.credentials.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-10">
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
