"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  startTime: number | null;
  stopped: boolean;
  finalTime?: number;
}

export default function Timer({ startTime, stopped, finalTime }: TimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime || stopped) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 100);
    return () => clearInterval(interval);
  }, [startTime, stopped]);

  const displayTime = stopped && finalTime != null ? finalTime : elapsed;
  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;

  return (
    <div className="font-mono text-2xl tabular-nums text-zinc-900">
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
}
