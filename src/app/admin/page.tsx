"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ADMIN_EMAIL } from "@/lib/firebase";
import { getAllPuzzleSets, approvePuzzleSet, PuzzleSet } from "@/lib/db";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [puzzleSets, setPuzzleSets] = useState<PuzzleSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [targetDate, setTargetDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (authLoading || !isAdmin) {
      setLoading(false);
      return;
    }
    loadPuzzles();
  }, [isAdmin, authLoading]);

  async function loadPuzzles() {
    setLoading(true);
    const sets = await getAllPuzzleSets();
    setPuzzleSets(sets);
    setLoading(false);
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-puzzles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: targetDate }),
      });
      if (!res.ok) {
        const err = await res.text();
        alert(`Generation failed: ${err}`);
      } else {
        await loadPuzzles();
      }
    } catch (e) {
      alert(`Error: ${e}`);
    }
    setGenerating(false);
  }

  async function handleApprove(date: string) {
    await approvePuzzleSet(date);
    await loadPuzzles();
  }

  if (!authLoading && (!user || !isAdmin)) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-zinc-500">Access denied.</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Admin — Puzzle Manager</h2>

      {/* Generate */}
      <div className="border border-zinc-200 rounded-md p-4 mb-8">
        <h3 className="font-semibold mb-3">Generate New Puzzles</h3>
        <div className="flex gap-3 items-end">
          <div>
            <label className="text-sm text-zinc-500 block mb-1">Date</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="border border-zinc-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-5 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-700 disabled:bg-zinc-300 transition-colors text-sm font-semibold"
          >
            {generating ? "Generating..." : "Generate with Claude"}
          </button>
        </div>
      </div>

      {/* Puzzle sets */}
      {loading ? (
        <p className="text-zinc-400">Loading...</p>
      ) : puzzleSets.length === 0 ? (
        <p className="text-zinc-400">No puzzle sets yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {puzzleSets.map((set) => (
            <div
              key={set.date}
              className="border border-zinc-200 rounded-md p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{set.date}</span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      set.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {set.status}
                  </span>
                </div>
                {set.status === "draft" && (
                  <button
                    onClick={() => handleApprove(set.date)}
                    className="text-sm px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors font-semibold"
                  >
                    Approve
                  </button>
                )}
              </div>
              {set.puzzles.map((p) => (
                <div key={p.id} className="mb-3 last:mb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase text-zinc-400">
                      {p.difficulty}
                    </span>
                    <span className="font-medium text-sm">{p.title}</span>
                  </div>
                  <pre className="text-xs bg-zinc-50 border border-zinc-200 rounded p-2 overflow-x-auto">
                    {p.buggyCode}
                  </pre>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
