"use client";

import { useEffect, useState } from "react";
import { getTodaysLeaderboard, GameRecord } from "@/lib/db";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTodaysLeaderboard().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-1">Leaderboard</h2>
      <p className="text-zinc-500 text-sm mb-6">{today}</p>

      {loading ? (
        <p className="text-zinc-400">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="text-zinc-400">No completions yet today. Be the first!</p>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map((entry, i) => (
            <div
              key={`${entry.uid}_${entry.date}`}
              className="flex items-center gap-3 px-4 py-3 border border-zinc-200 rounded-md"
            >
              <span className="text-lg font-bold text-zinc-400 w-8">
                {i + 1}
              </span>
              {entry.photoURL && (
                <img
                  src={entry.photoURL}
                  alt=""
                  className="w-7 h-7 rounded-full"
                  referrerPolicy="no-referrer"
                />
              )}
              <span className="flex-1 font-medium">{entry.displayName}</span>
              <span className="font-mono text-zinc-600">
                {formatTime(entry.totalTime)}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
