import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Puzzle, PuzzleResult } from "./types";

// ── Puzzles ──

export interface PuzzleSet {
  date: string;
  status: "draft" | "approved";
  puzzles: Puzzle[];
  generatedAt: Timestamp;
  approvedAt: Timestamp | null;
}

export async function getTodaysPuzzlesFromDB(): Promise<Puzzle[] | null> {
  const today = new Date().toISOString().split("T")[0];
  const docRef = doc(db, "puzzles", today);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  const data = snap.data() as PuzzleSet;
  if (data.status !== "approved") return null;
  return data.puzzles;
}

export async function savePuzzleSet(
  date: string,
  puzzles: Puzzle[],
  status: "draft" | "approved" = "draft"
) {
  await setDoc(doc(db, "puzzles", date), {
    date,
    status,
    puzzles,
    generatedAt: Timestamp.now(),
    approvedAt: status === "approved" ? Timestamp.now() : null,
  });
}

export async function approvePuzzleSet(date: string) {
  const docRef = doc(db, "puzzles", date);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return;
  await setDoc(docRef, { ...snap.data(), status: "approved", approvedAt: Timestamp.now() });
}

export async function getDraftPuzzles(): Promise<PuzzleSet[]> {
  const q = query(collection(db, "puzzles"), where("status", "==", "draft"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as PuzzleSet);
}

export async function getAllPuzzleSets(): Promise<PuzzleSet[]> {
  const q = query(collection(db, "puzzles"), orderBy("date", "desc"), limit(30));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as PuzzleSet);
}

// ── Games (user results) ──

export interface GameRecord {
  uid: string;
  displayName: string;
  photoURL: string;
  date: string;
  results: PuzzleResult[];
  totalTime: number;
  completedAt: Timestamp;
}

export async function saveGameResult(
  uid: string,
  displayName: string,
  photoURL: string,
  date: string,
  results: PuzzleResult[],
  totalTime: number
) {
  const docId = `${uid}_${date}`;
  await setDoc(doc(db, "games", docId), {
    uid,
    displayName,
    photoURL,
    date,
    results,
    totalTime,
    completedAt: Timestamp.now(),
  });
}

export async function getUserGames(uid: string): Promise<GameRecord[]> {
  const q = query(
    collection(db, "games"),
    where("uid", "==", uid),
    orderBy("date", "desc"),
    limit(30)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as GameRecord);
}

export async function hasPlayedToday(uid: string): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0];
  const docRef = doc(db, "games", `${uid}_${today}`);
  const snap = await getDoc(docRef);
  return snap.exists();
}

// ── Leaderboard ──

export async function getTodaysLeaderboard(): Promise<GameRecord[]> {
  const today = new Date().toISOString().split("T")[0];
  return getLeaderboardByDate(today);
}

export async function getLeaderboardByDate(date: string): Promise<GameRecord[]> {
  const q = query(
    collection(db, "games"),
    where("date", "==", date),
    orderBy("totalTime", "asc"),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...d.data(), _docId: d.id }) as GameRecord & { _docId: string });
}

export async function updateGameTime(docId: string, totalTime: number) {
  const docRef = doc(db, "games", docId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return;
  const data = snap.data();
  // Redistribute time across puzzles roughly
  const easy = Math.round(totalTime * 0.25);
  const medium = Math.round(totalTime * 0.35);
  const hard = totalTime - easy - medium;
  const results = (data.results || []).map((r: Record<string, unknown>, i: number) => ({
    ...r,
    timeSeconds: i === 0 ? easy : i === 1 ? medium : hard,
  }));
  await setDoc(docRef, { ...data, totalTime, results });
}

export async function deleteGameEntry(docId: string) {
  await deleteDoc(doc(db, "games", docId));
}

export async function addFakePlayer(name: string, totalTime: number, date: string) {
  const uid = `fake_${name.replace(/\s/g, "_").toLowerCase()}_${Date.now()}`;
  const docId = `${uid}_${date}`;
  const easy = Math.round(totalTime * 0.25);
  const medium = Math.round(totalTime * 0.35);
  const hard = totalTime - easy - medium;
  await setDoc(doc(db, "games", docId), {
    uid,
    displayName: name,
    photoURL: "",
    date,
    results: [
      { puzzleId: "easy-001", difficulty: "easy", timeSeconds: easy, solved: true },
      { puzzleId: "medium-001", difficulty: "medium", timeSeconds: medium, solved: true },
      { puzzleId: "hard-001", difficulty: "hard", timeSeconds: hard, solved: true },
    ],
    totalTime,
    completedAt: Timestamp.now(),
  });
}
