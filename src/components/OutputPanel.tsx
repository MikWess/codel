"use client";

interface OutputPanelProps {
  output: string | null;
  expected: string;
  isCorrect: boolean | null;
}

export default function OutputPanel({ output, expected, isCorrect }: OutputPanelProps) {
  if (output === null) {
    return (
      <div className="rounded-md p-4 border border-zinc-200 bg-zinc-50">
        <p className="text-zinc-400 font-mono text-sm">
          Output will appear here after you run...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-md p-4 border font-mono text-sm ${
        isCorrect
          ? "bg-green-50 border-green-300 text-green-800"
          : "bg-red-50 border-red-300 text-red-800"
      }`}
    >
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-60">
        {isCorrect ? "Correct!" : "Your output"}
      </div>
      <pre className="whitespace-pre-wrap">{output}</pre>
      {!isCorrect && (
        <>
          <div className="mt-3 mb-1 text-xs font-semibold uppercase tracking-wider opacity-60">
            Expected
          </div>
          <pre className="whitespace-pre-wrap opacity-70">{expected}</pre>
        </>
      )}
    </div>
  );
}
