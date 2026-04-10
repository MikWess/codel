export type Difficulty = "easy" | "medium" | "hard";

export interface Puzzle {
  id: string;
  difficulty: Difficulty;
  title: string;
  description: string;
  buggyCode: string;
  expectedOutput: string;
  hint: string;
  timeTarget: number; // seconds — the par time for this difficulty
}

export interface PuzzleResult {
  puzzleId: string;
  difficulty: Difficulty;
  timeSeconds: number;
  solved: boolean;
}

export interface GameState {
  currentStage: number; // 0, 1, 2
  puzzles: Puzzle[];
  results: PuzzleResult[];
  startTime: number | null;
  stageStartTime: number | null;
  finished: boolean;
}
