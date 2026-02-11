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

  // ✅ Micro-step: Origin selection
  const [origin, setOrigin] = useState<"Europe" | "US" | "Other" | "">("");

  useEffect(() => {
    if (!origin) return;

    const input = document.getElementById("signup-email");
    if (!input) return;

    // Trigger highlight animation when origin is selected
    input.classList.remove("highlight-email");
    void input.offsetWidth; // Force reflow
    input.classList.add("highlight-email");
  }, [origin]);

  const contactEmail = "info@tripfind.net";
  const instagramUrl = "https://www.instagram.com/tripfind.app?igsh=ZWUwaDQ2d2RhbWlw";

  const WAITLIST_COUNT = 512;

  const quotes: Quote[] = useMemo(
    () => [
      {
        text: "I found a weekend trip in 3 minutes that actually matched my budget.",
        author: "— Beta user",
      },
      {
        text: "The Tap-to-Plan feature is crazy. This should already exist.",
        author: "— Early tester",
      },
      {
        text: "Finally a travel app that feels like scrolling — but ends with a real plan.",
        author: "— Waitlist member",
      },
      {
        text: "I hate tab-hopping. This makes planning feel effortless.",
        author: "— Early tester",
      },
    ],
    []
  );

  const [quoteIndex, setQuoteIndex] = useState(0);

  // ✅ Slide 5 inserted as 3rd, Slide 3 moved to 4th
  const slides: Slide[] = useMemo(
    () => [
      {
        src: "/preview-1.jpg",
        alt: "TripFind preview - discover",
        label: "Discover",
        caption: "Discover",
        fit: "contain",
        scale: 1.1,
      },
      {
        src: "/preview-2.png",
        alt: "TripFind preview - tap to plan",
        label: "Tap Plan",
        caption: "Tap Plan",
        fit: "contain",
        scale: 1.1,
      },
      {
        src: "/preview-5.jpg",
        alt: "TripFind preview - new flow",
        label: "Compare",
        caption: "Smart Comparison",
        fit: "contain",
        scale: 1.1,
      },
      {
        src: "/preview-3.jpg",
        alt: "TripFind preview - trip ready",
        label: "Trip ready",
        caption: "Compare & Book",
        fit: "contain",
        scale: 1.1,
      },
    ],
    []
  );

  const faqs: FAQ[] = useMemo(
    () => [
      {
        q: "When does TripFind launch?",
        a: "We’re rolling out access in waves. Join the waitlist to get early access first.",
      },
      {
        q: "Which countries are supported first?",
        a: "We’ll start with the most popular routes and expand quickly based on demand.",
      },
      {
        q: "Is TripFind free?",
        a: "Yes — the core experience is free. Premium adds extra features and perks.",
      },
      {
        q: "Do you book flights and hotels directly?",
        a: "TripFind helps you compare and plan. Booking flows depend on partner availability.",
      },
      {
        q: "How does personalization work?",
        a: "We learn from your vibe, budget, and time to tailor trips that fit you.",
      },
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

  function goTo(i: number) {
    if (i === index) return;
    setAnimDir(i > index ? "next" : "prev");
    setIndex(i);
    setSlideAnimKey((prev) => prev + 1);
  }

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
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
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

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error || "Signup failed.");
        return;
      }

      setStatus("success");
      setMessage(data?.message || "You're on the waitlist! 🎉");
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
  const fitClass = (active.fit ?? "contain") === "cover" ? "object-cover" : "object-contain";
  const scale = Math.max(active.scale ?? 1.0, 1.12);

  const fixedQuotes = quotes.slice(0, 2);
  const rotatingQuote = quotes[quoteIndex];

  function onPointerDown(e: React.PointerEvent) {
    pointerDownRef.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!pointerDownRef.current) return;
    const dx = e.clientX - pointerDownRef.current.x;
    const dy = e.clientY - pointerDownRef.current.y;
    pointerDownRef.current = null;
    if (Math.abs(dx) < 40 || Math.abs(dy) > 60) return;
    dx < 0 ? next() : prev();
  }

  return (
    <main className={`${font.className} min-h-screen bg-white text-black pb-24 sm:pb-0`}>
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-200 via-emerald-200 to-indigo-200 blur-3xl opacity-70" />
        <div className="absolute bottom-[-9rem] right-[-9rem] h-72 w-72 rounded-full bg-gradient-to-tr from-amber-200 via-rose-200 to-purple-200 blur-3xl opacity-70" />
      </div>

      {/* Header */}
      <header className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="TripFind logo" className="h-10 w-auto" draggable={false} />
            <div className="leading-tight">
              <div className="font-semibold tracking-tight">TripFind</div>
              <div className="text-xs text-gray-500">Smarter travel discovery</div>
            </div>
          </div>
          <a href="#signup" className="rounded-2xl border border-black bg-white/70 px-4 py-2 text-sm text-black hover:bg-white transition-colors">
            Get early access
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border bg-white/70 px-3 py-1 text-xs">✨ Personalized</span>
              <span className="rounded-full border bg-white/70 px-3 py-1 text-xs">💸 Budget-aware</span>
              <span className="rounded-full border bg-white/70 px-3 py-1 text-xs font-medium">⚡ Tap-to-Plan™️</span>
            </div>

            <h1 className="mt-6 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
              Plan trips you’ll actually love — in seconds.
            </h1>

            <p className="mt-4 max-w-xl text-lg text-gray-600">
              <span className="block font-medium text-gray-900">Discover travel inspiration and turn it into a complete plan instantly.</span>
              <span className="block">Stress-free planning, from idea to itinerary.</span>
              <span className="block">No endless searching — just trips that fit you.</span>
            </p>

            <div className="mt-6">
              <div className="inline-flex items-center gap-2 rounded-2xl border bg-white/70 px-4 py-2 text-sm text-gray-800">
                <span className="text-base">🔥</span>
                <span className="font-semibold">{WAITLIST_COUNT.toLocaleString()} travelers already joined</span>
              </div>
            </div>

            <form id="signup" onSubmit={onSubmit} className="mt-6 max-w-xl">
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Where are you traveling from?
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["Europe", "US", "Other"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setOrigin(opt)}
                      className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                        origin === opt ? "bg-black text-white border-black shadow-md" : "bg-white/70 text-gray-800 hover:bg-white border-gray-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="signup-email"
                  type="email"
                  required
                  disabled={!origin}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={origin ? "Enter your email for early access" : "Select your origin first"}
                  className={`w-full rounded-2xl border bg-white/90 px-4 py-3 outline-none backdrop-blur focus:ring-2 focus:ring-black/5 disabled:opacity-50 transition-all ${
                    origin ? "highlight-email" : ""
                  }`}
                />
                <button
                  type="submit"
                  disabled={status === "loading" || !origin}
                  className="rounded-2xl bg-black px-5 py-3 text-white disabled:opacity-60 hover:opacity-90 transition-opacity font-medium whitespace-nowrap"
                >
                  {status === "loading" ? "Joining..." : "Reserve my free Premium month"}
                </button>
              </div>

              {message && (
                <p className={`mt-3 text-sm font-medium ${status === "success" ? "text-emerald-700" : "text-red-600"}`}>
                  {message}
                </p>
              )}

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900">🎁 Early access + 1 month of Premium free</p>
                <p className="mt-1 text-xs text-gray-500">Priority onboarding. No spam. Cancel anytime.</p>
              </div>
            </form>
          </div>

          {/* Product Preview */}
          <div className="lg:pt-2">
            <div
              className="mx-auto w-full max-w-md rounded-3xl border bg-white/70 p-5 shadow-sm backdrop-blur"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Product preview</div>
                  <div className="text-xs text-gray-500">👆 Swipe to explore the flow</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={prev} className="rounded-xl border bg-white p-2 text-sm hover:bg-gray-50 transition-colors">←</button>
                  <button onClick={next} className="rounded-xl border bg-white p-2 text-sm hover:bg-gray-50 transition-colors">→</button>
                </div>
              </div>

              <div className="relative rounded-2xl border bg-white p-2">
                <div 
                  className="relative overflow-hidden rounded-xl bg-gradient-to-b from-amber-50 via-sky-50 to-white w-full touch-pan-y select-none"
                  style={{ height: FRAME_HEIGHT_PX }}
                  onPointerDown={onPointerDown}
                  onPointerUp={onPointerUp}
                >
                  <img
                    key={active.src}
                    src={active.src}
                    alt={active.alt}
                    draggable={false}
                    className={`absolute inset-0 h-full w-full ${fitClass} will-change-transform ${
                      animDir === "next" ? "animate-slideInFromRight" : "animate-slideInFromLeft"
                    }`}
                    style={{ transform: `scale(${scale})` }}
                  />

                  <div key={slideAnimKey}>
                    <div className="absolute bottom-6 left-4 right-4 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm animate-fadeSlideIn border border-white/10">
                      Plan your trip in 3 taps.
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {slides.map((s, i) => (
                      <button
                        key={s.src}
                        onClick={() => goTo(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === index ? "bg-black w-6" : "bg-gray-200 w-1.5 hover:bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {active.caption}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl border bg-white/70 p-8 shadow-sm backdrop-blur">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border bg-white p-5 transition-all hover:border-gray-300">
                <summary className="cursor-pointer list-none font-semibold text-gray-900 flex items-center justify-between">
                  <span>{f.q}</span>
                  <span className="text-gray-400 group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50/50">
        <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="TripFind" className="h-10 w-auto" />
            <div>
              <div className="font-bold">© {year} TripFind</div>
              <div className="text-xs text-gray-500">Built with ❤️ for modern travelers.</div>
            </div>
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-black">Instagram</a>
            <a href={`mailto:${contactEmail}`} className="text-gray-600 hover:text-black">Contact</a>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur-md sm:hidden px-4 py-4">
        <button onClick={focusSignup} className="w-full rounded-2xl bg-black py-4 text-sm font-bold text-white shadow-xl">
          Get Early Access — 1 Month Free
        </button>
      </div>

      <style jsx global>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlideIn { animation: fadeSlideIn 0.5s ease-out forwards; }

        @keyframes highlightInput {
          0% { border-color: #e5e7eb; box-shadow: 0 0 0px transparent; }
          50% { border-color: #000; box-shadow: 0 0 15px rgba(0,0,0,0.1); }
          100% { border-color: #e5e7eb; box-shadow: 0 0 0px transparent; }
        }
        .highlight-email { animation: highlightInput 1.2s ease-in-out; }

        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(20px) scale(${scale}); }
          to { opacity: 1; transform: translateX(0) scale(${scale}); }
        }
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-20px) scale(${scale}); }
          to { opacity: 1; transform: translateX(0) scale(${scale}); }
        }
        .animate-slideInFromRight { animation: slideInFromRight 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slideInFromLeft { animation: slideInFromLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1); }

        html { scroll-behavior: smooth; }
      `}</style>
    </main>
  );
}
