"use client";

import { PuzzleResult } from "@/lib/types";

interface ResultsScreenProps {
  results: PuzzleResult[];
  totalTime: number;
}

export default function ResultsScreen({ results, totalTime }: ResultsScreenProps) {
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  const allSolved = results.every((r) => r.solved);

  const shareText = [
    "Codel - Daily Code Debug",
    "",
    ...results.map((r) => {
      const mins = Math.floor(r.timeSeconds / 60);
      const secs = r.timeSeconds % 60;
      const block = r.solved ? "\u2705" : "\u274c";
      return `${block} ${r.difficulty}: ${mins}:${String(secs).padStart(2, "0")}`;
    }),
    "",
    `Total: ${minutes}:${String(seconds).padStart(2, "0")}`,
  ].join("\n");

  const handleShare = () => {
    navigator.clipboard.writeText(shareText);
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center py-8">
      <h2 className="text-3xl font-bold">
        {allSolved ? "All Bugs Squashed!" : "Game Over"}
      </h2>

      <div className="text-5xl font-mono tabular-nums text-zinc-900">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {results.map((r) => {
          const mins = Math.floor(r.timeSeconds / 60);
          const secs = r.timeSeconds % 60;
          return (
            <div
              key={r.puzzleId}
              className={`flex justify-between items-center px-4 py-3 rounded-md border ${
                r.solved
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <span className="capitalize font-medium">{r.difficulty}</span>
              <span className="font-mono">
                {mins}:{String(secs).padStart(2, "0")}
              </span>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleShare}
        className="mt-4 px-6 py-3 bg-zinc-900 hover:bg-zinc-700 text-white font-semibold rounded-md transition-colors"
      >
        Copy Results
      </button>
    </div>
  );
}
