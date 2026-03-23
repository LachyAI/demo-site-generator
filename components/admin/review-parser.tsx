"use client";

import { useState } from "react";
import type { Review } from "@/lib/types";

interface ReviewParserProps {
  reviews: Review[];
  onChange: (reviews: Review[]) => void;
}

function parseReviews(raw: string): Review[] {
  const parsed: Review[] = [];

  // Strategy 1: Try splitting by rating lines (e.g. "5", "★★★★★", "5 stars")
  // This handles Google review paste format like:
  // 5\nMar 12, 2026\nReview text...\nAB\nName Name\n247\n5\n...
  const ratingPattern = /^[1-5]$/;
  const starPattern = /^[★]{1,5}$/;
  const datePattern = /^(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d/i;
  const junkPattern = /^\d{2,3}$/; // "247" etc — Google review metadata

  const lines = raw.split("\n").map((l) => l.trim());

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Detect a rating line (start of a review block)
    let rating = 0;
    if (ratingPattern.test(line)) {
      rating = parseInt(line);
    } else if (starPattern.test(line)) {
      rating = (line.match(/★/g) || []).length;
    }

    if (rating >= 1 && rating <= 5) {
      // Scan forward to collect: skip date, collect review text, skip junk, find name
      i++;
      // Skip date line if present
      if (i < lines.length && datePattern.test(lines[i])) i++;

      // Collect review text lines (everything until we hit initials/name/junk/next rating)
      const textLines: string[] = [];
      while (i < lines.length) {
        const l = lines[i];
        if (!l) { i++; continue; }
        // Stop if this looks like a rating for next review
        if (ratingPattern.test(l) || starPattern.test(l)) break;
        // Stop if this is junk number like "247"
        if (junkPattern.test(l)) { i++; continue; }
        // Check if this is initials (1-3 uppercase chars) — likely reviewer initials, skip
        if (/^[A-Z]{1,3}$/.test(l)) { i++; continue; }
        // Check if next lines look like name + junk (end of this review)
        // A name is typically 2-4 words, no numbers
        if (textLines.length > 0 && /^[A-Za-z][a-z]+(?:\s+[A-Za-z][a-z]*)*$/.test(l) && l.split(/\s+/).length <= 4) {
          // This is the reviewer name
          const name = l;
          i++;
          // Skip trailing junk numbers
          while (i < lines.length && (junkPattern.test(lines[i]) || !lines[i])) i++;
          if (textLines.length > 0) {
            parsed.push({ name, rating, text: textLines.join(" ") });
          }
          break;
        }
        // "More" link from Google
        if (l === "More" || l === "... More") { i++; continue; }
        textLines.push(l);
        i++;
      }
      continue;
    }

    i++;
  }

  // Strategy 2: If strategy 1 found nothing, try simple double-newline blocks
  if (parsed.length === 0) {
    const blocks = raw.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
    for (const block of blocks) {
      const blines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (blines.length === 0) continue;

      // If only one line, treat entire block as review text with unknown name
      if (blines.length === 1) {
        parsed.push({ name: "Customer", rating: 5, text: blines[0] });
        continue;
      }

      // First line = name, rest = text, default 5 stars
      const name = blines[0];
      let r = 5;
      let tStart = 1;

      // Check if second line is a rating
      const secondLine = blines[1];
      const sc = (secondLine.match(/★/g) || []).length;
      if (sc > 0) { r = sc; tStart = 2; }
      else if (ratingPattern.test(secondLine)) { r = parseInt(secondLine); tStart = 2; }

      const text = blines.slice(tStart).join(" ").trim();
      if (text) parsed.push({ name, rating: r, text });
    }
  }

  // Strategy 3: If still nothing, treat the entire input as one review
  if (parsed.length === 0 && raw.trim().length > 10) {
    parsed.push({ name: "Customer", rating: 5, text: raw.trim() });
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
