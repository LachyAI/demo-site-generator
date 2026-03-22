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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <PinGate onAuthenticated={() => setAuthenticated(true)} />;
  }

  return (
    <div className="dark">
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="border-b border-border p-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Demo Site Generator
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Create live demo websites for prospects
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("admin_authenticated");
                setAuthenticated(false);
              }}
              className="text-slate-400 hover:text-slate-300 text-sm border border-slate-700 hover:border-slate-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              Lock
            </button>
          </div>
        </header>

        {/* Body */}
        <main className="max-w-5xl mx-auto p-6 space-y-10">
          {/* Create Demo */}
          <section>
            <DemoForm />
          </section>

          {/* Separator */}
          <div className="border-t border-border" />

          {/* Existing Demos */}
          <section>
            <h2 className="font-heading text-xl font-bold text-foreground mb-4">
              Existing Demos
            </h2>
            <DemoList />
          </section>
        </main>
      </div>
    </div>
  );
}
