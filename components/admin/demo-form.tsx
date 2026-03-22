"use client";

import { useState } from "react";
import { PRESET_SERVICES, PRESET_CREDENTIALS, BRISBANE_SUBURBS } from "@/lib/defaults";
import type { Review, Service } from "@/lib/types";
import { ReviewParser } from "./review-parser";

interface SuccessResult {
  slug: string;
  demoUrl: string;
}

const inputClass =
  "w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 placeholder-slate-500";

const labelClass = "block text-slate-300 text-sm font-medium mb-1.5";

const sectionHeadingClass = "text-white font-heading font-bold text-lg mb-4";

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="pt-6">
      <h2 className={sectionHeadingClass}>{title}</h2>
    </div>
  );
}

export function DemoForm() {
  // Business details
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [suburb, setSuburb] = useState("");
  const [serviceArea, setServiceArea] = useState("Brisbane");

  // Services
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [serviceDescriptions, setServiceDescriptions] = useState<Record<string, string>>({});

  // Credentials
  const [selectedCredentials, setSelectedCredentials] = useState<Set<string>>(new Set());

  // Suburbs
  const [suburbs, setSuburbs] = useState<string[]>([]);
  const [suburbInput, setSuburbInput] = useState("");

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);

  // Submit state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<SuccessResult | null>(null);

  function toggleService(id: string) {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleCredential(name: string) {
    setSelectedCredentials((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  function addSuburb(value: string) {
    const trimmed = value.trim().replace(/,$/, "").trim();
    if (trimmed && !suburbs.includes(trimmed)) {
      setSuburbs((prev) => [...prev, trimmed]);
    }
    setSuburbInput("");
  }

  function handleSuburbKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSuburb(suburbInput);
    }
  }

  function removeSuburb(s: string) {
    setSuburbs((prev) => prev.filter((x) => x !== s));
  }

  function addCommonSuburbs() {
    const first10 = BRISBANE_SUBURBS.slice(0, 10);
    setSuburbs((prev) => {
      const existing = new Set(prev);
      const toAdd = first10.filter((s) => !existing.has(s));
      return [...prev, ...toAdd];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validate
    if (!businessName.trim()) return setError("Business name is required.");
    if (!phone.trim()) return setError("Phone is required.");
    if (!suburb.trim()) return setError("Suburb is required.");
    if (selectedServices.size === 0) return setError("Select at least one service.");
    if (reviews.length === 0) return setError("Add at least one review.");

    const services: Service[] = PRESET_SERVICES.filter((s) => selectedServices.has(s.id)).map((s) => ({
      id: s.id,
      name: s.name,
      description: serviceDescriptions[s.id] || s.description,
    }));

    const config = {
      businessName: businessName.trim(),
      ownerName: ownerName.trim() || undefined,
      phone: phone.trim(),
      suburb: suburb.trim(),
      serviceArea: serviceArea.trim() || "Brisbane",
      services,
      reviews,
      credentials: Array.from(selectedCredentials),
      suburbs,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/demos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create demo.");
        return;
      }

      setSuccess({ slug: data.slug, demoUrl: data.demoUrl });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function copyUrl() {
    if (success) {
      const url = `${window.location.origin}${success.demoUrl}`;
      navigator.clipboard.writeText(url);
    }
  }

  if (success) {
    const fullUrl = typeof window !== "undefined"
      ? `${window.location.origin}${success.demoUrl}`
      : success.demoUrl;

    return (
      <div className="bg-green-900/20 border border-green-800 rounded-xl p-6 space-y-4">
        <h3 className="text-green-400 font-bold text-lg">Demo Created!</h3>
        <p className="text-slate-300 text-sm">Your demo site is live at:</p>
        <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 font-mono text-sm text-white break-all">
          {fullUrl}
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={copyUrl}
            className="bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Copy URL
          </button>
          <a
            href={success.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Open in New Tab
          </a>
          <button
            type="button"
            onClick={() => setSuccess(null)}
            className="border border-slate-600 text-slate-300 hover:text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Section 1: Business Details */}
      <SectionDivider title="Business Details" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Business Name *</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            className={inputClass}
            placeholder="e.g. Brett's Handyman Services"
          />
        </div>
        <div>
          <label className={labelClass}>Owner Name</label>
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className={inputClass}
            placeholder="e.g. Brett"
          />
        </div>
        <div>
          <label className={labelClass}>Phone *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className={inputClass}
            placeholder="e.g. 0412 345 678"
          />
        </div>
        <div>
          <label className={labelClass}>Suburb *</label>
          <input
            type="text"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
            required
            className={inputClass}
            placeholder="e.g. Paddington"
          />
        </div>
        <div>
          <label className={labelClass}>Service Area</label>
          <input
            type="text"
            value={serviceArea}
            onChange={(e) => setServiceArea(e.target.value)}
            className={inputClass}
            placeholder="e.g. Brisbane"
          />
        </div>
      </div>

      {/* Section 2: Services */}
      <SectionDivider title="Services" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRESET_SERVICES.map((service) => {
          const checked = selectedServices.has(service.id);
          return (
            <div
              key={service.id}
              className={`border rounded-xl p-3 transition-colors cursor-pointer ${
                checked
                  ? "border-amber-500/60 bg-amber-500/5"
                  : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
              }`}
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleService(service.id)}
                  className="accent-amber-500 w-4 h-4 flex-shrink-0"
                />
                <span className="text-white text-sm font-medium">{service.name}</span>
              </label>
              {checked && (
                <input
                  type="text"
                  value={serviceDescriptions[service.id] ?? service.description}
                  onChange={(e) =>
                    setServiceDescriptions((prev) => ({
                      ...prev,
                      [service.id]: e.target.value,
                    }))
                  }
                  className="mt-2 w-full bg-slate-800 border border-slate-600 text-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Section 3: Credentials */}
      <SectionDivider title="Credentials" />
      <div className="flex flex-wrap gap-3">
        {PRESET_CREDENTIALS.map((cred) => {
          const checked = selectedCredentials.has(cred);
          return (
            <label
              key={cred}
              className={`flex items-center gap-2 cursor-pointer border rounded-lg px-3 py-2 text-sm transition-colors ${
                checked
                  ? "border-amber-500/60 bg-amber-500/5 text-white"
                  : "border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleCredential(cred)}
                className="accent-amber-500 w-4 h-4"
              />
              {cred}
            </label>
          );
        })}
      </div>

      {/* Section 4: Service Suburbs */}
      <SectionDivider title="Service Suburbs" />
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={suburbInput}
            onChange={(e) => setSuburbInput(e.target.value)}
            onKeyDown={handleSuburbKeyDown}
            onBlur={() => suburbInput.trim() && addSuburb(suburbInput)}
            className={`flex-1 ${inputClass}`}
            placeholder="Type suburb and press Enter or comma..."
          />
          <button
            type="button"
            onClick={addCommonSuburbs}
            className="border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white text-sm px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Add Common Brisbane
          </button>
        </div>

        {suburbs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {suburbs.map((s) => (
              <span
                key={s}
                className="bg-slate-700 text-white rounded-full px-3 py-1 text-sm flex items-center gap-1.5"
              >
                {s}
                <button
                  type="button"
                  onClick={() => removeSuburb(s)}
                  className="text-slate-400 hover:text-white leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Section 5: Reviews */}
      <SectionDivider title="Reviews" />
      <ReviewParser reviews={reviews} onChange={setReviews} />

      {/* Section 6: Generate */}
      <div className="pt-6">
        {error && (
          <p className="text-red-400 text-sm mb-4 bg-red-900/20 border border-red-800/50 rounded-lg px-4 py-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-4 rounded-lg text-lg transition-colors"
        >
          {loading ? "Generating Demo Site..." : "Generate Demo Site"}
        </button>
      </div>
    </form>
  );
}
