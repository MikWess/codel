"use client";

import { useEffect, useState } from "react";
import { getTodaysLeaderboard } from "@/lib/db";
import Testimonials from "./Testimonials";

interface LobbyScreenProps {
  onStart: () => void;
}

export default function LobbyScreen({ onStart }: LobbyScreenProps) {
  const [avgTime, setAvgTime] = useState<number | null>(null);
  const [medianTime, setMedianTime] = useState<number | null>(null);
  const [percentiles, setPercentiles] = useState<{ time: number; pct: number }[]>([]);
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
          const times = entries.map((e) => e.totalTime).sort((a, b) => a - b);
          const total = times.reduce((sum, t) => sum + t, 0);
          setAvgTime(Math.round(total / times.length));
          setMedianTime(times[Math.floor(times.length / 2)]);

          // Calculate beat-percentile targets
          const targets = [
            { pct: 90, idx: Math.floor(times.length * 0.1) },
            { pct: 75, idx: Math.floor(times.length * 0.25) },
            { pct: 50, idx: Math.floor(times.length * 0.5) },
          ];
          setPercentiles(
            targets
              .filter((t) => t.idx < times.length)
              .map((t) => ({ time: times[t.idx], pct: t.pct }))
          );
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

      {/* Challenge targets */}
      {!loading && playerCount > 0 && medianTime !== null && (
        <div className="w-full max-w-md">
          <div className="border border-zinc-200 rounded-lg p-5 bg-zinc-50">
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-3">
              {playerCount} players today
            </p>
            <div className="flex flex-col gap-2">
              {percentiles.map(({ time, pct }) => (
                <div key={pct} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-lg">{formatTime(time)}</span>
                    <span className="text-zinc-400 text-sm">or faster</span>
                  </div>
                  <span
                    className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${
                      pct === 90
                        ? "bg-amber-100 text-amber-700"
                        : pct === 75
                          ? "bg-blue-100 text-blue-700"
                          : "bg-zinc-200 text-zinc-600"
                    }`}
                  >
                    Top {100 - pct}%
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-200 mt-3 pt-3 flex items-center justify-between">
              <span className="text-sm text-zinc-500">Average time</span>
              <span className="font-mono font-semibold">{formatTime(avgTime!)}</span>
            </div>
          </div>
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

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
}
