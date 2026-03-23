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
  "w-full bg-transparent border border-[#1e1e2e] text-[#e8e8ed] font-[family-name:var(--font-jetbrains)] px-3 py-2 text-sm focus:border-amber-500 focus:outline-none placeholder-[#3a3a4e]";

const labelClass =
  "block font-[family-name:var(--font-jetbrains)] text-[0.7rem] uppercase tracking-[0.1em] text-amber-500 mb-1.5";

const sectionHeadingClass =
  "font-[family-name:var(--font-jetbrains)] text-[0.7rem] uppercase tracking-[0.1em] text-amber-500 mb-4";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] p-5 mb-4">
      <h2 className={sectionHeadingClass}>{title}</h2>
      {children}
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

  // About / Bio
  const [aboutBio, setAboutBio] = useState("");
  const [aboutHometown, setAboutHometown] = useState("");
  const [aboutExperience, setAboutExperience] = useState("");
  const [aboutEducation, setAboutEducation] = useState("");
  const [aboutPassion, setAboutPassion] = useState("");

  // Logo
  const [logoUrl, setLogoUrl] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");

  // Stats
  const [statsJobs, setStatsJobs] = useState("500");
  const [statsClients, setStatsClients] = useState("200");
  const [statsRating, setStatsRating] = useState("4.9");

  // Colors
  const [colorPrimary, setColorPrimary] = useState("#102a43");
  const [colorAccent, setColorAccent] = useState("#f59e0b");
  const [colorHighlight, setColorHighlight] = useState("#f59e0b");

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

    const aboutData = {
      bio: aboutBio.trim() || undefined,
      hometown: aboutHometown.trim() || undefined,
      experience: aboutExperience.trim() || undefined,
      education: aboutEducation.trim() || undefined,
      passion: aboutPassion.trim() || undefined,
    };
    const hasAbout = Object.values(aboutData).some(Boolean);

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
      ...(logoUrl.trim() ? { logoUrl: logoUrl.trim() } : {}),
      stats: {
        jobsCompleted: parseInt(statsJobs) || 500,
        happyClients: parseInt(statsClients) || 200,
        googleRating: Math.round(parseFloat(statsRating) * 10) || 49,
      },
      colors: {
        primary: colorPrimary,
        accent: colorAccent,
        highlight: colorHighlight,
      },
      ...(hasAbout ? { about: aboutData } : {}),
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
      <div className="bg-[#0a0a0f] border border-amber-500/25 border-l-[3px] border-l-amber-500 p-5 space-y-4">
        <h3 className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-[0.1em] text-amber-500">
          Demo Created
        </h3>
        <p className="text-[#6b6b7b] font-[family-name:var(--font-jetbrains)] text-xs">Your demo site is live at:</p>
        <div className="bg-[#12121a] border border-[#1e1e2e] px-4 py-3 font-[family-name:var(--font-jetbrains)] text-sm text-[#e8e8ed] break-all">
          {fullUrl}
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={copyUrl}
            className="border border-[#1e1e2e] text-[#e8e8ed] font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider px-4 py-2 hover:border-amber-500 hover:text-amber-500 transition-colors"
          >
            Copy URL
          </button>
          <a
            href={success.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 hover:bg-amber-600 text-black font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider px-4 py-2 transition-colors"
          >
            Open in New Tab
          </a>
          <button
            type="button"
            onClick={() => setSuccess(null)}
            className="border border-[#1e1e2e] text-[#6b6b7b] font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider px-4 py-2 hover:border-[#2e2e3e] hover:text-[#e8e8ed] transition-colors"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-0">
      {/* Section 1: Business Details */}
      <SectionCard title="Business Details">
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
      </SectionCard>

      {/* Logo & Stats */}
      <SectionCard title="Logo & Stats">
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Logo (optional)</label>
            <div className="flex items-center gap-4">
              {logoPreview && (
                <div className="w-12 h-12 border border-[#1e1e2e] flex items-center justify-center shrink-0 bg-[#0a0a0f]">
                  <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                </div>
              )}
              <div className="flex-1">
                <label className="block cursor-pointer">
                  <span className={`inline-block border border-[#1e1e2e] text-[#e8e8ed] font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider px-4 py-2 hover:border-amber-500 hover:text-amber-500 transition-colors ${logoUploading ? "opacity-50 pointer-events-none" : ""}`}>
                    {logoUploading ? "Uploading..." : logoPreview ? "Change Logo" : "Upload Logo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLogoUploading(true);
                      setLogoPreview(URL.createObjectURL(file));
                      try {
                        const formData = new FormData();
                        formData.append("file", file);
                        const res = await fetch("/api/upload", { method: "POST", body: formData });
                        const data = await res.json();
                        if (data.url) {
                          setLogoUrl(data.url);
                        }
                      } catch {
                        setLogoPreview("");
                      }
                      setLogoUploading(false);
                    }}
                  />
                </label>
                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => { setLogoUrl(""); setLogoPreview(""); }}
                    className="ml-3 text-red-500 font-[family-name:var(--font-jetbrains)] text-[0.6rem] uppercase tracking-wider hover:text-red-400"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <p className="text-[#3a3a4e] text-[0.6rem] font-[family-name:var(--font-jetbrains)] mt-1">
              Upload a logo image. Leave empty to show business name as text.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Jobs Completed</label>
              <input
                type="number"
                value={statsJobs}
                onChange={(e) => setStatsJobs(e.target.value)}
                className={inputClass}
                placeholder="500"
              />
            </div>
            <div>
              <label className={labelClass}>Happy Clients</label>
              <input
                type="number"
                value={statsClients}
                onChange={(e) => setStatsClients(e.target.value)}
                className={inputClass}
                placeholder="200"
              />
            </div>
            <div>
              <label className={labelClass}>Google Rating</label>
              <input
                type="text"
                value={statsRating}
                onChange={(e) => setStatsRating(e.target.value)}
                className={inputClass}
                placeholder="4.9"
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Section 2: Services */}
      <SectionCard title="Services">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESET_SERVICES.map((service) => {
            const checked = selectedServices.has(service.id);
            return (
              <div
                key={service.id}
                className={`border p-3 transition-colors cursor-pointer ${
                  checked
                    ? "border-amber-500/60 bg-amber-500/5"
                    : "border-[#1e1e2e] bg-[#0a0a0f] hover:border-[#2e2e3e]"
                }`}
              >
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleService(service.id)}
                    className="accent-amber-500 w-4 h-4 flex-shrink-0"
                  />
                  <span className="font-[family-name:var(--font-jetbrains)] text-[#e8e8ed] text-sm">
                    {service.name}
                  </span>
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
                    className="mt-2 w-full bg-transparent border border-[#1e1e2e] text-[#6b6b7b] font-[family-name:var(--font-jetbrains)] px-3 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
                  />
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Section 3: Credentials */}
      <SectionCard title="Credentials">
        <div className="flex flex-wrap gap-3">
          {PRESET_CREDENTIALS.map((cred) => {
            const checked = selectedCredentials.has(cred);
            return (
              <label
                key={cred}
                className={`flex items-center gap-2 cursor-pointer border px-3 py-2 text-xs transition-colors font-[family-name:var(--font-jetbrains)] ${
                  checked
                    ? "border-amber-500/60 bg-amber-500/5 text-[#e8e8ed]"
                    : "border-[#1e1e2e] text-[#6b6b7b] hover:border-[#2e2e3e] hover:text-[#e8e8ed]"
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
      </SectionCard>

      {/* Section 4: About / Bio */}
      <SectionCard title="About / Bio (Optional)">
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              value={aboutBio}
              onChange={(e) => setAboutBio(e.target.value)}
              className={`${inputClass} min-h-[80px] resize-y`}
              placeholder="I started fixing things when I was a kid..."
            />
            <p className="font-[family-name:var(--font-jetbrains)] text-[0.65rem] text-[#6b6b7b] mt-1">
              Short bio paragraph about the owner
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Hometown</label>
              <input
                type="text"
                value={aboutHometown}
                onChange={(e) => setAboutHometown(e.target.value)}
                className={inputClass}
                placeholder="Born and raised in Brisbane"
              />
            </div>
            <div>
              <label className={labelClass}>Experience</label>
              <input
                type="text"
                value={aboutExperience}
                onChange={(e) => setAboutExperience(e.target.value)}
                className={inputClass}
                placeholder="15+ years in residential repairs"
              />
            </div>
            <div>
              <label className={labelClass}>Education</label>
              <input
                type="text"
                value={aboutEducation}
                onChange={(e) => setAboutEducation(e.target.value)}
                className={inputClass}
                placeholder="Cert III Carpentry, Licensed Builder"
              />
            </div>
            <div>
              <label className={labelClass}>Passion</label>
              <input
                type="text"
                value={aboutPassion}
                onChange={(e) => setAboutPassion(e.target.value)}
                className={inputClass}
                placeholder="I love turning a house into a home people are proud of"
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Section 5: Service Suburbs */}
      <SectionCard title="Service Suburbs">
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
              className="border border-[#1e1e2e] hover:border-amber-500 text-[#6b6b7b] hover:text-amber-500 font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider px-3 py-2 transition-colors whitespace-nowrap"
            >
              Add Common Brisbane
            </button>
          </div>

          {suburbs.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suburbs.map((s) => (
                <span
                  key={s}
                  className="bg-[#1a1a2e] border border-[#1e1e2e] text-[#e8e8ed] px-3 py-1 text-xs font-[family-name:var(--font-jetbrains)] flex items-center gap-1.5"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSuburb(s)}
                    className="text-[#6b6b7b] hover:text-amber-500 leading-none transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </SectionCard>

      {/* Section 5: Reviews */}
      <SectionCard title="Reviews">
        <ReviewParser reviews={reviews} onChange={setReviews} />
      </SectionCard>

      {/* Section 6: Branding Colors */}
      <SectionCard title="Branding Colors">
        <div className="space-y-4">
          {[
            {
              label: "Primary",
              desc: "Main background color (hero, nav)",
              value: colorPrimary,
              onChange: setColorPrimary,
            },
            {
              label: "Accent",
              desc: "Buttons and highlights",
              value: colorAccent,
              onChange: setColorAccent,
            },
            {
              label: "Highlight",
              desc: "Colored words in headings",
              value: colorHighlight,
              onChange: setColorHighlight,
            },
          ].map(({ label, desc, value, onChange }) => (
            <div key={label} className="flex items-center gap-4">
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="color-swatch-input"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-28 bg-transparent border border-[#1e1e2e] text-[#e8e8ed] font-[family-name:var(--font-jetbrains)] px-3 py-1.5 text-xs focus:border-amber-500 focus:outline-none"
              />
              <div>
                <p className="font-[family-name:var(--font-jetbrains)] text-[0.7rem] text-[#e8e8ed]">{label}</p>
                <p className="font-[family-name:var(--font-jetbrains)] text-[0.65rem] text-[#6b6b7b]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Section 7: Generate */}
      <div className="pt-2">
        {error && (
          <p className="text-red-500 font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider mb-4 border border-red-500/30 border-l-[3px] border-l-red-500 px-4 py-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-[family-name:var(--font-jetbrains)] font-semibold uppercase tracking-wider text-sm py-3 transition-colors"
        >
          {loading ? "Generating Demo Site..." : "Generate Demo Site"}
        </button>
      </div>
    </form>
  );
}
