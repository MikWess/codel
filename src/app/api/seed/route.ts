import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

if (getApps().length === 0) {
  initializeApp({ projectId: "codel-e2440" });
}
const db = getFirestore();

const FAKE_PLAYERS = [
  { name: "Elon Musk", time: 87 },
  { name: "Mark Zuckerberg", time: 102 },
  { name: "Sam Altman", time: 118 },
  { name: "Jensen Huang", time: 135 },
  { name: "Sundar Pichai", time: 142 },
  { name: "Satya Nadella", time: 156 },
  { name: "Tim Cook", time: 168 },
  { name: "Dario Amodei", time: 179 },
  { name: "Patrick Collison", time: 195 },
  { name: "Guillermo Rauch", time: 210 },
  { name: "ThePrimeagen", time: 224 },
  { name: "Fireship", time: 238 },
  { name: "George Hotz", time: 255 },
  { name: "DHH", time: 271 },
  { name: "Pieter Levels", time: 290 },
  { name: "Andrej Karpathy", time: 312 },
  { name: "Lex Fridman", time: 340 },
  { name: "Gary Vee", time: 365 },
  { name: "Jake Paul", time: 398 },
  { name: "Your Mom", time: 445 },
];

export async function POST() {
  const today = new Date().toISOString().split("T")[0];
  const batch = db.batch();

  for (const player of FAKE_PLAYERS) {
    const uid = `fake_${player.name.replace(/\s/g, "_").toLowerCase()}`;
    const docId = `${uid}_${today}`;

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
