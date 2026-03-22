"use client"

import { useState } from "react"
import { User, Phone, FileText, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DemoConfig } from "@/lib/types"

export function QuoteForm({ config }: { config: DemoConfig }) {
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [suburb, setSuburb] = useState(config.suburb)
  const [jobType, setJobType] = useState("")
  const [description, setDescription] = useState("")
  const [urgency, setUrgency] = useState<"standard" | "emergency">("standard")
  const [agreed, setAgreed] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    toast.success("Thanks! We'll be in touch shortly.")
    setName("")
    setMobile("")
    setSuburb(config.suburb)
    setJobType("")
    setDescription("")
    setUrgency("standard")
    setAgreed(false)
  }

  return (
    <section id="quote" className="py-16 md:py-24 bg-white pb-20 md:pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-accent-amber font-semibold text-sm uppercase tracking-wider mb-2">
            Get Started
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900">
            Request a Free Quote
          </h2>
        </div>

        {/* Form card */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Your Name
              </Label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 h-11 w-full"
                  required
                />
              </div>
            </div>

            {/* Mobile */}
            <div className="space-y-1.5">
              <Label htmlFor="mobile" className="text-sm font-medium text-slate-700">
                Mobile Number
              </Label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="04XX XXX XXX"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="pl-9 h-11 w-full"
                  required
                />
              </div>
            </div>

            {/* Suburb */}
            <div className="space-y-1.5">
              <Label htmlFor="suburb" className="text-sm font-medium text-slate-700">
                Your Suburb
              </Label>
              <Input
                id="suburb"
                type="text"
                placeholder="Suburb"
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                className="h-11 w-full"
              />
            </div>

            {/* Job Type */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">
                Job Type
              </Label>
              <Select value={jobType} onValueChange={(val) => setJobType(val ?? "")}>
                <SelectTrigger className="w-full h-11 data-[size=default]:h-11">
                  <SelectValue placeholder="Select a service..." />
                </SelectTrigger>
                <SelectContent>
                  {config.services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                Describe the Job
              </Label>
              <Textarea
                id="description"
                placeholder="Tell us what needs doing, include photos if possible..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full resize-none"
              />
            </div>

            {/* Urgency toggle */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Urgency</Label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUrgency("standard")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 transition-colors ${
                    urgency === "standard"
                      ? "border-navy-700 bg-navy-50 text-navy-900"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency("emergency")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 transition-colors ${
                    urgency === "emergency"
                      ? "border-accent-amber bg-amber-50 text-amber-900"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  Emergency
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="agree"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                className="mt-0.5"
              />
              <Label htmlFor="agree" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                I agree to be contacted about this quote request
              </Label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-accent-amber hover:bg-accent-amber-hover text-white font-bold py-3 rounded-full text-lg transition-colors"
            >
              Send Quote Request
            </button>
          </form>

          {/* Trust copy */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-center gap-4">
            {[
              "No hidden fees or surprises",
              "Clear pricing before we start",
              "Final price confirmed after inspection",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-xs text-slate-600">
                <CheckCircle size={14} className="text-green-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
