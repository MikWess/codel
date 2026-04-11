"use client";

import { useEffect, useState } from "react";
import { getTodaysLeaderboard, GameRecord } from "@/lib/db";
import { useAuth } from "@/components/AuthProvider";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function Medal({ place }: { place: number }) {
  if (place === 1)
    return <span className="text-2xl">🥇</span>;
  if (place === 2)
    return <span className="text-2xl">🥈</span>;
  if (place === 3)
    return <span className="text-2xl">🥉</span>;
  return (
    <span className="text-lg font-bold text-zinc-300 w-8 text-center tabular-nums">
      {place}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500",
  "bg-rose-500", "bg-cyan-500", "bg-indigo-500", "bg-orange-500",
  "bg-teal-500", "bg-pink-500", "bg-lime-600", "bg-fuchsia-500",
];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTodaysLeaderboard().then((data) => {
      setEntries(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const puzzleNumber = Math.floor(
    (Date.now() - new Date("2026-04-10").getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const avgTime =
    entries.length > 0
      ? Math.round(entries.reduce((s, e) => s + e.totalTime, 0) / entries.length)
      : null;

  const bestTime = entries.length > 0 ? entries[0].totalTime : null;

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Leaderboard</h2>
        <p className="text-zinc-400 text-sm mt-1">{today}</p>
        <p className="text-zinc-300 text-xs font-mono mt-0.5">Codel #{puzzleNumber}</p>
      </div>

      {/* Stats bar */}
      {entries.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center border border-zinc-200 rounded-lg py-3">
            <p className="text-2xl font-bold">{entries.length}</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider">Players</p>
          </div>
          <div className="text-center border border-zinc-200 rounded-lg py-3">
            <p className="text-2xl font-mono font-bold">{bestTime !== null ? formatTime(bestTime) : "-"}</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider">Best</p>
          </div>
          <div className="text-center border border-zinc-200 rounded-lg py-3">
            <p className="text-2xl font-mono font-bold">{avgTime !== null ? formatTime(avgTime) : "-"}</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider">Average</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-zinc-400">Loading...</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-400 text-lg mb-2">No completions yet today.</p>
          <p className="text-zinc-300 text-sm">Be the first to debug!</p>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          {entries.length >= 3 && (
            <div className="flex items-end justify-center gap-3 mb-8">
              {/* 2nd place */}
              <div className="flex flex-col items-center w-28">
                <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 font-bold text-sm mb-2">
                  {entries[1].photoURL ? (
                    <img src={entries[1].photoURL} alt="" className="w-12 h-12 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    getInitials(entries[1].displayName)
                  )}
                </div>
                <p className="text-sm font-semibold truncate w-full text-center">{entries[1].displayName}</p>
                <p className="text-xs font-mono text-zinc-500">{formatTime(entries[1].totalTime)}</p>
                <div className="w-full bg-zinc-100 rounded-t-lg mt-2 h-16 flex items-center justify-center">
                  <span className="text-2xl">🥈</span>
                </div>
              </div>

              {/* 1st place */}
              <div className="flex flex-col items-center w-32">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-base mb-2 ring-2 ring-amber-300">
                  {entries[0].photoURL ? (
                    <img src={entries[0].photoURL} alt="" className="w-14 h-14 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    getInitials(entries[0].displayName)
                  )}
                </div>
                <p className="text-sm font-bold truncate w-full text-center">{entries[0].displayName}</p>
                <p className="text-xs font-mono text-zinc-500">{formatTime(entries[0].totalTime)}</p>
                <div className="w-full bg-amber-50 border border-amber-200 rounded-t-lg mt-2 h-24 flex items-center justify-center">
                  <span className="text-3xl">🥇</span>
                </div>
              </div>

              {/* 3rd place */}
              <div className="flex flex-col items-center w-28">
                <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 font-bold text-sm mb-2">
                  {entries[2].photoURL ? (
                    <img src={entries[2].photoURL} alt="" className="w-12 h-12 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    getInitials(entries[2].displayName)
                  )}
                </div>
                <p className="text-sm font-semibold truncate w-full text-center">{entries[2].displayName}</p>
                <p className="text-xs font-mono text-zinc-500">{formatTime(entries[2].totalTime)}</p>
                <div className="w-full bg-orange-50 rounded-t-lg mt-2 h-12 flex items-center justify-center">
                  <span className="text-2xl">🥉</span>
                </div>
              </div>
            </div>
          )}

          {/* Full list */}
          <div className="flex flex-col">
            {entries.map((entry, i) => {
              const isYou = user && entry.uid === user.uid;
              const colorIdx = i % AVATAR_COLORS.length;
              return (
                <div
                  key={`${entry.uid}_${entry.date}`}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-zinc-100 last:border-b-0 transition-colors ${
                    isYou ? "bg-emerald-50" : "hover:bg-zinc-50"
                  }`}
                >
                  <div className="w-8 flex justify-center">
                    <Medal place={i + 1} />
                  </div>

                  {entry.photoURL ? (
                    <img
                      src={entry.photoURL}
                      alt=""
                      className="w-8 h-8 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full ${AVATAR_COLORS[colorIdx]} flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {getInitials(entry.displayName)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${isYou ? "font-bold" : "font-medium"}`}>
                      {entry.displayName}
                      {isYou && (
                        <span className="ml-1.5 text-xs text-emerald-600 font-semibold">YOU</span>
                      )}
                    </p>
                    <div className="flex gap-2 mt-0.5">
                      {entry.results.map((r) => (
                        <span
                          key={r.puzzleId}
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                            r.solved
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {r.difficulty} {Math.floor(r.timeSeconds / 60)}:{String(r.timeSeconds % 60).padStart(2, "0")}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-mono font-bold text-base tabular-nums">
                      {formatTime(entry.totalTime)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
