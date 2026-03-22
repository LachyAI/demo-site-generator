"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PinGateProps {
  onAuthenticated: () => void;
}

export function PinGate({ onAuthenticated }: PinGateProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (res.ok) {
        sessionStorage.setItem("admin_authenticated", "true");
        onAuthenticated();
      } else {
        setError("Invalid PIN");
        setPin("");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-sm">
        <h1 className="font-heading text-xl font-bold text-white text-center mb-1">
          Demo Site Generator
        </h1>
        <p className="text-slate-400 text-sm text-center mb-6">
          Enter PIN to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={6}
            placeholder="••••••"
            className="w-full bg-slate-800 border border-slate-700 text-white text-center text-2xl tracking-[0.5em] rounded-lg px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 placeholder-slate-600"
            autoFocus
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading || pin.length === 0}
            className="w-full py-3 rounded-lg font-bold text-white bg-amber-500 hover:bg-amber-600 border-0 h-auto disabled:opacity-50"
          >
            {loading ? "Checking..." : "Enter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
