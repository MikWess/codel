import Anthropic from "@anthropic-ai/sdk";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

if (getApps().length === 0) {
  initializeApp({ projectId: "codel-e2440" });
}
const db = getFirestore();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `You are the puzzle assistant for Codel, a daily code debugging game.
You help the admin generate, tweak, or replace puzzles.

When asked to generate or edit puzzles, always respond with valid JSON in this format:
{
  "action": "save",
  "puzzles": [
    {
      "id": "easy-YYYYMMDD",
      "difficulty": "easy",
      "title": "Short title",
      "description": "What the code should do + that it has a bug.",
      "buggyCode": "the buggy JS code (must use console.log for output)",
      "expectedOutput": "exact output when fixed",
      "hint": "helpful hint",
      "timeTarget": 60
    },
    { medium puzzle, timeTarget: 90 },
    { hard puzzle, timeTarget: 90 }
  ]
}

If the user is just chatting or asking a question (not requesting puzzle changes), respond with:
{
  "action": "chat",
  "message": "your response here"
}

Rules for puzzles:
- Plain JavaScript only, no imports, no DOM, no TypeScript
- One bug per puzzle, 1-2 line fix max
- Difficulty 3/4/5 on a 1-10 scale for easy/medium/hard
- 5-15 lines of code each
- Always use console.log() for output
- Keep it fun, not frustrating`;

export async function POST(request: Request) {
  if (!ANTHROPIC_API_KEY) {
    return new Response("ANTHROPIC_API_KEY not configured", { status: 500 });
  }

  const { prompt, date, currentPuzzles } = await request.json();

  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  let userMessage = prompt;
  if (date) {
    userMessage += `\n\nTarget date: ${date} (use in IDs like easy-${date.replace(/-/g, "")})`;
  }
  if (currentPuzzles) {
    userMessage += `\n\nCurrent puzzles for this date:\n${JSON.stringify(currentPuzzles, null, 2)}`;
  }

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return Response.json({ action: "chat", message: text });
  }

  // If the model returned puzzles, save them as draft
  if (parsed.action === "save" && parsed.puzzles && date) {
    await db.collection("puzzles").doc(date).set({
      date,
      status: "draft",
      puzzles: parsed.puzzles,
      generatedAt: Timestamp.now(),
      approvedAt: null,
    });
    return Response.json({ action: "saved", puzzles: parsed.puzzles });
  }

  return Response.json(parsed);
}
