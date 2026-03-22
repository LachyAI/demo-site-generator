"use client"

import { Phone, FileText } from "lucide-react"
import { DemoConfig } from "@/lib/types"

export function MobileStickyBar({ config }: { config: DemoConfig }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-50 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <a
        href={`tel:${config.phone}`}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-full text-sm flex items-center justify-center gap-2 transition-colors"
      >
        <Phone size={16} />
        Call Now
      </a>
      <a
        href="#quote"
        className="flex-1 bg-accent-amber hover:bg-accent-amber-hover text-white font-bold py-3 rounded-full text-sm flex items-center justify-center gap-2 transition-colors"
      >
        <FileText size={16} />
        Get a Quote
      </a>
    </div>
  )
}
