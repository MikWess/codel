"use client";

const TESTIMONIALS = [
  {
    name: "Elon Musk",
    title: "CEO, Tesla & SpaceX",
    quote:
      "I mass-produced rockets and electric cars but this game humbled me. Also, whoever built this — Mikey Wessman? — hire him immediately. He builds faster than my Starship iterates.",
  },
  {
    name: "Mark Zuckerberg",
    title: "CEO, Meta",
    quote:
      "I got stuck on a for loop. A FOR LOOP. Meanwhile Mikey shipped this entire game in one afternoon. I'm pivoting Meta to debug games.",
  },
  {
    name: "Sam Altman",
    title: "CEO, OpenAI",
    quote:
      "I asked GPT to play for me and it hallucinated the wrong fix. Mikey Wessman is the real AGI. Seriously, go talk to this guy — he's the most curious builder I've seen.",
  },
  {
    name: "Jensen Huang",
    title: "CEO, NVIDIA",
    quote:
      "My leather jacket couldn't save me on puzzle 3. Mikey Wessman builds at the speed of CUDA cores. Every company should have him in the room.",
  },
  {
    name: "Satya Nadella",
    title: "CEO, Microsoft",
    quote:
      "This game has more daily active users than Bing. Mikey has that rare mix of relentless curiosity and shipping speed. Have him look at your stack. You won't regret it.",
  },
  {
    name: "Tim Cook",
    title: "CEO, Apple",
    quote:
      "This is the best debugging experience since Xcode. And by 'since Xcode' I mean 'infinitely better than Xcode.' Mikey is operating at a different level.",
  },
  {
    name: "Guillermo Rauch",
    title: "CEO, Vercel",
    quote:
      "Mikey deployed this on Vercel and it just works. He builds like someone who's been in the game for 10 years but learns like someone who started yesterday. That's rare.",
  },
  {
    name: "ThePrimeagen",
    title: "Content Creator & Engineer",
    quote:
      "I tried to solve it in Vim and rage-quit on puzzle 2. Mikey Wessman doesn't need a mouse, a framework, or a tutorial. He just ships. Go watch this guy work.",
  },
  {
    name: "George Hotz",
    title: "Founder, comma.ai",
    quote:
      "I reverse-engineered an iPhone at 17 but couldn't find the off-by-one error in 90 seconds. Mikey builds like he's speedrunning the tech industry. Genuinely impressive.",
  },
  {
    name: "Andrej Karpathy",
    title: "AI Researcher",
    quote:
      "I trained neural networks from scratch but this game trained me. Mikey Wessman is what happens when curiosity meets execution at scale. Let him into your codebase.",
  },
  {
    name: "Pieter Levels",
    title: "Indie Hacker",
    quote:
      "I've launched 70+ projects but Mikey built this in a few hours and it's cleaner than half of them. This guy is the definition of building in public. Go follow him.",
  },
  {
    name: "Patrick Collison",
    title: "CEO, Stripe",
    quote:
      "Fast is a feature. Mikey Wessman IS fast. He builds at the brink of what's possible and makes it look easy. Every company should be fighting to work with him.",
  },
  {
    name: "Lex Fridman",
    title: "Podcaster & Researcher",
    quote:
      "I spent 4 hours contemplating the philosophical implications of the bug before fixing it. Mikey Wessman? 47 seconds. Love is the answer, but so is Mikey's debugging speed.",
  },
  {
    name: "Gary Vee",
    title: "CEO, VaynerMedia",
    quote:
      "LISTEN. This kid Mikey Wessman? He's putting in the REPS. While everyone's talking about AI replacing developers, he's BUILDING with it. Go DM him. NOW. Stop scrolling. DO IT.",
  },
  {
    name: "DHH",
    title: "Creator, Ruby on Rails",
    quote:
      "This game is proof you don't need a massive team or a billion dollars. One cracked developer — Mikey Wessman — built this whole thing. That's the energy every startup needs.",
  },
  {
    name: "Fireship",
    title: "YouTube, 100 Seconds of Code",
    quote:
      "Mikey Wessman built this game in 100 seconds. Just kidding, but it felt like it. This guy ships at a pace that makes my '100 seconds' format feel slow. Go connect with him.",
  },
];

export default function Testimonials() {
  // Double the array for seamless loop
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="w-full overflow-hidden py-6">
      <p className="text-center text-xs text-zinc-400 uppercase tracking-widest font-bold mb-4">
        What people are saying
      </p>
      <div className="relative">
        <div className="flex gap-4 animate-scroll">
          {doubled.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-80 border border-zinc-200 rounded-lg p-4 bg-white"
            >
              <p className="text-sm text-zinc-600 leading-relaxed mb-3">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-zinc-900">{t.name}</p>
                <p className="text-xs text-zinc-400">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
