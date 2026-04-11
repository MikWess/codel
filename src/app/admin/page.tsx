"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ADMIN_EMAIL } from "@/lib/firebase";
import {
  getAllPuzzleSets, approvePuzzleSet, savePuzzleSet, PuzzleSet,
  getLeaderboardByDate, updateGameTime, deleteGameEntry, addFakePlayer,
  GameRecord,
} from "@/lib/db";

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [puzzleSets, setPuzzleSets] = useState<PuzzleSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Leaderboard state
  const [lbDate, setLbDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [lbEntries, setLbEntries] = useState<(GameRecord & { _docId: string })[]>([]);
  const [lbLoading, setLbLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTime, setEditTime] = useState("");
  const [newName, setNewName] = useState("");
  const [newTime, setNewTime] = useState("");

  // Puzzle editor state
  const [editorPuzzles, setEditorPuzzles] = useState<Record<string, unknown>[] | null>(null);
  const [editorDate, setEditorDate] = useState<string | null>(null);

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const isAdmin = user?.email === ADMIN_EMAIL;

  const puzzleMap = useMemo(() => {
    const map: Record<string, PuzzleSet> = {};
    for (const s of puzzleSets) map[s.date] = s;
    return map;
  }, [puzzleSets]);

  const { firstDay, daysInMonth } = useMemo(
    () => getMonthDays(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const todayStr = now.toISOString().split("T")[0];
  const selectedSet = selectedDate ? puzzleMap[selectedDate] : null;

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

  async function handleGenerate(date: string) {
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-puzzles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      if (!res.ok) {
        const err = await res.text();
        alert(`Generation failed: ${err}`);
      } else {
        const data = await res.json();
        if (data.parseError) {
          alert(`Claude returned unparseable response. Raw text:\n\n${data.raw}`);
        } else {
          // Open in editor instead of saving directly
          setEditorPuzzles(data.puzzles);
          setEditorDate(date);
        }
      }
    } catch (e) {
      alert(`Error: ${e}`);
    }
    setGenerating(false);
  }

  function updateEditorPuzzle(index: number, field: string, value: string) {
    if (!editorPuzzles) return;
    const updated = [...editorPuzzles];
    updated[index] = { ...updated[index], [field]: field === "timeTarget" ? parseInt(value) || 0 : value };
    setEditorPuzzles(updated);
  }

  async function handleSaveEditor() {
    if (!editorPuzzles || !editorDate) return;
    await savePuzzleSet(editorDate, editorPuzzles as never, "draft");
    setEditorPuzzles(null);
    setEditorDate(null);
    await loadPuzzles();
  }

  function handleEditExisting() {
    if (!selectedSet || !selectedDate) return;
    setEditorPuzzles(selectedSet.puzzles as unknown as Record<string, unknown>[]);
    setEditorDate(selectedDate);
  }

  async function handleApprove(date: string) {
    await approvePuzzleSet(date);
    await loadPuzzles();
  }

  async function loadLeaderboard() {
    setLbLoading(true);
    const entries = await getLeaderboardByDate(lbDate) as (GameRecord & { _docId: string })[];
    setLbEntries(entries);
    setLbLoading(false);
  }

  async function handleUpdateTime(docId: string) {
    const seconds = parseInt(editTime);
    if (isNaN(seconds) || seconds < 0) return;
    await updateGameTime(docId, seconds);
    setEditingId(null);
    setEditTime("");
    await loadLeaderboard();
  }

  async function handleDeleteEntry(docId: string) {
    await deleteGameEntry(docId);
    await loadLeaderboard();
  }

  async function handleAddPlayer() {
    if (!newName.trim() || !newTime.trim()) return;
    const seconds = parseInt(newTime);
    if (isNaN(seconds) || seconds < 0) return;
    await addFakePlayer(newName.trim(), seconds, lbDate);
    setNewName("");
    setNewTime("");
    await loadLeaderboard();
  }

  async function handleChat() {
    if (!chatInput.trim() || !selectedDate) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatLoading(true);

    try {
      const currentPuzzles = puzzleMap[selectedDate]?.puzzles ?? null;
      const res = await fetch("/api/admin-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg, date: selectedDate, currentPuzzles }),
      });
      const data = await res.json();

      if (data.action === "save" && data.puzzles) {
        await savePuzzleSet(selectedDate, data.puzzles, "draft");
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Done! Puzzles saved as draft. Review them above." },
        ]);
        await loadPuzzles();
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.message || "Puzzles updated." },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong." },
      ]);
    }
    setChatLoading(false);
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  if (!authLoading && (!user || !isAdmin)) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8 text-center">
        <p className="text-zinc-500">Access denied.</p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Puzzle Manager</h2>

      <div className="flex gap-8">
        {/* Calendar */}
        <div className="flex-1">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-zinc-100 rounded-md transition-colors text-zinc-600"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-zinc-100 rounded-md transition-colors text-zinc-600"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-zinc-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatDate(viewYear, viewMonth, day);
              const set = puzzleMap[dateStr];
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;

              let statusColor = "bg-white";
              let dotColor = "";
              if (set?.status === "approved") {
                statusColor = "bg-green-50";
                dotColor = "bg-green-500";
              } else if (set?.status === "draft") {
                statusColor = "bg-amber-50";
                dotColor = "bg-amber-400";
              }

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`
                    relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all
                    ${statusColor}
                    ${isSelected ? "ring-2 ring-zinc-900" : "hover:bg-zinc-50"}
                    ${isToday ? "font-bold" : ""}
                    border ${set ? (set.status === "approved" ? "border-green-200" : "border-amber-200") : "border-zinc-100"}
                  `}
                >
                  <span className={isToday ? "text-zinc-900" : "text-zinc-600"}>
                    {day}
                  </span>
                  {dotColor && (
                    <div className={`w-1.5 h-1.5 rounded-full ${dotColor} mt-0.5`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-4 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              Approved
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              Draft
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
              Empty
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <div className="w-[480px] shrink-0 flex flex-col gap-4">
          {/* Puzzle Editor */}
          {editorPuzzles && editorDate ? (
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Editing — {editorDate}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEditor}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 text-sm font-semibold"
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={() => { setEditorPuzzles(null); setEditorDate(null); }}
                    className="px-4 py-2 border border-zinc-300 text-zinc-600 rounded-md hover:bg-zinc-100 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              {editorPuzzles.map((p, i) => (
                <div key={i} className="mb-5 last:mb-0 border border-zinc-200 rounded-lg p-3 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold uppercase ${
                      (p.difficulty as string) === "easy" ? "text-green-600"
                        : (p.difficulty as string) === "medium" ? "text-amber-600"
                        : "text-red-600"
                    }`}>
                      {p.difficulty as string}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-0.5">Title</label>
                      <input
                        value={(p.title as string) || ""}
                        onChange={(e) => updateEditorPuzzle(i, "title", e.target.value)}
                        className="w-full border border-zinc-300 rounded px-2 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-0.5">Description</label>
                      <input
                        value={(p.description as string) || ""}
                        onChange={(e) => updateEditorPuzzle(i, "description", e.target.value)}
                        className="w-full border border-zinc-300 rounded px-2 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-0.5">Buggy Code</label>
                      <textarea
                        value={(p.buggyCode as string) || ""}
                        onChange={(e) => updateEditorPuzzle(i, "buggyCode", e.target.value)}
                        rows={6}
                        className="w-full border border-zinc-300 rounded px-2 py-1.5 text-xs font-mono resize-y"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-zinc-400 block mb-0.5">Expected Output</label>
                        <input
                          value={(p.expectedOutput as string) || ""}
                          onChange={(e) => updateEditorPuzzle(i, "expectedOutput", e.target.value)}
                          className="w-full border border-zinc-300 rounded px-2 py-1.5 text-sm font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 block mb-0.5">Time Target (s)</label>
                        <input
                          value={String((p.timeTarget as number) || "")}
                          onChange={(e) => updateEditorPuzzle(i, "timeTarget", e.target.value)}
                          className="w-full border border-zinc-300 rounded px-2 py-1.5 text-sm font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-0.5">Hint</label>
                      <input
                        value={(p.hint as string) || ""}
                        onChange={(e) => updateEditorPuzzle(i, "hint", e.target.value)}
                        className="w-full border border-zinc-300 rounded px-2 py-1.5 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !selectedDate ? (
            <div className="border border-zinc-200 border-dashed rounded-lg p-8 text-center text-zinc-400">
              <p>Select a date to view or generate puzzles</p>
            </div>
          ) : loading ? (
            <p className="text-zinc-400">Loading...</p>
          ) : (
            <>
              {selectedSet ? (
                <div className="border border-zinc-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedDate}</h3>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${
                          selectedSet.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {selectedSet.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleEditExisting}
                        className="px-3 py-1.5 border border-zinc-300 text-zinc-600 rounded-md hover:bg-zinc-100 text-sm"
                      >
                        Edit
                      </button>
                      {selectedSet.status === "draft" && (
                        <button
                          onClick={() => handleApprove(selectedDate)}
                          className="px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors text-sm font-semibold"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {selectedSet.puzzles.map((p) => (
                      <div key={p.id}>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-xs font-bold uppercase ${
                              p.difficulty === "easy"
                                ? "text-green-600"
                                : p.difficulty === "medium"
                                  ? "text-amber-600"
                                  : "text-red-600"
                            }`}
                          >
                            {p.difficulty}
                          </span>
                          <span className="font-medium text-sm">{p.title}</span>
                        </div>
                        <p className="text-xs text-zinc-500 mb-1">{p.description}</p>
                        <pre className="text-xs bg-zinc-50 border border-zinc-200 rounded p-2 overflow-x-auto max-h-40">
                          {p.buggyCode}
                        </pre>
                        <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                          <span>Expected: <code className="bg-zinc-100 px-1 rounded">{p.expectedOutput}</code></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border border-zinc-200 rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2">{selectedDate}</h3>
                  <p className="text-zinc-400 text-sm mb-4">No puzzles for this date yet.</p>
                  <button
                    onClick={() => handleGenerate(selectedDate)}
                    disabled={generating}
                    className="px-5 py-2.5 bg-zinc-900 text-white rounded-md hover:bg-zinc-700 disabled:bg-zinc-300 transition-colors text-sm font-semibold"
                  >
                    {generating ? "Generating..." : "Generate with Claude"}
                  </button>
                </div>
              )}

              {/* Chat with Haiku */}
              <div className="border border-zinc-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400" />
                  Puzzle Assistant
                  <span className="text-xs font-normal text-zinc-400">(Haiku)</span>
                </h4>

                {chatMessages.length > 0 && (
                  <div className="flex flex-col gap-2 mb-3 max-h-48 overflow-y-auto">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`text-xs px-3 py-2 rounded-lg ${
                          msg.role === "user"
                            ? "bg-zinc-100 text-zinc-700 self-end ml-8"
                            : "bg-violet-50 text-violet-800 self-start mr-8"
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="text-xs text-violet-400 px-3 py-2">Thinking...</div>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleChat()}
                    placeholder="e.g. &quot;make the easy one about strings&quot;"
                    className="flex-1 border border-zinc-300 rounded-md px-3 py-2 text-sm focus:border-violet-400 focus:outline-none"
                  />
                  <button
                    onClick={handleChat}
                    disabled={chatLoading || !chatInput.trim()}
                    className="px-3 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-500 disabled:bg-zinc-300 transition-colors text-sm"
                  >
                    Send
                  </button>
                </div>
                <p className="text-xs text-zinc-300 mt-2">
                  Ask to generate, tweak, or replace puzzles for {selectedDate}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Leaderboard Manager */}
      <div className="border-t border-zinc-200 mt-8 pt-8">
        <h3 className="text-xl font-bold mb-4">Leaderboard Manager</h3>

        <div className="flex gap-3 items-end mb-4">
          <div>
            <label className="text-sm text-zinc-500 block mb-1">Date</label>
            <input
              type="date"
              value={lbDate}
              onChange={(e) => setLbDate(e.target.value)}
              className="border border-zinc-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={loadLeaderboard}
            disabled={lbLoading}
            className="px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-700 text-sm font-semibold"
          >
            {lbLoading ? "Loading..." : "Load"}
          </button>
        </div>

        {/* Add new player */}
        <div className="flex gap-2 mb-4">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name"
            className="border border-zinc-300 rounded-md px-3 py-2 text-sm w-48"
          />
          <input
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            placeholder="Time (seconds)"
            className="border border-zinc-300 rounded-md px-3 py-2 text-sm w-32"
          />
          <button
            onClick={handleAddPlayer}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 text-sm font-semibold"
          >
            Add Player
          </button>
        </div>

        {/* Entries */}
        {lbEntries.length > 0 && (
          <div className="flex flex-col gap-1">
            {lbEntries.map((entry, i) => {
              const mins = Math.floor(entry.totalTime / 60);
              const secs = entry.totalTime % 60;
              const isEditing = editingId === entry._docId;
              return (
                <div
                  key={entry._docId}
                  className="flex items-center gap-3 px-3 py-2 border border-zinc-100 rounded-md text-sm hover:bg-zinc-50"
                >
                  <span className="text-zinc-400 w-6 text-right font-mono">{i + 1}</span>
                  <span className="flex-1 font-medium">{entry.displayName}</span>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="border border-zinc-300 rounded px-2 py-1 text-xs w-20 font-mono"
                        placeholder="seconds"
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && handleUpdateTime(entry._docId)}
                      />
                      <button
                        onClick={() => handleUpdateTime(entry._docId)}
                        className="text-xs text-emerald-600 font-semibold hover:text-emerald-800"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs text-zinc-400 hover:text-zinc-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-mono text-zinc-600">
                        {mins}:{String(secs).padStart(2, "0")}
                      </span>
                      <span className="text-xs text-zinc-400">({entry.totalTime}s)</span>
                      <button
                        onClick={() => {
                          setEditingId(entry._docId);
                          setEditTime(String(entry.totalTime));
                        }}
                        className="text-xs text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry._docId)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
