import { Shield } from "lucide-react"
import { DemoConfig } from "@/lib/types"

export function TrustBar({ config }: { config: DemoConfig }) {
  return (
    <div className="bg-slate-50 border-y border-slate-100 py-6">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {config.credentials.map((cred) => (
            <div key={cred} className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Shield size={18} className="text-navy-700" />
              {cred}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
