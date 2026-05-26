"use client";

import { useMemo, useRef, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

type Quote = { text: string; author: string };
type FAQ = { q: string; a: string };

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [origin, setOrigin] = useState<"Europe" | "US" | "Other" | "">("");
  const [isHighlighting, setIsHighlighting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const contactEmail = "info@tripfind.net";
  const instagramUrl = "https://www.instagram.com/tripfind.app?igsh=ZWUwaDQ2d2RhbWlw";

  const quotes: Quote[] = useMemo(() => [
    { text: "I found a weekend trip in 3 minutes that actually matched my budget.", author: "Beta user" },
    { text: "Your app looks great though. Honestly, well done!", author: "Early tester" },
    { text: "You couldn't have sent this to a better person. I'd be traveling constantly if I could!", author: "Waitlist member" },
    { text: "I hate tab-hopping. This makes planning feel effortless.", author: "Early tester" },
  ], []);

  const faqs: FAQ[] = useMemo(() => [
    { q: "When does TripFind launch?", a: "We're rolling out access in waves. Join the waitlist to get early access first." },
    { q: "Is TripFind free?", a: "Yes — the core experience is free. Premium adds extra features and perks." },
    { q: "How does personalization work?", a: "We learn from your vibe, budget, and time to tailor trips that fit you." },
  ], []);

  const scrollToSignup = () => {
    setIsHighlighting(true);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    inputRef.current?.focus();
    setTimeout(() => setIsHighlighting(false), 900);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, origin: origin || "Not Specified" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
      setMessage(data.message || "You're in! Check your email for your Premium perk.");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <main className={`${font.className} min-h-screen bg-zinc-950 text-zinc-50 pb-24 sm:pb-0`}>

      {/* Subtle top glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-blue-950/40 to-transparent" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="TripFind logo" className="h-8 w-auto" />
            <span className="text-sm font-bold tracking-tight text-white">TripFind</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-zinc-500 sm:block">Limited beta · 100+ on waitlist</span>
            <button
              onClick={scrollToSignup}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white"
            >
              Get Early Access
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16">
        <div className="grid gap-16 lg:grid-cols-[1fr_380px] lg:items-center">

          {/* Left column */}
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[11px] font-semibold text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Limited Beta — Now Open
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Travel planning<br />
              <span className="text-blue-400 italic">without</span> the tabs.
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-zinc-400 sm:text-xl">
              Stop endless searching. Get personalized itineraries and smart comparisons
              in seconds with <span className="font-semibold text-zinc-200">Tap-to-Plan™</span>.
            </p>

            {/* Signup form */}
            <form
              ref={formRef}
              id="signup"
              onSubmit={onSubmit}
              className={`mt-10 transition-all duration-300 ${isHighlighting ? "scale-[1.02]" : "scale-100"}`}
            >
              <div className={`flex flex-col gap-2 sm:flex-row transition-all duration-300 ${isHighlighting ? "ring-2 ring-blue-500/50 rounded-xl" : ""}`}>
                <input
                  ref={inputRef}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-3.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-zinc-950 transition-all hover:bg-zinc-100 active:scale-95 disabled:opacity-60 whitespace-nowrap"
                >
                  {status === "loading" ? "Joining…" : "Claim Free Month"}
                </button>
              </div>

              {/* Origin picker */}
              <div className="mt-5">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
                  Where are you from? <span className="text-zinc-700 normal-case tracking-normal">(optional)</span>
                </p>
                <div className="flex gap-2">
                  {(["Europe", "US", "Other"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setOrigin(opt)}
                      className={`rounded-md border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                        origin === opt
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {message && (
                <p className={`mt-4 text-sm font-medium ${status === "success" ? "text-emerald-400" : "text-red-400"}`}>
                  {message}
                </p>
              )}
            </form>
          </div>

          {/* Right column — phone mockup */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">Product Preview</p>
            <div className="w-full max-w-[300px] overflow-hidden rounded-[2.5rem] border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/60">
              <div className="relative aspect-[9/19] w-full overflow-hidden bg-black">
                <video autoPlay muted loop playsInline className="h-full w-full object-cover scale-[1.05] -translate-y-4">
                  <source src="/productpreview.mp4" type="video/mp4" />
                </video>
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="animate-fadeUp rounded-xl border border-white/10 bg-black/70 px-4 py-3 text-center text-xs font-semibold text-white">
                    Planning your trip in 30 seconds…
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="border-t border-zinc-800/60" />
      </div>

      {/* Social proof */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-10 text-center text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
          What people are saying
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quotes.map((q, i) => (
            <div
              key={i}
              className="group rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700"
            >
              <p className="text-sm leading-relaxed text-zinc-300">"{q.text}"</p>
              <p className="mt-4 text-[11px] font-semibold text-zinc-600">— {q.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="border-t border-zinc-800/60" />
      </div>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-6 py-20">
        <h2 className="mb-10 text-center text-2xl font-bold text-white">Common Questions</h2>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="group rounded-xl border border-zinc-800 bg-zinc-900 transition-colors open:border-zinc-700"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-zinc-200">
                {f.q}
                <span className="ml-4 flex-shrink-0 text-zinc-500 transition-transform group-open:rotate-45 group-open:text-blue-400">+</span>
              </summary>
              <p className="border-t border-zinc-800 px-5 py-4 text-sm leading-relaxed text-zinc-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-12 text-center">
        <div className="mb-6 flex justify-center gap-8 text-xs font-semibold text-zinc-600">
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-zinc-300">
            Instagram
          </a>
          <a href={`mailto:${contactEmail}`} className="transition-colors hover:text-zinc-300">
            Contact
          </a>
        </div>
        <p className="text-[11px] text-zinc-700">© 2026 TripFind. All rights reserved.</p>
      </footer>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 0.35s ease-out forwards; }
        html { scroll-behavior: smooth; }
      `}</style>
    </main>
  );
}
