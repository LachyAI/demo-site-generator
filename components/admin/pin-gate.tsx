"use client";

import { useState } from "react";

interface PinGateProps {
  onAuthenticated: () => void;
}

export function PinGate({ onAuthenticated }: PinGateProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!pin.trim()) return;
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setPin(val);
    if (val.length === 6) {
      // auto-submit after a tick so state updates first
      setTimeout(() => {
        setPin(val);
      }, 0);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <p className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-[0.15em] text-[#6b6b7b] mb-8">
          Demo Generator
        </p>

        <input
          type="password"
          value={pin}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          maxLength={6}
          placeholder="······"
          className="bg-transparent border border-[#1e1e2e] text-amber-500 font-[family-name:var(--font-jetbrains)] text-3xl text-center tracking-[0.5em] py-3 px-6 w-[250px] focus:border-amber-500 focus:outline-none placeholder-[#2a2a3e]"
          autoFocus
          disabled={loading}
        />

        {error && (
          <p className="text-red-500 font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider mt-4">
            {error}
          </p>
        )}

        <p className="text-[#6b6b7b] font-[family-name:var(--font-jetbrains)] text-[0.6rem] uppercase tracking-[0.1em] mt-6">
          Enter PIN
        </p>
      </div>
    </div>
  );
}
