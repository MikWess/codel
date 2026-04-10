import { Puzzle } from "./types";

// Daily puzzles keyed by date string (YYYY-MM-DD)
// For now, hardcoded. Later these come from the database.
const puzzlesByDate: Record<string, Puzzle[]> = {
  // Default puzzle set — used as fallback
  default: [
    {
      id: "easy-001",
      difficulty: "easy",
      title: "Double the Numbers",
      description:
        "This function should double every number in an array. It's returning the original numbers instead.",
      buggyCode: `function doubleAll(numbers) {
  for (let i = 0; i < numbers.length; i++) {
    numbers[i] * 2;
  }
  return numbers;
}

console.log(doubleAll([1, 2, 3, 4]).join(", "));`,
      expectedOutput: "2, 4, 6, 8",
      hint: "Multiplying a value doesn't automatically save the result.",
      timeTarget: 60,
    },
    {
      id: "medium-001",
      difficulty: "medium",
      title: "Reverse a String",
      description:
        "This function should reverse a string, but it's missing the last character every time.",
      buggyCode: `function reverseString(str) {
  let reversed = "";
  for (let i = str.length - 1; i > 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

console.log(reverseString("hello"));`,
      expectedOutput: "olleh",
      hint: "Check the loop condition — does it visit every index?",
      timeTarget: 90,
    },
    {
      id: "hard-001",
      difficulty: "hard",
      title: "Count Vowels",
      description:
        "This function should count the total vowels in a string. It's only counting some of them.",
      buggyCode: `function countVowels(str) {
  const vowels = "aeiou";
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (vowels.includes(str[i])) {
      count++;
      break;
    }
  }
  return count;
}

console.log(countVowels("javascript is awesome"));`,
      expectedOutput: "8",
      hint: "What happens after the first vowel is found?",
      timeTarget: 90,
    },
  ],
};

export function getTodaysPuzzles(): Puzzle[] {
  const today = new Date().toISOString().split("T")[0];
  return puzzlesByDate[today] ?? puzzlesByDate["default"];
}
