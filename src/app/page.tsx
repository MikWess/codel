import GameLoader from "@/components/GameLoader";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <p className="text-center text-zinc-500 text-sm mb-6">
        Find the bug. Fix the code. Beat the clock.
      </p>
      <GameLoader />
    </main>
  );
}
