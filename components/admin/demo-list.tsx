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
      <div className="text-slate-400 text-sm py-4">Loading demos...</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-sm py-4">{error}</div>
    );
  }

  if (demos.length === 0) {
    return (
      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-8 text-center">
        <p className="text-slate-400 text-sm">No demos created yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {demos.map((demo) => (
        <div
          key={demo.slug}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-white font-bold truncate">{demo.businessName}</p>
              <p className="text-slate-400 text-sm mt-0.5">
                {demo.suburb} · Created {formatDate(demo.createdAt)}
              </p>
              <p className="text-slate-500 text-xs mt-1 font-mono truncate">
                /demo/{demo.slug}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={`/demo/${demo.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white text-sm px-3 py-1.5 border border-slate-600 hover:border-slate-500 rounded-lg transition-colors"
              >
                Open
              </a>
              <button
                type="button"
                onClick={() => copyUrl(demo.slug)}
                className="text-slate-300 hover:text-white text-sm px-3 py-1.5 border border-slate-600 hover:border-slate-500 rounded-lg transition-colors"
              >
                Copy URL
              </button>
              <button
                type="button"
                onClick={() => handleDelete(demo.slug)}
                className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 border border-red-800/50 hover:border-red-700 rounded-lg transition-colors"
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
