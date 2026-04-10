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
  const [hovering, setHovering] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const puzzleNumber = Math.floor(
    (Date.now() - new Date("2026-04-10").getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

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
      {/* Code bracket icon */}
      <div className="text-7xl font-mono font-bold text-zinc-900 select-none tracking-wider">
        <span className="text-zinc-300">{"{"}</span>
        <span className="text-red-400 mx-1">_</span>
        <span className="text-zinc-300">{"}"}</span>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-4xl font-bold tracking-tight mb-2">Daily Debug</h2>
        <p className="text-zinc-400 text-base">{today}</p>
        <p className="text-zinc-300 text-sm mt-1 font-mono">#{puzzleNumber}</p>
      </div>

      {/* Rules cards */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
        <div className="border border-zinc-200 rounded-lg p-4 bg-white">
          <div className="text-3xl font-bold mb-1">1</div>
          <p className="text-sm text-zinc-500 leading-snug">Read the buggy code</p>
        </div>
        <div className="border border-zinc-200 rounded-lg p-4 bg-white">
          <div className="text-3xl font-bold mb-1">2</div>
          <p className="text-sm text-zinc-500 leading-snug">Fix the bug & run it</p>
        </div>
        <div className="border border-zinc-200 rounded-lg p-4 bg-white">
          <div className="text-3xl font-bold mb-1">3</div>
          <p className="text-sm text-zinc-500 leading-snug">Beat the clock</p>
        </div>
      </div>

      {/* Difficulty preview */}
      <div className="flex items-center gap-5 text-base">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="text-zinc-500">Easy</span>
        </div>
        <div className="text-zinc-300">/</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="text-zinc-500">Medium</span>
        </div>
        <div className="text-zinc-300">/</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span className="text-zinc-500">Hard</span>
        </div>
      </div>

      {/* Stats */}
      {!loading && playerCount > 0 && (
        <div className="flex gap-8">
          <div>
            <p className="text-4xl font-bold">{playerCount}</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider mt-1">
              {playerCount === 1 ? "Player" : "Players"}
            </p>
          </div>
          {avgTime !== null && (
            <div className="border-l border-zinc-200 pl-8">
              <p className="text-4xl font-mono font-bold">{formatTime(avgTime)}</p>
              <p className="text-xs text-zinc-400 uppercase tracking-wider mt-1">Avg Time</p>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onStart}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="relative mt-2 px-14 py-5 bg-zinc-900 text-white text-xl font-semibold rounded-lg hover:bg-zinc-800 transition-all hover:scale-105 hover:shadow-lg active:scale-100"
      >
        {hovering ? "Let's Go" : "Start"}
      </button>

      <p className="text-sm text-zinc-400 max-w-sm">
        Timer starts when you click. 3 puzzles, each slightly harder. How fast can you debug?
      </p>
    </div>
  );
}
