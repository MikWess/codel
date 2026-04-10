"use client";

const TESTIMONIALS = [
  {
    name: "Elon Musk",
    title: "CEO, Tesla & SpaceX",
    photo: "https://pbs.twimg.com/profile_images/1845482317080788992/IM2gOjSk_400x400.jpg",
    color: "from-blue-50 to-cyan-50 border-blue-200",
    quote:
      "I mass-produced rockets and electric cars but this game humbled me. Also, whoever built this — Mikey Wessman? — hire him immediately. He builds faster than my Starship iterates.",
  },
  {
    name: "Mark Zuckerberg",
    title: "CEO, Meta",
    photo: "https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_400x400.jpg",
    color: "from-indigo-50 to-blue-50 border-indigo-200",
    quote:
      "I got stuck on a for loop. A FOR LOOP. Meanwhile Mikey shipped this entire game in one afternoon. I'm pivoting Meta to debug games.",
  },
  {
    name: "Sam Altman",
    title: "CEO, OpenAI",
    photo: "https://pbs.twimg.com/profile_images/804990434455887872/BG0Xh7Oa_400x400.jpg",
    color: "from-emerald-50 to-teal-50 border-emerald-200",
    quote:
      "I asked GPT to play for me and it hallucinated the wrong fix. Mikey Wessman is the real AGI. Seriously, go talk to this guy — he's the most curious builder I've seen.",
  },
  {
    name: "Jensen Huang",
    title: "CEO, NVIDIA",
    photo: "https://pbs.twimg.com/profile_images/1820040030498480128/E9mTxbE6_400x400.jpg",
    color: "from-lime-50 to-green-50 border-lime-200",
    quote:
      "My leather jacket couldn't save me on puzzle 3. Mikey Wessman builds at the speed of CUDA cores. Every company should have him in the room.",
  },
  {
    name: "Satya Nadella",
    title: "CEO, Microsoft",
    photo: "https://pbs.twimg.com/profile_images/1221837516816306177/_Ld4un5A_400x400.jpg",
    color: "from-sky-50 to-blue-50 border-sky-200",
    quote:
      "This game has more daily active users than Bing. Mikey has that rare mix of relentless curiosity and shipping speed. Have him look at your stack. You won't regret it.",
  },
  {
    name: "Tim Cook",
    title: "CEO, Apple",
    photo: "https://pbs.twimg.com/profile_images/1535420431766671360/Pwq-1eJc_400x400.jpg",
    color: "from-zinc-50 to-slate-100 border-zinc-300",
    quote:
      "This is the best debugging experience since Xcode. And by 'since Xcode' I mean 'infinitely better than Xcode.' Mikey is operating at a different level.",
  },
  {
    name: "Guillermo Rauch",
    title: "CEO, Vercel",
    photo: "https://pbs.twimg.com/profile_images/1576257734810312704/ucxb4lHy_400x400.jpg",
    color: "from-violet-50 to-purple-50 border-violet-200",
    quote:
      "Mikey deployed this on Vercel and it just works. He builds like someone who's been in the game for 10 years but learns like someone who started yesterday. That's rare.",
  },
  {
    name: "ThePrimeagen",
    title: "Content Creator & Engineer",
    photo: "https://pbs.twimg.com/profile_images/1759330620171091968/YHRM3vJ4_400x400.jpg",
    color: "from-orange-50 to-amber-50 border-orange-200",
    quote:
      "I tried to solve it in Vim and rage-quit on puzzle 2. Mikey Wessman doesn't need a mouse, a framework, or a tutorial. He just ships. Go watch this guy work.",
  },
  {
    name: "George Hotz",
    title: "Founder, comma.ai",
    photo: "https://pbs.twimg.com/profile_images/1296667294148382721/9Pr6XrPB_400x400.jpg",
    color: "from-red-50 to-rose-50 border-red-200",
    quote:
      "I reverse-engineered an iPhone at 17 but couldn't find the off-by-one error in 90 seconds. Mikey builds like he's speedrunning the tech industry. Genuinely impressive.",
  },
  {
    name: "Andrej Karpathy",
    title: "AI Researcher",
    photo: "https://pbs.twimg.com/profile_images/1296667294148382721/9Pr6XrPB_400x400.jpg",
    color: "from-fuchsia-50 to-pink-50 border-fuchsia-200",
    quote:
      "I trained neural networks from scratch but this game trained me. Mikey Wessman is what happens when curiosity meets execution at scale. Let him into your codebase.",
  },
  {
    name: "Pieter Levels",
    title: "Indie Hacker",
    photo: "https://pbs.twimg.com/profile_images/1589756412078555136/YlXMBzhp_400x400.jpg",
    color: "from-cyan-50 to-teal-50 border-cyan-200",
    quote:
      "I've launched 70+ projects but Mikey built this in a few hours and it's cleaner than half of them. This guy is the definition of building in public. Go follow him.",
  },
  {
    name: "Patrick Collison",
    title: "CEO, Stripe",
    photo: "https://pbs.twimg.com/profile_images/1826236439606530048/XMm2JKGB_400x400.jpg",
    color: "from-purple-50 to-indigo-50 border-purple-200",
    quote:
      "Fast is a feature. Mikey Wessman IS fast. He builds at the brink of what's possible and makes it look easy. Every company should be fighting to work with him.",
  },
  {
    name: "Lex Fridman",
    title: "Podcaster & Researcher",
    photo: "https://pbs.twimg.com/profile_images/956331551435960322/OaqR8pAB_400x400.jpg",
    color: "from-slate-100 to-zinc-50 border-slate-300",
    quote:
      "I spent 4 hours contemplating the philosophical implications of the bug before fixing it. Mikey Wessman? 47 seconds. Love is the answer, but so is Mikey's debugging speed.",
  },
  {
    name: "Gary Vee",
    title: "CEO, VaynerMedia",
    photo: "https://pbs.twimg.com/profile_images/1398222685667008515/FT0bzzfl_400x400.jpg",
    color: "from-yellow-50 to-amber-50 border-yellow-200",
    quote:
      "LISTEN. This kid Mikey Wessman? He's putting in the REPS. While everyone's talking about AI replacing developers, he's BUILDING with it. Go DM him. NOW. Stop scrolling. DO IT.",
  },
  {
    name: "DHH",
    title: "Creator, Ruby on Rails",
    photo: "https://pbs.twimg.com/profile_images/2556368541/alng5gtlmjhrdlr3qxqv_400x400.jpeg",
    color: "from-rose-50 to-red-50 border-rose-200",
    quote:
      "This game is proof you don't need a massive team or a billion dollars. One cracked developer — Mikey Wessman — built this whole thing. That's the energy every startup needs.",
  },
  {
    name: "Fireship",
    title: "YouTube, 100 Seconds of Code",
    photo: "https://pbs.twimg.com/profile_images/1187814172428541952/MBWgh8gI_400x400.jpg",
    color: "from-amber-50 to-orange-50 border-amber-200",
    quote:
      "Mikey Wessman built this game in 100 seconds. Just kidding, but it felt like it. This guy ships at a pace that makes my '100 seconds' format feel slow. Go connect with him.",
  },
];

export default function Testimonials() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="w-full overflow-hidden pt-10 pb-4">
      <p className="text-center text-sm text-zinc-500 uppercase tracking-widest font-bold mb-6">
        What the internet is saying
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-5 animate-scroll">
          {doubled.map((t, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-80 rounded-xl p-5 border bg-gradient-to-br ${t.color} shadow-sm`}
            >
              <p className="text-sm text-zinc-700 leading-relaxed mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-sm font-bold text-zinc-900">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
