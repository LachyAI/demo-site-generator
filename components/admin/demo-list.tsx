"use client";

import { useEffect, useState } from "react";
import type { DemoConfig } from "@/lib/types";

interface DemoEntry extends DemoConfig {
  url?: string;
}

export function DemoList() {
  const [demos, setDemos] = useState<DemoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchDemos() {
    try {
      const res = await fetch("/api/demos");
      if (!res.ok) throw new Error("Failed to load demos");
      const data = await res.json();
      setDemos(data);
    } catch {
      setError("Failed to load demos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDemos();
  }, []);

  async function handleDelete(slug: string) {
    if (!confirm(`Delete demo "${slug}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/demos/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setDemos((prev) => prev.filter((d) => d.slug !== slug));
      } else {
        alert("Failed to delete demo.");
      }
    } catch {
      alert("Network error.");
    }
  }

  function copyUrl(slug: string) {
    const url = `${window.location.origin}/demo/${slug}`;
    navigator.clipboard.writeText(url);
  }

  function formatDate(iso?: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <p className="font-[family-name:var(--font-jetbrains)] text-[#6b6b7b] text-xs uppercase tracking-wider py-4">
        Loading...
      </p>
    );
  }

  if (error) {
    return (
      <p className="font-[family-name:var(--font-jetbrains)] text-red-500 text-xs uppercase tracking-wider py-4">
        {error}
      </p>
    );
  }

  if (demos.length === 0) {
    return (
      <div className="border border-[#1e1e2e] p-8 text-center">
        <p className="font-[family-name:var(--font-jetbrains)] text-[#6b6b7b] text-sm">
          No demos created yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {demos.map((demo) => (
        <div
          key={demo.slug}
          className="bg-[#12121a] border border-[#1e1e2e] p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-jetbrains)] font-semibold text-[#e8e8ed] truncate">
                {demo.businessName}
              </p>
              <p className="font-[family-name:var(--font-jetbrains)] text-[0.65rem] text-[#6b6b7b] uppercase tracking-wider mt-1">
                {demo.suburb} · {formatDate(demo.createdAt)}
              </p>
              <p className="font-[family-name:var(--font-jetbrains)] text-[0.65rem] text-[#3a3a4e] mt-0.5 truncate">
                /demo/{demo.slug}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={`/demo/${demo.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-jetbrains)] text-amber-500 hover:text-amber-400 text-xs uppercase tracking-wider px-3 py-1.5 border border-[#1e1e2e] hover:border-amber-500/50 transition-colors"
              >
                Open
              </a>
              <button
                type="button"
                onClick={() => copyUrl(demo.slug)}
                className="font-[family-name:var(--font-jetbrains)] text-[#6b6b7b] hover:text-[#e8e8ed] text-xs uppercase tracking-wider px-3 py-1.5 border border-[#1e1e2e] hover:border-[#2e2e3e] transition-colors"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={() => handleDelete(demo.slug)}
                className="font-[family-name:var(--font-jetbrains)] text-red-500 hover:text-red-400 text-xs uppercase tracking-wider px-3 py-1.5 border border-red-900/40 hover:border-red-500/50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
