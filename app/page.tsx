"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Slide = {
  src: string;
  alt: string;
  label?: string;
  caption?: string;
  fit?: "contain" | "cover";
  scale?: number;
};

type Quote = {
  text: string;
  author: string;
};

type FAQ = {
  q: string;
  a: string;
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [origin, setOrigin] = useState<"Europe" | "US" | "Other" | "">("");

  // ✅ DYNAMIC COUNTER LOGIC
  const [displayCount, setDisplayCount] = useState(142); 
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayCount(prev => prev + Math.floor(Math.random() * 2));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const contactEmail = "info@tripfind.net";
  const instagramUrl = "https://www.instagram.com/tripfind.app?igsh=ZWUwaDQ2d2RhbWlw";

  const quotes: Quote[] = useMemo(
    () => [
      { text: "I found a weekend trip in 3 minutes that actually matched my budget.", author: "— Beta user" },
      { text: "The Tap-to-Plan feature is crazy. This should already exist.", author: "— Early tester" },
      { text: "Finally a travel app that feels like scrolling — but ends with a real plan.", author: "— Waitlist member" },
      { text: "I hate tab-hopping. This makes planning feel effortless.", author: "— Early tester" },
    ],
    []
  );

  const [quoteIndex, setQuoteIndex] = useState(0);

  const slides: Slide[] = useMemo(
    () => [
      { src: "/preview-1.jpg", alt: "TripFind preview", caption: "Discover", fit: "contain", scale: 1.1 },
      { src: "/preview-2.png", alt: "TripFind preview", caption: "Tap Plan", fit: "contain", scale: 1.1 },
      { src: "/preview-5.jpg", alt: "TripFind preview", caption: "Trip Ready", fit: "contain", scale: 1.1 },
      { src: "/preview-3.jpg", alt: "TripFind preview", caption: "Compare & Book", fit: "contain", scale: 1.1 },
    ],
    []
  );

  const faqs: FAQ[] = useMemo(
    () => [
      { q: "When does TripFind launch?", a: "We’re rolling out access in waves. Join the beta to get early access first." },
      { q: "Which countries are supported first?", a: "We’ll start with popular routes and expand quickly based on demand." },
      { q: "Is TripFind free?", a: "Yes — the core experience is free. Premium adds extra features and perks." },
      { q: "How does personalization work?", a: "We learn from your vibe, budget, and time to tailor trips that fit you." },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [animDir, setAnimDir] = useState<"next" | "prev">("next");
  const [isPaused, setIsPaused] = useState(false);
  const [slideAnimKey, setSlideAnimKey] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const FRAME_HEIGHT_PX = 560;
  const year = useMemo(() => new Date().getFullYear(), []);
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null);

  function next() {
    setAnimDir("next");
    setIndex((prev) => (prev + 1) % slides.length);
    setSlideAnimKey((prev) => prev + 1);
  }

  function prev() {
    setAnimDir("prev");
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setSlideAnimKey((prev) => prev + 1);
  }

  function goTo(i: number) {
    setAnimDir(i > index ? "next" : "prev");
    setIndex(i);
    setSlideAnimKey((prev) => prev + 1);
  }

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = window.setInterval(next, 4200);
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
  }, [isPaused, slides.length]);

  useEffect(() => {
    const t = window.setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5200);
    return () => window.clearInterval(t);
  }, [quotes.length]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, origin }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setMessage("You're on the list! Watch your inbox. ✈️");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Signup failed. Please try again.");
    }
  }

  const active = slides[index];

  return (
    <main className={`${font.className} min-h-screen bg-white text-black pb-24 sm:pb-0`}>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-200 via-emerald-200 to-indigo-200 blur-3xl opacity-70" />
      </div>

      <header className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="TripFind logo" className="h-10 w-auto" />
            <div className="leading-tight">
              <div className="font-semibold tracking-tight">TripFind</div>
              <div className="text-xs text-gray-500">Smarter travel discovery</div>
            </div>
          </div>
          <a href="#signup" className="rounded-2xl border border-black bg-white/70 px-4 py-2 text-sm hover:bg-white">Get early access</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">✨ 100% Personalized</span>
              <span className="rounded-full border bg-white/70 px-3 py-1 text-xs font-medium">⚡ Tap-to-Plan™️</span>
            </div>

            <h1 className="mt-6 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl leading-[1.1]">
              The travel app that <span className="text-blue-600">actually</span> knows your vibe.
            </h1>

            <p className="mt-4 max-w-xl text-lg text-gray-600">
              <span className="block font-medium text-gray-900">Stop scrolling generic "Top 10" lists.</span>
              <span>Get a complete itinerary built around <b>your</b> personal style, <b>your</b> budget, and <b>your</b> vibe.</span>
            </p>

            {/* Social Proof */}
            <div className="mt-6 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-2 text-sm text-emerald-900">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold">{displayCount.toLocaleString()} travelers joined the Beta this week</span>
              </div>
            </div>

            <form id="signup" onSubmit={onSubmit} className="mt-6 max-w-xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email for Beta access"
                  className="w-full rounded-2xl border bg-white/90 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                  {status === "loading" ? "Securing spot..." : "Get Beta Access"}
                </button>
              </div>

              <div className="mt-4">
                <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2">Customize my experience: I&apos;m traveling from</label>
                <div className="flex flex-wrap gap-2">
                  {(["Europe", "US", "Other"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setOrigin(opt)}
                      className={`rounded-xl border px-4 py-1.5 text-xs transition-all ${origin === opt ? "bg-black text-white border-black scale-105" : "bg-white/70 text-gray-600 border-gray-200"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                <p className="text-sm font-bold text-amber-900">🎁 Early Bird Reward</p>
                <p className="text-xs text-amber-800 mt-1">Join today to lock in <b>1 month of Premium free</b> and priority onboarding.</p>
              </div>
            </form>
            {message && <p className={`mt-3 text-sm ${status === "success" ? "text-emerald-700" : "text-red-600"}`}>{message}</p>}
          </div>

          {/* Preview Section */}
          <div className="lg:pt-2">
            <div className="mx-auto w-full max-w-md rounded-3xl border bg-white/70 p-5 shadow-sm backdrop-blur" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Product preview</div>
                  <div className="text-xs text-gray-500">👆 Swipe through the flow</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={prev} className="rounded-2xl border bg-white px-4 py-2 text-sm">←</button>
                  <button onClick={next} className="rounded-2xl border bg-white px-4 py-2 text-sm">→</button>
                </div>
              </div>
              <div className="relative rounded-2xl border bg-white p-2">
                <div className="relative overflow-hidden rounded-xl bg-gray-50 w-full" style={{ height: FRAME_HEIGHT_PX }}>
                  <img
                    key={active.src}
                    src={active.src}
                    alt={active.alt}
                    className={`absolute inset-0 h-full w-full object-contain ${animDir === "next" ? "animate-slideInFromRight" : "animate-slideInFromLeft"}`}
                    style={{ transform: "scale(1.1)" }}
                  />
                  <div key={slideAnimKey} className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-md text-sm animate-fadeSlideIn">
                    Plan your trip in 3 taps.
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    {slides.map((_, i) => (
                      <button key={i} onClick={() => goTo(i)} className={`h-2.5 rounded-full border transition-all ${i === index ? "bg-black w-7" : "bg-white w-2.5"}`} />
                    ))}
                  </div>
                  <div className="text-xs font-semibold text-gray-900">{active.caption}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <h2 className="text-2xl font-semibold">Why TripFind?</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border bg-white/70 p-6 shadow-sm"><div className="text-xl">⚡</div><div className="font-semibold mt-2">Faster Discovery</div><p className="text-sm text-gray-600 mt-2">Find trips you’d actually take in minutes.</p></div>
          <div className="rounded-3xl border bg-white/70 p-6 shadow-sm"><div className="text-xl">🎯</div><div className="font-semibold mt-2">Better Matches</div><p className="text-sm text-gray-600 mt-2">Personalized to your budget and vibe.</p></div>
          <div className="rounded-3xl border bg-white/70 p-6 shadow-sm"><div className="text-xl">🔥</div><div className="font-semibold mt-2">Tap-to-Plan</div><p className="text-sm text-gray-600 mt-2">Turn any inspiration into a full itinerary.</p></div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl border bg-white/70 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border bg-white p-4">
                <summary className="cursor-pointer list-none font-semibold flex justify-between">
                  {f.q} <span className="group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-sm text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t bg-gray-50/50">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="h-8 w-auto" alt="Logo" />
            <span className="text-sm text-gray-500">© {year} TripFind. Built for travelers.</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#signup" className="hover:text-black">Privacy</a>
            <a href={instagramUrl} target="_blank" className="hover:text-black">Instagram</a>
            <a href={`mailto:${contactEmail}`} className="hover:text-black">Contact</a>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeSlideIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fadeSlideIn { animation: fadeSlideIn 0.5s ease-out; }
        @keyframes slideInFromRight { 0% { opacity: 0; transform: translateX(20px) scale(1.1); } 100% { opacity: 1; transform: translateX(0) scale(1.1); } }
        @keyframes slideInFromLeft { 0% { opacity: 0; transform: translateX(-20px) scale(1.1); } 100% { opacity: 1; transform: translateX(0) scale(1.1); } }
        .animate-slideInFromRight { animation: slideInFromRight 0.5s ease-out; }
        .animate-slideInFromLeft { animation: slideInFromLeft 0.5s ease-out; }
        html { scroll-behavior: smooth; }
      `}</style>
    </main>
  );
}
