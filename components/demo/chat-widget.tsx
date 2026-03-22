"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { DemoConfig } from "@/lib/types"

export function ChatWidget({ config }: { config: DemoConfig }) {
  const [open, setOpen] = useState(false)
  const ownerName = config.ownerName || "Support"
  const initial = ownerName.charAt(0).toUpperCase()

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Chat panel */}
      {open && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-navy-900 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {initial}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{ownerName}</p>
                <p className="text-xs text-green-400">Online now</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition-colors p-1"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 min-h-[200px] flex items-start">
            <div className="bg-white rounded-xl rounded-tl-sm p-3 shadow-sm border border-slate-100 text-sm text-slate-700 max-w-[85%]">
              Hey! Thanks for checking us out. If you need a quote, fill out the form above or give us a call. Happy to help!
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              disabled
              className="flex-1 bg-slate-100 rounded-lg px-3 py-2 text-sm text-slate-400 cursor-not-allowed outline-none"
            />
            <button
              type="button"
              disabled
              className="bg-accent-amber text-white rounded-lg p-2 opacity-50 cursor-not-allowed"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative bg-navy-800 hover:bg-navy-700 text-white rounded-full p-4 shadow-lg cursor-pointer transition-colors"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-navy-800" />
        )}
      </button>
    </div>
  )
}
