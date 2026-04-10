import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

if (getApps().length === 0) {
  initializeApp({ projectId: "codel-e2440" });
}
const db = getFirestore();

const FAKE_PLAYERS = [
  { name: "Alex Chen", time: 87 },
  { name: "Jordan Hayes", time: 102 },
  { name: "Sam Rivera", time: 118 },
  { name: "Morgan Blake", time: 135 },
  { name: "Taylor Swift", time: 142 },
  { name: "Casey Kim", time: 156 },
  { name: "Riley Patel", time: 168 },
  { name: "Quinn Murphy", time: 179 },
  { name: "Avery Brooks", time: 195 },
  { name: "Jamie Torres", time: 210 },
  { name: "Drew Wilson", time: 224 },
  { name: "Skyler Grant", time: 238 },
  { name: "Reese Cooper", time: 255 },
  { name: "Dakota Lee", time: 271 },
  { name: "Finley Ross", time: 290 },
  { name: "Harper Davis", time: 312 },
  { name: "Sage Miller", time: 340 },
  { name: "Emery Clark", time: 365 },
  { name: "Rowan Nash", time: 398 },
  { name: "Phoenix Hall", time: 445 },
];

export async function POST() {
  const today = new Date().toISOString().split("T")[0];
  const batch = db.batch();

  for (const player of FAKE_PLAYERS) {
    const uid = `fake_${player.name.replace(/\s/g, "_").toLowerCase()}`;
    const docId = `${uid}_${today}`;

    // Distribute time across 3 puzzles roughly 25/35/40 split
    const easy = Math.round(player.time * 0.25);
    const medium = Math.round(player.time * 0.35);
    const hard = player.time - easy - medium;

    batch.set(db.collection("games").doc(docId), {
      uid,
      displayName: player.name,
      photoURL: "",
      date: today,
      results: [
        { puzzleId: "easy-001", difficulty: "easy", timeSeconds: easy, solved: true },
        { puzzleId: "medium-001", difficulty: "medium", timeSeconds: medium, solved: true },
        { puzzleId: "hard-001", difficulty: "hard", timeSeconds: hard, solved: true },
      ],
      totalTime: player.time,
      completedAt: Timestamp.now(),
    });
  }

  await batch.commit();
  return Response.json({ success: true, count: FAKE_PLAYERS.length });
}
