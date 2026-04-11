"use client";

const TESTIMONIALS = [
  {
    name: "Elon Musk",
    handle: "@elonmusk",
    initials: "EM",
    color: "bg-blue-600",
    quote: "Mikey builds faster than Starship iterates. Hire him.",
  },
  {
    name: "Mark Zuckerberg",
    handle: "@faborig",
    initials: "MZ",
    color: "bg-indigo-600",
    quote: "I got stuck on a for loop. Mikey shipped this whole game in an afternoon.",
  },
  {
    name: "Sam Altman",
    handle: "@sama",
    initials: "SA",
    color: "bg-emerald-600",
    quote: "GPT hallucinated the wrong fix. Mikey IS the real AGI.",
  },
  {
    name: "Jensen Huang",
    handle: "@nvidia",
    initials: "JH",
    color: "bg-green-700",
    quote: "My leather jacket couldn't save me on puzzle 3. Mikey builds at CUDA speed.",
  },
  {
    name: "Satya Nadella",
    handle: "@satloyal",
    initials: "SN",
    color: "bg-sky-600",
    quote: "This game has more DAUs than Bing. Have Mikey look at your stack.",
  },
  {
    name: "Tim Cook",
    handle: "@tim_cook",
    initials: "TC",
    color: "bg-zinc-700",
    quote: "Better debugging experience than Xcode. Infinitely better.",
  },
  {
    name: "Guillermo Rauch",
    handle: "@raaborig",
    initials: "GR",
    color: "bg-violet-600",
    quote: "Builds like a 10-year vet. Learns like day one. That's rare.",
  },
  {
    name: "ThePrimeagen",
    handle: "@ThePrimeagen",
    initials: "TP",
    color: "bg-orange-600",
    quote: "Tried to solve it in Vim. Rage-quit. Mikey just ships.",
  },
  {
    name: "George Hotz",
    handle: "@realGeorgeHotz",
    initials: "GH",
    color: "bg-red-600",
    quote: "Hacked the iPhone at 17. Couldn't find the off-by-one in 90 seconds.",
  },
  {
    name: "Andrej Karpathy",
    handle: "@karpathy",
    initials: "AK",
    color: "bg-fuchsia-600",
    quote: "Curiosity meets execution. Let Mikey into your codebase.",
  },
  {
    name: "Pieter Levels",
    handle: "@levelsio",
    initials: "PL",
    color: "bg-cyan-600",
    quote: "70+ projects. Mikey's is cleaner than half of them. Go follow him.",
  },
  {
    name: "Patrick Collison",
    handle: "@patrickc",
    initials: "PC",
    color: "bg-purple-600",
    quote: "Fast is a feature. Mikey Wessman IS fast.",
  },
  {
    name: "Lex Fridman",
    handle: "@lexfridman",
    initials: "LF",
    color: "bg-slate-700",
    quote: "I contemplated the bug for 4 hours. Mikey? 47 seconds. Love.",
  },
  {
    name: "Gary Vee",
    handle: "@garyvee",
    initials: "GV",
    color: "bg-yellow-600",
    quote: "This kid is putting in the REPS. Go DM him. NOW.",
  },
  {
    name: "DHH",
    handle: "@dhh",
    initials: "DH",
    color: "bg-rose-600",
    quote: "One dev. No team. No billion dollars. Just Mikey and a keyboard.",
  },
  {
    name: "Fireship",
    handle: "@fireship_dev",
    initials: "FS",
    color: "bg-amber-600",
    quote: "Built this in 100 seconds. Okay fine, a bit more. But not much.",
  },
];

function XLogo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-300">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Testimonials() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="w-full overflow-hidden pt-16 pb-2">
      <p className="text-center text-xs text-zinc-400 uppercase tracking-widest font-semibold mb-6">
        What the internet is saying
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 animate-scroll">
          {doubled.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-72 rounded-xl p-4 bg-white border border-zinc-200 hover:border-zinc-300 transition-colors"
            >
              {/* Header row — avatar, name, handle, X logo */}
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                  >
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-zinc-900 leading-tight truncate">
                      {t.name}
                    </p>
                    <p className="text-xs text-zinc-400 leading-tight">{t.handle}</p>
                  </div>
                </div>
                <XLogo />
              </div>

              {/* Tweet body */}
              <p className="text-[13px] text-zinc-700 leading-snug">
                {t.quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
