"use client";

import { useState, useEffect } from "react";
import { PinGate } from "@/components/admin/pin-gate";
import { DemoForm } from "@/components/admin/demo-form";
import { DemoList } from "@/components/admin/demo-list";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_authenticated") === "true";
    setAuthenticated(isAuth);
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="font-[family-name:var(--font-jetbrains)] text-[#6b6b7b] text-xs uppercase tracking-wider">
          Loading...
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return <PinGate onAuthenticated={() => setAuthenticated(true)} />;
  }

  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      {/* Header */}
      <header className="border-b border-[#1e1e2e] p-6">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <p className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-[0.15em] text-[#6b6b7b]">
            Demo Site Generator
          </p>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("admin_authenticated");
              setAuthenticated(false);
            }}
            className="font-[family-name:var(--font-jetbrains)] text-[#6b6b7b] hover:text-amber-500 text-xs uppercase tracking-wider border border-[#1e1e2e] hover:border-amber-500/50 px-3 py-1.5 transition-colors"
          >
            Lock
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-[1200px] mx-auto p-6 space-y-10">
        {/* Create Demo */}
        <section>
          <DemoForm />
        </section>

        {/* Separator */}
        <div className="border-t border-[#1e1e2e]" />

        {/* Existing Demos */}
        <section>
          <p className="font-[family-name:var(--font-jetbrains)] text-[0.7rem] uppercase tracking-[0.1em] text-amber-500 mb-4">
            Existing Demos
          </p>
          <DemoList />
        </section>
      </main>
    </div>
  );
}
