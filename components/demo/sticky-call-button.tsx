"use client"

import { useState, useEffect } from "react"
import { Phone } from "lucide-react"
import { DemoConfig } from "@/lib/types"

export function StickyCallButton({ config }: { config: DemoConfig }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <a
      href={`tel:${config.phone}`}
      className={`hidden md:flex fixed bottom-6 left-6 z-40 items-center gap-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-full shadow-lg shadow-green-600/25 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <Phone size={18} className="animate-pulse" />
      <span className="text-sm">{config.phone}</span>
    </a>
  )
}
