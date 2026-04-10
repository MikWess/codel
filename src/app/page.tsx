import { getTodaysPuzzles } from "@/lib/puzzles";
import Game from "@/components/Game";

export default function Home() {
  const puzzles = getTodaysPuzzles();

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Header bar */}
      <header className="border-b border-zinc-200">
        <div className="max-w-2xl mx-auto px-4 py-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight uppercase">
            Codel
          </h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            Find the bug. Fix the code. Beat the clock.
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <Game puzzles={puzzles} />
      </main>
    </div>
  );
}
