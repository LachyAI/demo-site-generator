"use client"

import { useState } from "react"
import { Phone, CheckCircle, Wrench } from "lucide-react"
import { DemoConfig } from "@/lib/types"

export function Hero({ config }: { config: DemoConfig }) {
  const [imgError, setImgError] = useState(false)

  const primary = config.colors?.primary || "#102a43"
  const accent = config.colors?.accent || "#f59e0b"
  const highlight = config.colors?.highlight || "#f59e0b"

  return (
    <section
      className="relative text-white py-16 md:py-24 overflow-hidden"
      style={{ backgroundColor: primary }}
    >
      {/* Decorative bg */}
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-navy-800/50 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left column — text content */}
          <div className="text-left">
            {/* Trust pill */}
            <span
              className="inline-block px-4 py-1.5 text-xs font-bold rounded-full mb-6 uppercase tracking-wider"
              style={{ backgroundColor: "rgba(255,255,255,0.1)", color: accent }}
            >
              Trusted Local Handyman
            </span>

            {/* H1 */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              Reliable Handyman in{" "}
              <span style={{ color: highlight }}>{config.suburb}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-navy-200 mb-8 max-w-xl">
              Fast, clean, and done right. Repairs, installs &amp; maintenance with clear pricing. Book this week.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href="#quote"
                style={{ backgroundColor: accent }}
                className="text-white font-bold py-3 px-8 rounded-full text-lg transition-opacity hover:opacity-90 text-center"
              >
                Get a Free Quote
              </a>
              <a
                href={`tel:${config.phone}`}
                className="flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors"
              >
                <Phone size={20} />
                Call {config.phone}
              </a>
            </div>

            {/* Credential pills */}
            {config.credentials.length > 0 && (
              <div className="flex flex-wrap gap-3">
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

          {/* Right column — hero image (mobile: above text) */}
          <div className="order-first lg:order-last">
            <div className="relative rounded-2xl overflow-hidden aspect-video lg:aspect-square">
              {!imgError ? (
                <img
                  src="https://cdn.opscorescale.com/demo-images/hero-1.jpg"
                  alt="Professional handyman at work"
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center">
                  <Wrench size={64} className="text-navy-600" />
                </div>
              )}

              {/* Owner label overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="font-heading font-bold text-white text-lg leading-tight">
                  {config.ownerName || "Your Handyman"} — Lead Handyman
                </p>
                <p className="text-green-400 text-sm mt-1 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                  Available this week
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
