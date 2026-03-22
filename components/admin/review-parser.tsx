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

    let rating = 5;
    let textStart = 1;

    const starLine = lines[1];
    const starCount = (starLine.match(/★/g) || []).length;
    if (starCount > 0) {
      rating = starCount;
      textStart = 2;
    } else {
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

const reviewInputClass =
  "w-full bg-transparent border border-[#1e1e2e] text-[#e8e8ed] font-[family-name:var(--font-jetbrains)] px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-none";

const reviewLabelClass =
  "block font-[family-name:var(--font-jetbrains)] text-[0.65rem] uppercase tracking-[0.1em] text-[#6b6b7b] mb-1";

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
    <div className="bg-[#0a0a0f] border border-[#1e1e2e] p-4 space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className={reviewLabelClass}>Name</label>
          <input
            type="text"
            value={review.name}
            onChange={(e) => onChange({ ...review, name: e.target.value })}
            className={reviewInputClass}
          />
        </div>
        <div className="w-24">
          <label className={reviewLabelClass}>Rating</label>
          <select
            value={review.rating}
            onChange={(e) => onChange({ ...review, rating: parseInt(e.target.value) })}
            className="w-full bg-[#12121a] border border-[#1e1e2e] text-[#e8e8ed] font-[family-name:var(--font-jetbrains)] px-2 py-1.5 text-sm focus:border-amber-500 focus:outline-none"
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
          className="self-end font-[family-name:var(--font-jetbrains)] text-[#6b6b7b] hover:text-red-500 text-xs uppercase tracking-wider px-2 py-1.5 transition-colors"
        >
          Remove
        </button>
      </div>
      <div>
        <label className={reviewLabelClass}>Review Text</label>
        <textarea
          value={review.text}
          onChange={(e) => onChange({ ...review, text: e.target.value })}
          rows={3}
          className="w-full bg-transparent border border-[#1e1e2e] text-[#e8e8ed] font-[family-name:var(--font-jetbrains)] px-3 py-2 text-sm focus:border-amber-500 focus:outline-none resize-none"
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
          className="w-full bg-transparent border border-[#1e1e2e] text-[#e8e8ed] font-[family-name:var(--font-jetbrains)] px-4 py-3 text-sm focus:border-amber-500 focus:outline-none resize-none placeholder-[#3a3a4e]"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleParse}
          disabled={!raw.trim()}
          className="border border-[#1e1e2e] text-[#e8e8ed] font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider px-4 py-2 hover:border-amber-500 hover:text-amber-500 disabled:opacity-40 transition-colors"
        >
          Parse Reviews
        </button>
        <button
          type="button"
          onClick={handleAddManual}
          className="border border-[#1e1e2e] text-[#6b6b7b] font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider px-4 py-2 hover:border-[#2e2e3e] hover:text-[#e8e8ed] transition-colors"
        >
          Add Manually
        </button>
      </div>

      {reviews.length > 0 && (
        <div className="space-y-3">
          <p className="font-[family-name:var(--font-jetbrains)] text-[0.65rem] uppercase tracking-[0.1em] text-[#6b6b7b]">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
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
