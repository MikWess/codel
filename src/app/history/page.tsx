"use client";

import { useEffect, useState } from "react";
import { getUserGames, GameRecord } from "@/lib/db";
import { useAuth } from "@/components/AuthProvider";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    getUserGames(user.uid).then((data) => {
      setGames(data);
      setLoading(false);
    });
  }, [user, authLoading]);

  if (!authLoading && !user) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-zinc-500">Sign in to see your game history.</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Your History</h2>

      {loading ? (
        <p className="text-zinc-400">Loading...</p>
      ) : games.length === 0 ? (
        <p className="text-zinc-400">No games played yet. Go play today's puzzle!</p>
      ) : (
        <div className="flex flex-col gap-2">
          {games.map((game) => (
            <div
              key={`${game.uid}_${game.date}`}
              className="flex items-center justify-between px-4 py-3 border border-zinc-200 rounded-md"
            >
              <span className="text-zinc-600">{game.date}</span>
              <div className="flex items-center gap-4">
                {game.results.map((r) => (
                  <span
                    key={r.puzzleId}
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      r.solved
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.difficulty}
                  </span>
                ))}
                <span className="font-mono font-semibold">
                  {formatTime(game.totalTime)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
