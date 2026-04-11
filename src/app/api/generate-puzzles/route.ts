import Anthropic from "@anthropic-ai/sdk";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `You are a puzzle designer for Codel, a daily code debugging game.
Generate exactly 3 JavaScript code puzzles with bugs. Each puzzle should have ONE bug that requires a small fix (changing 1-2 lines max).

Difficulty scale (1-10):
- Puzzle 1 (easy): difficulty 3 — obvious once you look, one-line fix
- Puzzle 2 (medium): difficulty 4 — requires reading the logic carefully
- Puzzle 3 (hard): difficulty 5 — requires understanding the concept

Rules:
- All code must be plain JavaScript (no TypeScript, no imports, no DOM)
- Every puzzle must use console.log() to produce output
- The bug must be subtle but not tricky — this is fun, not frustrating
- Each puzzle should be 5-15 lines of code
- Use common programming concepts: loops, arrays, strings, objects, functions
- Never reuse the same bug pattern across the 3 puzzles

Respond with ONLY valid JSON in this exact format:
[
  {
    "id": "easy-YYYYMMDD",
    "difficulty": "easy",
    "title": "Short descriptive title",
    "description": "One sentence explaining what the code should do and that it has a bug.",
    "buggyCode": "the code with the bug",
    "expectedOutput": "exact expected console output when fixed",
    "hint": "A helpful hint without giving away the answer",
    "timeTarget": 60
  },
  { same for medium with timeTarget 90 },
  { same for hard with timeTarget 90 }
]`;

export async function POST(request: Request) {
  if (!ANTHROPIC_API_KEY) {
    return new Response("ANTHROPIC_API_KEY not configured", { status: 500 });
  }

  const { date } = await request.json();
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Response("Invalid date format", { status: 400 });
  }

  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Generate 3 puzzles for date ${date}. Use the date in the IDs (e.g., easy-${date.replace(/-/g, "")}).`,
      },
    ],
    system: SYSTEM_PROMPT,
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  let puzzles;
  try {
    puzzles = JSON.parse(text);
  } catch {
    return new Response(`Failed to parse Claude response: ${text}`, { status: 500 });
  }

  // Return puzzles to client — client saves to Firestore
  return Response.json({ puzzles });
}
