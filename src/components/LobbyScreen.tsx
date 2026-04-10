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
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      {/* Animated code bracket icon */}
      <div className="relative">
        <div className="text-6xl font-mono font-bold text-zinc-900 select-none">
          <span className="inline-block animate-pulse text-zinc-300">{"{"}</span>
          <span className="inline-block mx-1 text-red-400 relative">
            <span className="absolute -top-1 -right-2 text-xs bg-red-100 text-red-500 rounded-full w-4 h-4 flex items-center justify-center font-sans font-bold">
              ?
            </span>
            _
          </span>
          <span className="inline-block animate-pulse text-zinc-300">{"}"}</span>
        </div>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Daily Debug</h2>
        <p className="text-zinc-400 text-sm">{today}</p>
        <p className="text-zinc-300 text-xs mt-0.5 font-mono">#{puzzleNumber}</p>
      </div>

      {/* Rules cards */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-md">
        <div className="border border-zinc-200 rounded-lg p-3 bg-white">
          <div className="text-2xl mb-1">1</div>
          <p className="text-xs text-zinc-500 leading-tight">Read the buggy code</p>
        </div>
        <div className="border border-zinc-200 rounded-lg p-3 bg-white">
          <div className="text-2xl mb-1">2</div>
          <p className="text-xs text-zinc-500 leading-tight">Fix the bug & run it</p>
        </div>
        <div className="border border-zinc-200 rounded-lg p-3 bg-white">
          <div className="text-2xl mb-1">3</div>
          <p className="text-xs text-zinc-500 leading-tight">Beat the clock</p>
        </div>
      </div>

      {/* Difficulty preview */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <span className="text-zinc-500">Easy</span>
        </div>
        <div className="text-zinc-300">/</div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="text-zinc-500">Medium</span>
        </div>
        <div className="text-zinc-300">/</div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="text-zinc-500">Hard</span>
        </div>
      </div>

      {/* Stats */}
      {!loading && playerCount > 0 && (
        <div className="flex gap-6">
          <div>
            <p className="text-3xl font-bold">{playerCount}</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider">
              {playerCount === 1 ? "Player" : "Players"}
            </p>
          </div>
          {avgTime !== null && (
            <div className="border-l border-zinc-200 pl-6">
              <p className="text-3xl font-mono font-bold">{formatTime(avgTime)}</p>
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Avg Time</p>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onStart}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="relative mt-2 px-12 py-4 bg-zinc-900 text-white text-lg font-semibold rounded-lg hover:bg-zinc-800 transition-all hover:scale-105 hover:shadow-lg active:scale-100"
      >
        {hovering ? "Let's Go" : "Start"}
      </button>

      <p className="text-xs text-zinc-300 max-w-xs">
        Timer starts when you click. 3 puzzles, each slightly harder. How fast can you debug?
      </p>
    </div>
  );
}
