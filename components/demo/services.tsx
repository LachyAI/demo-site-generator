"use client"

import { PRESET_SERVICES } from "@/lib/defaults"
import {
  Hammer,
  PaintBucket,
  Wrench,
  DoorOpen,
  Package,
  Droplets,
  SprayCan,
  ImageIcon,
  ChefHat,
  Brush,
  Grid3X3,
  TreePine,
  LucideIcon,
} from "lucide-react"
import { getServiceImage } from "@/lib/image-map"
import { DemoConfig } from "@/lib/types"

const SERVICE_ICONS: Record<string, LucideIcon> = {
  "fence-deck": Hammer,
  painting: PaintBucket,
  maintenance: Wrench,
  "door-lock": DoorOpen,
  flatpack: Package,
  silicone: Droplets,
  "pressure-clean": SprayCan,
  hanging: ImageIcon,
  cabinet: ChefHat,
  gyprock: Brush,
  tiling: Grid3X3,
  outdoor: TreePine,
}

function ServiceCard({ service }: { service: DemoConfig["services"][number] }) {
  const Icon = SERVICE_ICONS[service.id] ?? Wrench
  const imgSrc = getServiceImage(service.id)

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img
          src={imgSrc}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.currentTarget
            target.style.display = "none"
            if (target.parentElement) {
              target.parentElement.style.backgroundColor = "#e2e8f0"
            }
          }}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <Icon size={24} className="text-accent-amber mb-3" />
        <h3 className="font-heading font-bold text-lg text-navy-900 mb-2">
          {service.name}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {service.description}
        </p>
      </div>
    </div>
  )
}

function padToSix(services: DemoConfig["services"]): DemoConfig["services"] {
  if (services.length >= 6) return services.slice(0, 6)
  const usedIds = new Set(services.map((s) => s.id))
  const fillers = PRESET_SERVICES.filter((s) => !usedIds.has(s.id))
  return [...services, ...fillers].slice(0, 6)
}

export function Services({ config }: { config: DemoConfig }) {
  const highlight = config.colors?.highlight || "#f59e0b"

  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-accent-amber font-semibold text-sm uppercase tracking-wider mb-2">
            What We Do
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900">
            Professional{" "}
            <span style={{ color: highlight }}>Services</span>
          </h2>
        </div>

        {/* Grid — always 6 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {padToSix(config.services).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
