"use client";

import { useState } from "react";
import type { Review } from "@/lib/types";

interface ReviewParserProps {
  reviews: Review[];
  onChange: (reviews: Review[]) => void;
}

function parseReviews(raw: string): Review[] {
  const blocks = raw.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const parsed: Review[] = [];

  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;

    const name = lines[0];

    // Try to extract star rating from second line or whole block
    let rating = 5;
    let textStart = 1;

    const starLine = lines[1];
    const starCount = (starLine.match(/★/g) || []).length;
    if (starCount > 0) {
      rating = starCount;
      textStart = 2;
    } else {
      // Look for "5 stars", "4/5", "5.0", "4 out of 5"
      const numMatch = starLine.match(/(\d)[\/\s]?(?:out of\s*)?(?:\d\s*)?(?:stars?|\/5)?/i);
      if (numMatch) {
        const n = parseInt(numMatch[1]);
        if (n >= 1 && n <= 5) {
          rating = n;
          textStart = 2;
        }
      }
    }

    const text = lines.slice(textStart).join(" ").trim();
    if (!text || !name) continue;

    parsed.push({ name, rating, text });
  }

  return parsed;
}

function ReviewCard({
  review,
  index,
  onChange,
  onRemove,
}: {
  review: Review;
  index: number;
  onChange: (r: Review) => void;
  onRemove: () => void;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-slate-400 mb-1">Name</label>
          <input
            type="text"
            value={review.name}
            onChange={(e) => onChange({ ...review, name: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-sm outline-none focus:border-amber-500"
          />
        </div>
        <div className="w-24">
          <label className="block text-xs text-slate-400 mb-1">Rating</label>
          <select
            value={review.rating}
            onChange={(e) => onChange({ ...review, rating: parseInt(e.target.value) })}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1.5 text-sm outline-none focus:border-amber-500"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(n)} ({n})
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="self-end text-slate-500 hover:text-red-400 text-sm px-2 py-1.5 transition-colors"
        >
          Remove
        </button>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Review Text</label>
        <textarea
          value={review.text}
          onChange={(e) => onChange({ ...review, text: e.target.value })}
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 resize-none"
        />
      </div>
    </div>
  );
}

export function ReviewParser({ reviews, onChange }: ReviewParserProps) {
  const [raw, setRaw] = useState("");

  function handleParse() {
    const parsed = parseReviews(raw);
    if (parsed.length > 0) {
      onChange([...reviews, ...parsed]);
      setRaw("");
    }
  }

  function handleAddManual() {
    onChange([...reviews, { name: "", rating: 5, text: "" }]);
  }

  function updateReview(index: number, updated: Review) {
    const next = [...reviews];
    next[index] = updated;
    onChange(next);
  }

  function removeReview(index: number) {
    onChange(reviews.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={6}
          placeholder={`Paste Google reviews here...\n\nFormat:\nJohn Smith\n★★★★★\nGreat work on our fence...`}
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-amber-500 resize-none placeholder-slate-500"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleParse}
          disabled={!raw.trim()}
          className="bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Parse Reviews
        </button>
        <button
          type="button"
          onClick={handleAddManual}
          className="border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Add Review Manually
        </button>
      </div>

      {reviews.length > 0 && (
        <div className="space-y-3">
          <p className="text-slate-400 text-sm">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
          {reviews.map((review, i) => (
            <ReviewCard
              key={i}
              review={review}
              index={i}
              onChange={(r) => updateReview(i, r)}
              onRemove={() => removeReview(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
