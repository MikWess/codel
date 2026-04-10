"use client";

import { useState } from "react";
import { PuzzleResult } from "@/lib/types";
import { useAuth } from "./AuthProvider";

interface ResultsScreenProps {
  results: PuzzleResult[];
  totalTime: number;
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function FireIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

export default function ResultsScreen({ results, totalTime }: ResultsScreenProps) {
  const { user, signIn } = useAuth();
  const [copied, setCopied] = useState(false);

  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  const allSolved = results.every((r) => r.solved);

  const puzzleNumber = Math.floor(
    (Date.now() - new Date("2026-04-10").getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const shareText = [
    `Codel #${puzzleNumber}`,
    "",
    ...results.map((r) => {
      const mins = Math.floor(r.timeSeconds / 60);
      const secs = r.timeSeconds % 60;
      const bar = r.solved ? "\u2588".repeat(Math.min(Math.ceil(r.timeSeconds / 15), 8)) : "\u2573";
      const color = r.difficulty === "easy" ? "\ud83d\udfe2" : r.difficulty === "medium" ? "\ud83d\udfe1" : "\ud83d\udd34";
      return `${color} ${mins}:${String(secs).padStart(2, "0")} ${bar}`;
    }),
    "",
    `\u23f1\ufe0f ${minutes}:${String(seconds).padStart(2, "0")} total`,
    "",
    "Play at codel-theta.vercel.app",
    "Built by @Mik_wess",
  ].join("\n");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
        return;
      } catch {
        // User cancelled or not supported — fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center py-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-1">
          {allSolved ? "All Bugs Squashed!" : "Game Over"}
        </h2>
        <p className="text-zinc-400 text-sm font-mono">Codel #{puzzleNumber}</p>
      </div>

      {/* Big time */}
      <div className="text-5xl font-mono tabular-nums text-zinc-900 font-bold">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>

      {/* Per-puzzle results */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {results.map((r) => {
          const mins = Math.floor(r.timeSeconds / 60);
          const secs = r.timeSeconds % 60;
          const barWidth = Math.min((r.timeSeconds / 120) * 100, 100);
          return (
            <div
              key={r.puzzleId}
              className={`relative overflow-hidden flex justify-between items-center px-4 py-3 rounded-md border ${
                r.solved
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {/* Time bar background */}
              <div
                className={`absolute left-0 top-0 bottom-0 ${
                  r.solved ? "bg-green-100" : "bg-red-100"
                }`}
                style={{ width: `${barWidth}%` }}
              />
              <span className="relative capitalize font-medium">{r.difficulty}</span>
              <span className="relative font-mono">
                {mins}:{String(secs).padStart(2, "0")}
              </span>
            </div>
          );
        })}
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-all hover:scale-105 active:scale-100"
      >
        <ShareIcon />
        {copied ? "Copied!" : "Share Results"}
      </button>

      {/* Preview of share text */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 w-full max-w-sm text-left">
        <pre className="text-xs text-zinc-600 font-mono whitespace-pre-wrap leading-relaxed">
          {shareText}
        </pre>
      </div>

      {/* Streak / Sign in CTA */}
      <div className="border-t border-zinc-200 pt-6 mt-2 w-full max-w-sm">
        {user ? (
          <div className="flex items-center justify-center gap-2 text-zinc-600">
            <FireIcon />
            <span className="font-semibold">Keep your streak alive!</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-zinc-500">
              <FireIcon />
              <span className="text-sm">Sign in to start a streak & hit the leaderboard</span>
            </div>
            <button
              onClick={signIn}
              className="flex items-center gap-2 px-5 py-2.5 border border-zinc-300 rounded-lg hover:border-zinc-400 transition-colors text-sm font-medium text-zinc-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        )}
      </div>

      {/* Come back tomorrow */}
      <p className="text-xs text-zinc-300 mt-2">
        New puzzles drop every day at midnight
      </p>
    </div>
  );
}
