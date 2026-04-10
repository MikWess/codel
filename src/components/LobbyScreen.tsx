"use client";

import { useEffect, useState } from "react";
import { getTodaysLeaderboard } from "@/lib/db";

interface LobbyScreenProps {
  onStart: () => void;
}

export default function LobbyScreen({ onStart }: LobbyScreenProps) {
  const [avgTime, setAvgTime] = useState<number | null>(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    getTodaysLeaderboard()
      .then((entries) => {
        setPlayerCount(entries.length);
        if (entries.length > 0) {
          const total = entries.reduce((sum, e) => sum + e.totalTime, 0);
          setAvgTime(Math.round(total / entries.length));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  return (
    <div className="flex flex-col items-center gap-8 py-16 text-center">
      <div>
        <p className="text-zinc-400 text-sm uppercase tracking-widest mb-2">
          Daily Puzzle
        </p>
        <h2 className="text-2xl font-bold">{today}</h2>
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="text-zinc-500 text-sm">3 bugs. 3 fixes. 1 timer.</p>
      </div>

      {!loading && playerCount > 0 && (
        <div className="border border-zinc-200 rounded-md px-6 py-4 bg-zinc-50">
          <p className="text-sm text-zinc-500 mb-1">
            {playerCount} {playerCount === 1 ? "player" : "players"} today
          </p>
          {avgTime !== null && (
            <p className="text-2xl font-mono font-semibold">
              {formatTime(avgTime)}
              <span className="text-sm font-normal text-zinc-400 ml-2">avg</span>
            </p>
          )}
        </div>
      )}

      <button
        onClick={onStart}
        className="px-10 py-4 bg-zinc-900 text-white text-lg font-semibold rounded-md hover:bg-zinc-700 transition-colors"
      >
        Start
      </button>
    </div>
  );
}
