"use client";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

export default function CodeEditor({ code, onChange, disabled }: CodeEditorProps) {
  return (
    <textarea
      value={code}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      spellCheck={false}
      className="w-full h-72 bg-zinc-50 text-zinc-900 font-mono text-sm p-4 rounded-md border border-zinc-300 focus:border-zinc-900 focus:outline-none resize-none disabled:opacity-50"
    />
  );
}
