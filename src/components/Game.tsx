"use client";

import { useState, useCallback, useEffect } from "react";
import { Puzzle, PuzzleResult, Difficulty } from "@/lib/types";
import { runCode } from "@/lib/runner";
import { saveGameResult, hasPlayedToday } from "@/lib/db";
import { useAuth } from "./AuthProvider";
import CodeEditor from "./CodeEditor";
import Timer from "./Timer";
import OutputPanel from "./OutputPanel";
import ResultsScreen from "./ResultsScreen";
import LobbyScreen from "./LobbyScreen";

interface GameProps {
  puzzles: Puzzle[];
}

const difficultyLabel: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export default function Game({ puzzles }: GameProps) {
  const { user } = useAuth();
  const [started, setStarted] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [code, setCode] = useState(puzzles[0]?.buggyCode ?? "");
  const [output, setOutput] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [running, setRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stageStartTime, setStageStartTime] = useState<number | null>(null);
  const [results, setResults] = useState<PuzzleResult[]>([]);
  const [finished, setFinished] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      setChecking(false);
      setAlreadyPlayed(false);
      return;
    }
    hasPlayedToday(user.uid)
      .then((played) => {
        setAlreadyPlayed(played);
        setChecking(false);
      })
      .catch(() => {
        setChecking(false);
      });
  }, [user]);

  const puzzle = puzzles[currentStage];

  const handleStart = useCallback(() => {
    const now = Date.now();
    setStartTime(now);
    setStageStartTime(now);
    setStarted(true);
  }, []);

  const handleRun = useCallback(async () => {
    if (!puzzle || running || !stageStartTime) return;
    setRunning(true);
    setOutput(null);
    setIsCorrect(null);

    const result = await runCode(code);
    const trimmedOutput = result.output.trim();
    const correct = result.success && trimmedOutput === puzzle.expectedOutput.trim();

    setOutput(trimmedOutput);
    setIsCorrect(correct);
    setRunning(false);

    if (correct) {
      const stageTime = Math.floor((Date.now() - stageStartTime) / 1000);
      const newResult: PuzzleResult = {
        puzzleId: puzzle.id,
        difficulty: puzzle.difficulty,
        timeSeconds: stageTime,
        solved: true,
      };

      const newResults = [...results, newResult];
      setResults(newResults);

      if (currentStage < puzzles.length - 1) {
        setTimeout(() => {
          const nextStage = currentStage + 1;
          setCurrentStage(nextStage);
          setCode(puzzles[nextStage].buggyCode);
          setOutput(null);
          setIsCorrect(null);
          setShowHint(false);
          setStageStartTime(Date.now());
        }, 1500);
      } else {
        const total = Math.floor((Date.now() - startTime!) / 1000);
        setTotalTime(total);

        // Save to Firestore — signed in or guest
        const today = new Date().toISOString().split("T")[0];
        const guestId = `guest_${Math.random().toString(36).slice(2, 10)}`;
        saveGameResult(
          user?.uid ?? guestId,
          user?.displayName ?? "Guest",
          user?.photoURL ?? "",
          today,
          newResults,
          total
        ).catch(() => {});

        setTimeout(() => {
          setFinished(true);
        }, 1500);
      }
    }
  }, [puzzle, running, code, stageStartTime, results, currentStage, puzzles, startTime, user]);

  if (checking) {
    return <div className="text-center py-16 text-zinc-400">Loading...</div>;
  }

  if (alreadyPlayed) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-2">Already played today!</h2>
        <p className="text-zinc-500">Come back tomorrow for new puzzles.</p>
      </div>
    );
  }

  if (!started) {
    return <LobbyScreen onStart={handleStart} />;
  }

  if (!puzzle) return null;

  if (finished) {
    return <ResultsScreen results={results} totalTime={totalTime} />;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              {difficultyLabel[puzzle.difficulty]}
            </span>
            <span className="text-zinc-400 text-sm">
              {currentStage + 1} / {puzzles.length}
            </span>
          </div>
          <h2 className="text-xl font-semibold mt-1">{puzzle.title}</h2>
        </div>
        <Timer startTime={startTime} stopped={finished} />
      </div>

      {/* Description */}
      <p className="text-zinc-600">{puzzle.description}</p>

      {/* Stage progress dots */}
      <div className="flex gap-2">
        {puzzles.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < currentStage
                ? "bg-green-500"
                : i === currentStage
                  ? "bg-zinc-400"
                  : "bg-zinc-200"
            }`}
          />
        ))}
      </div>

      {/* Editor */}
      <CodeEditor code={code} onChange={setCode} disabled={running || isCorrect === true} />

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleRun}
          disabled={running || isCorrect === true}
          className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-700 disabled:bg-zinc-300 disabled:text-zinc-500 text-white font-semibold rounded-md transition-colors"
        >
          {running ? "Running..." : "Run Code"}
        </button>
        <button
          onClick={() => {
            setCode(puzzle.buggyCode);
            setOutput(null);
            setIsCorrect(null);
          }}
          disabled={running || isCorrect === true}
          className="px-5 py-2.5 border border-zinc-300 hover:border-zinc-400 text-zinc-600 rounded-md transition-colors disabled:opacity-50"
        >
          Reset
        </button>
        <button
          onClick={() => setShowHint(!showHint)}
          className="px-5 py-2.5 text-zinc-400 hover:text-zinc-600 transition-colors ml-auto"
        >
          {showHint ? "Hide Hint" : "Hint"}
        </button>
      </div>

      {/* Hint */}
      {showHint && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm">
          {puzzle.hint}
        </div>
      )}

      {/* Output */}
      <OutputPanel output={output} expected={puzzle.expectedOutput} isCorrect={isCorrect} />
    </div>
  );
}
