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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Origin is now optional to prevent funnel friction
  const [origin, setOrigin] = useState<"Europe" | "US" | "Other" | "">("");

  const contactEmail = "info@tripfind.net";
  const instagramUrl = "https://www.instagram.com/tripfind.app?igsh=ZWUwaDQ2d2RhbWlw";

  const WAITLIST_COUNT = 512;

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

  // Slides updated: 5 is 3rd, 3 is 4th
  const slides: Slide[] = useMemo(
    () => [
      { src: "/preview-1.jpg", alt: "TripFind preview - discover", caption: "Discover", fit: "contain", scale: 1.1 },
      { src: "/preview-2.png", alt: "TripFind preview - tap to plan", caption: "Tap Plan", fit: "contain", scale: 1.1 },
      { src: "/preview-5.jpg", alt: "TripFind preview - compare", caption: "Smart Comparison", fit: "contain", scale: 1.1 },
      { src: "/preview-3.jpg", alt: "TripFind preview - trip ready", caption: "Compare & Book", fit: "contain", scale: 1.1 },
    ],
    []
  );

  const faqs: FAQ[] = useMemo(
    () => [
      { q: "When does TripFind launch?", a: "We’re rolling out access in waves. Join the waitlist to get early access first." },
      { q: "Which countries are supported first?", a: "We’ll start with the most popular routes and expand quickly based on demand." },
      { q: "Is TripFind free?", a: "Yes — the core experience is free. Premium adds extra features and perks." },
      { q: "Do you book flights and hotels directly?", a: "TripFind helps you compare and plan. Booking flows depend on partner availability." },
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

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = window.setInterval(next, 4200);
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
  }, [isPaused, slides.length]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, origin: origin || "Unspecified" }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error || "Signup failed.");
        return;
      }

      setStatus("success");
      setMessage("You're on the waitlist! 🎉 Check your inbox soon.");
      setEmail("");
      setOrigin("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  function focusSignup() {
    const el = document.getElementById("signup-email");
    if (el) (el as HTMLInputElement).focus();
    const section = document.getElementById("signup");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const active = slides[index];
  const scale = Math.max(active.scale ?? 1.0, 1.12);

  return (
    <main className={`${font.className} min-h-screen bg-white text-black pb-24 sm:pb-0`}>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-200 via-emerald-200 to-indigo-200 blur-3xl opacity-70" />
        <div className="absolute bottom-[-9rem] right-[-9rem] h-72 w-72 rounded-full bg-gradient-to-tr from-amber-200 via-rose-200 to-purple-200 blur-3xl opacity-70" />
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
          <a href="#signup" className="rounded-2xl border border-black bg-white/70 px-4 py-2 text-sm font-medium hover:bg-black hover:text-white transition-all">
            Get early access
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border bg-white/70 px-3 py-1 text-xs">✨ Personalized</span>
              <span className="rounded-full border bg-white/70 px-3 py-1 text-xs font-medium">⚡ Tap-to-Plan™️</span>
            </div>

            <h1 className="mt-6 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
              Plan trips you’ll actually love — in seconds.
            </h1>

            <p className="mt-4 max-w-xl text-lg text-gray-600">
              Discover travel inspiration and turn it into a complete plan instantly. No more tab-hopping.
            </p>

            <form id="signup" onSubmit={onSubmit} className="mt-8 max-w-xl rounded-3xl border border-black/5 bg-white/40 p-1 backdrop-blur-sm sm:p-2">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border-none bg-white px-5 py-4 text-lg outline-none shadow-sm focus:ring-2 focus:ring-black/5"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-2xl bg-black px-8 py-4 text-white hover:scale-[1.02] active:scale-[0.98] transition-all font-bold whitespace-nowrap shadow-xl"
                >
                  {status === "loading" ? "Joining..." : "Get 1 Month Free"}
                </button>
              </div>
              
              <div className="mt-4 px-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Optional: Where are you traveling from?
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["Europe", "US", "Other"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setOrigin(opt)}
                      className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                        origin === opt ? "bg-black text-white border-black" : "bg-white/50 text-gray-600 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {message && (
                <p className={`mt-4 px-2 text-sm font-bold ${status === "success" ? "text-emerald-600" : "text-red-500"}`}>
                  {message}
                </p>
              )}
            </form>

            <div className="mt-6 flex items-center gap-3 px-2">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-gray-200" />)}
              </div>
              <p className="text-sm font-medium text-gray-500">
                Join <span className="text-black font-bold">{WAITLIST_COUNT.toLocaleString()}</span> travelers already on the list
              </p>
            </div>
          </div>

          <div className="lg:pt-2">
            <div className="mx-auto w-full max-w-md rounded-[2.5rem] border bg-white/70 p-4 shadow-2xl backdrop-blur">
               {/* Product Preview Internal Container */}
               <div className="relative overflow-hidden rounded-[2rem] border bg-white p-1">
                <div 
                  className="relative overflow-hidden rounded-[1.8rem] bg-gray-50 w-full touch-pan-y"
                  style={{ height: FRAME_HEIGHT_PX }}
                  onPointerDown={(e) => { pointerDownRef.current = { x: e.clientX, y: e.clientY } }}
                  onPointerUp={(e) => {
                    if (!pointerDownRef.current) return;
                    const dx = e.clientX - pointerDownRef.current.x;
                    pointerDownRef.current = null;
                    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
                  }}
                >
                  <img
                    key={active.src}
                    src={active.src}
                    alt={active.alt}
                    draggable={false}
                    className={`absolute inset-0 h-full w-full object-contain will-change-transform ${
                      animDir === "next" ? "animate-slideInFromRight" : "animate-slideInFromLeft"
                    }`}
                    style={{ transform: `scale(${scale})` }}
                  />

                  <div key={slideAnimKey} className="absolute bottom-6 left-4 right-4 bg-black/80 backdrop-blur-md text-white px-5 py-3 rounded-2xl text-sm font-medium animate-fadeSlideIn border border-white/10">
                    {active.caption}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between px-4 pb-2">
                  <div className="flex gap-1.5">
                    {slides.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all ${i === index ? "bg-black w-6" : "bg-gray-200 w-1.5"}`} />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={prev} className="rounded-full border p-2 hover:bg-gray-50">←</button>
                    <button onClick={next} className="rounded-full border p-2 hover:bg-gray-50">→</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-2">
          {quotes.map((q, i) => (
            <div key={i} className="rounded-3xl border bg-white/50 p-6 backdrop-blur-sm">
              <p className="text-lg font-medium italic text-gray-800">"{q.text}"</p>
              <p className="mt-3 text-sm font-bold text-gray-400 uppercase tracking-widest">{q.author}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t bg-gray-50/50 py-12">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="TripFind" className="h-8 w-auto" />
            <span className="font-bold">© {year} TripFind</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
            <a href={instagramUrl} target="_blank" className="hover:text-black">Instagram</a>
            <a href={`mailto:${contactEmail}`} className="hover:text-black">Contact</a>
          </div>
        </div>
      </footer>

      {/* Mobile Floating Button */}
      <div className="fixed bottom-6 left-6 right-6 z-50 sm:hidden">
        <button onClick={focusSignup} className="w-full rounded-2xl bg-black py-5 text-base font-bold text-white shadow-2xl animate-bounce-subtle">
          Reserve My Free Month — Join Waitlist
        </button>
      </div>

      <style jsx global>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(30px) scale(${scale}); }
          to { opacity: 1; transform: translateX(0) scale(${scale}); }
        }
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-30px) scale(${scale}); }
          to { opacity: 1; transform: translateX(0) scale(${scale}); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-fadeSlideIn { animation: fadeSlideIn 0.5s ease-out forwards; }
        .animate-slideInFromRight { animation: slideInFromRight 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slideInFromLeft { animation: slideInFromLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-bounce-subtle { animation: bounce-subtle 3s infinite ease-in-out; }
        html { scroll-behavior: smooth; }
      `}</style>
    </main>
  );
}
