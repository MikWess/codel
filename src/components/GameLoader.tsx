"use client";

import { useEffect, useState } from "react";
import { Puzzle } from "@/lib/types";
import { getTodaysPuzzlesFromDB } from "@/lib/db";
import { getTodaysPuzzles } from "@/lib/puzzles";
import Game from "./Game";

export default function GameLoader() {
  const [puzzles, setPuzzles] = useState<Puzzle[] | null>(null);

  useEffect(() => {
    getTodaysPuzzlesFromDB().then((dbPuzzles) => {
      setPuzzles(dbPuzzles ?? getTodaysPuzzles());
    });
  }, []);

  if (!puzzles) {
    return <div className="text-center py-16 text-zinc-400">Loading puzzles...</div>;
  }

  return <Game puzzles={puzzles} />;
}
