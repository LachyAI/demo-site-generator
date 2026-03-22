"use client"

import { useState, useEffect } from "react"
import { Phone, Menu, X, FileText } from "lucide-react"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { DemoConfig } from "@/lib/types"

export function Navbar({ config }: { config: DemoConfig }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "Our Work", href: "#gallery" },
    { label: "Reviews", href: "#reviews" },
    { label: "Areas", href: "#areas" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-shadow ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        {config.logoUrl ? (
          <img
            src={config.logoUrl}
            alt={config.businessName}
            className="h-10 max-w-[200px] object-contain"
          />
        ) : (
          <span className="font-heading font-bold text-xl text-navy-900">
            {config.businessName}
          </span>
        )}

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-navy-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={`tel:${config.phone}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-navy-700 transition-colors"
          >
            <Phone size={16} />
            {config.phone}
          </a>
          <a
            href="#quote"
            className="bg-accent-amber hover:bg-accent-amber-hover text-white rounded-full px-4 py-2 text-sm font-semibold transition-colors"
          >
            Get a Quote
          </a>
        </div>

        {/* Mobile hamburger */}
        <Sheet>
          <SheetTrigger className="md:hidden p-2 text-slate-600 hover:text-navy-900 transition-colors">
            <Menu size={24} />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0">
            <SheetHeader className="p-6 border-b border-slate-100">
              <SheetTitle className="font-heading font-bold text-lg text-navy-900">
                {config.businessName}
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <SheetClose key={link.href} render={<a href={link.href} />}>
                  <span className="text-base font-medium text-slate-700 hover:text-navy-900 transition-colors py-1">
                    {link.label}
                  </span>
                </SheetClose>
              ))}
              <div className="border-t border-slate-100 pt-4 mt-2 flex flex-col gap-3">
                <SheetClose render={<a href={`tel:${config.phone}`} />}>
                  <span className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-sm transition-colors">
                    <Phone size={16} />
                    Call Now
                  </span>
                </SheetClose>
                <SheetClose render={<a href="#quote" />}>
                  <span className="flex items-center justify-center gap-2 bg-accent-amber hover:bg-accent-amber-hover text-white font-bold py-3 rounded-lg text-sm transition-colors">
                    <FileText size={16} />
                    Get a Quote
                  </span>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
