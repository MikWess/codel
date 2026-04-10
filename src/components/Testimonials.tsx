"use client";

const TESTIMONIALS = [
  {
    name: "Elon Musk",
    title: "CEO, Tesla & SpaceX",
    initials: "EM",
    color: "from-blue-50 to-cyan-50 border-blue-100",
    initialsColor: "bg-blue-600",
    quote: "Mikey builds faster than Starship iterates. Hire him.",
  },
  {
    name: "Mark Zuckerberg",
    title: "CEO, Meta",
    initials: "MZ",
    color: "from-indigo-50 to-blue-50 border-indigo-100",
    initialsColor: "bg-indigo-600",
    quote: "I got stuck on a for loop. Mikey shipped this whole game in an afternoon.",
  },
  {
    name: "Sam Altman",
    title: "CEO, OpenAI",
    initials: "SA",
    color: "from-emerald-50 to-teal-50 border-emerald-100",
    initialsColor: "bg-emerald-600",
    quote: "GPT hallucinated the wrong fix. Mikey IS the real AGI.",
  },
  {
    name: "Jensen Huang",
    title: "CEO, NVIDIA",
    initials: "JH",
    color: "from-lime-50 to-green-50 border-lime-100",
    initialsColor: "bg-green-700",
    quote: "My leather jacket couldn't save me on puzzle 3. Mikey builds at CUDA speed.",
  },
  {
    name: "Satya Nadella",
    title: "CEO, Microsoft",
    initials: "SN",
    color: "from-sky-50 to-blue-50 border-sky-100",
    initialsColor: "bg-sky-600",
    quote: "This game has more DAUs than Bing. Have Mikey look at your stack.",
  },
  {
    name: "Tim Cook",
    title: "CEO, Apple",
    initials: "TC",
    color: "from-zinc-50 to-slate-50 border-zinc-200",
    initialsColor: "bg-zinc-700",
    quote: "Better debugging experience than Xcode. Infinitely better.",
  },
  {
    name: "Guillermo Rauch",
    title: "CEO, Vercel",
    initials: "GR",
    color: "from-violet-50 to-purple-50 border-violet-100",
    initialsColor: "bg-violet-600",
    quote: "Builds like a 10-year vet. Learns like day one. That's rare.",
  },
  {
    name: "ThePrimeagen",
    title: "Content Creator",
    initials: "TP",
    color: "from-orange-50 to-amber-50 border-orange-100",
    initialsColor: "bg-orange-600",
    quote: "Tried to solve it in Vim. Rage-quit. Mikey just ships.",
  },
  {
    name: "George Hotz",
    title: "Founder, comma.ai",
    initials: "GH",
    color: "from-red-50 to-rose-50 border-red-100",
    initialsColor: "bg-red-600",
    quote: "Hacked the iPhone at 17. Couldn't find the off-by-one in 90 seconds.",
  },
  {
    name: "Andrej Karpathy",
    title: "AI Researcher",
    initials: "AK",
    color: "from-fuchsia-50 to-pink-50 border-fuchsia-100",
    initialsColor: "bg-fuchsia-600",
    quote: "Curiosity meets execution. Let Mikey into your codebase.",
  },
  {
    name: "Pieter Levels",
    title: "Indie Hacker",
    initials: "PL",
    color: "from-cyan-50 to-teal-50 border-cyan-100",
    initialsColor: "bg-cyan-600",
    quote: "70+ projects. Mikey's is cleaner than half of them. Go follow him.",
  },
  {
    name: "Patrick Collison",
    title: "CEO, Stripe",
    initials: "PC",
    color: "from-purple-50 to-indigo-50 border-purple-100",
    initialsColor: "bg-purple-600",
    quote: "Fast is a feature. Mikey Wessman IS fast.",
  },
  {
    name: "Lex Fridman",
    title: "Podcaster",
    initials: "LF",
    color: "from-slate-50 to-zinc-50 border-slate-200",
    initialsColor: "bg-slate-700",
    quote: "I contemplated the bug for 4 hours. Mikey? 47 seconds. Love.",
  },
  {
    name: "Gary Vee",
    title: "CEO, VaynerMedia",
    initials: "GV",
    color: "from-yellow-50 to-amber-50 border-yellow-100",
    initialsColor: "bg-yellow-600",
    quote: "This kid is putting in the REPS. Go DM him. NOW.",
  },
  {
    name: "DHH",
    title: "Creator, Rails",
    initials: "DH",
    color: "from-rose-50 to-red-50 border-rose-100",
    initialsColor: "bg-rose-600",
    quote: "One dev. No team. No billion dollars. Just Mikey and a keyboard.",
  },
  {
    name: "Fireship",
    title: "YouTube",
    initials: "FS",
    color: "from-amber-50 to-orange-50 border-amber-100",
    initialsColor: "bg-amber-600",
    quote: "Built this in 100 seconds. Okay fine, a bit more. But not much.",
  },
];

export default function Testimonials() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="w-full overflow-hidden pt-16 pb-2">
      <p className="text-center text-xs text-zinc-400 uppercase tracking-widest font-semibold mb-5">
        What the internet is saying
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 animate-scroll">
          {doubled.map((t, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-72 rounded-xl p-4 border bg-gradient-to-br ${t.color}`}
            >
              <p className="text-sm text-zinc-600 leading-snug mb-3">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-full ${t.initialsColor} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-800">{t.name}</p>
                  <p className="text-xs text-zinc-400">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
