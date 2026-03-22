import { Phone, MapPin, Facebook, Instagram } from "lucide-react"
import { DemoConfig } from "@/lib/types"

export function Footer({ config }: { config: DemoConfig }) {
  return (
    <footer className="bg-navy-900 text-navy-300 py-12 pb-20 md:pb-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Col 1: Business info */}
          <div>
            <h3 className="font-heading font-bold text-xl text-white mb-3">
              {config.businessName}
            </h3>
            <p className="text-navy-400 text-sm leading-relaxed">
              {config.tagline ||
                `Reliable handyman services across ${config.serviceArea}. Quality work, clear pricing, no surprises.`}
            </p>
          </div>

          {/* Col 2: Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Services", href: "#services" },
                { label: "Our Work", href: "#gallery" },
                { label: "Reviews", href: "#reviews" },
                { label: "Get a Quote", href: "#quote" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-navy-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <div className="space-y-2">
              <a
                href={`tel:${config.phone}`}
                className="flex items-center gap-2 text-navy-400 hover:text-white text-sm transition-colors"
              >
                <Phone size={14} />
                {config.phone}
              </a>
              <div className="flex items-center gap-2 text-navy-400 text-sm">
                <MapPin size={14} />
                {config.serviceArea}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-navy-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-navy-500 text-xs">
            &copy; {new Date().getFullYear()} {config.businessName}. All rights reserved.
          </p>
          {/* Social icons */}
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="bg-navy-800 hover:bg-navy-700 p-2 rounded-full transition-colors text-navy-300 hover:text-white"
            >
              <Facebook size={16} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="bg-navy-800 hover:bg-navy-700 p-2 rounded-full transition-colors text-navy-300 hover:text-white"
            >
              <Instagram size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
