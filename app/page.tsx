"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
  const [origin, setOrigin] = useState<"Europe" | "US" | "Other" | "">("");
  const [isHighlighting, setIsHighlighting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const contactEmail = "info@tripfind.net";
  const instagramUrl = "https://www.instagram.com/tripfind.app?igsh=ZWUwaDQ2d2RhbWlw";

  const quotes: Quote[] = useMemo(() => [
    { text: "I found a weekend trip in 3 minutes that actually matched my budget.", author: "— Beta user" },
    { text: "Your app looks great though. Honestly, well done!", author: "— Early tester" },
    { text: "You couldn't have sent this to a better person. I'd be traveling constantly if I could, but the prices lately have been just terrible!", author: "— Waitlist member" },
    { text: "I hate tab-hopping. This makes planning feel effortless.", author: "— Early tester" },
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
    setTimeout(() => setIsHighlighting(false), 1000);
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
      setMessage(data.message || "You're in! Check your email for your Premium perk. 🎉");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <main className={`${font.className} min-h-screen bg-[#060c18] text-white pb-24 sm:pb-0`}>
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-sky-600/20 blur-[120px]" />
        <div className="absolute top-1/2 -left-32 h-96 w-96 rounded-full bg-indigo-700/20 blur-[100px]" />
        <div className="absolute bottom-0 right-[-8rem] h-96 w-96 rounded-full bg-violet-700/20 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="TripFind logo" className="h-10 w-auto" />
            <div className="leading-tight">
              <div className="font-bold tracking-tight text-white">TripFind</div>
              <div className="text-[10px] uppercase tracking-widest text-sky-400/70">Beta Access</div>
            </div>
          </div>
          <button
            onClick={scrollToSignup}
            className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-500/25 hover:scale-105 hover:shadow-sky-500/40 transition-all"
          >
            Get Early Access
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
              <span className="text-emerald-400">●</span>
              <span className="text-white/70">Limited Beta Open</span>
            </div>

            <h1 className="mt-8 text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl text-white">
              Travel planning <br />
              <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent italic">without</span> the tabs.
            </h1>

            <p className="mt-6 max-w-lg text-xl text-white/60 leading-relaxed">
              Stop endless searching. Get personalized itineraries and smart comparisons in seconds with{" "}
              <b className="text-white/90">Tap-to-Plan™</b>.
            </p>

            <form
              ref={formRef}
              id="signup"
              onSubmit={onSubmit}
              className={`mt-10 max-w-xl transition-all duration-500 ${isHighlighting ? "scale-105" : "scale-100"}`}
            >
              <div
                className={`flex flex-col gap-3 sm:flex-row p-1 rounded-[22px] bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-500 ${
                  isHighlighting ? "ring-4 ring-sky-500/40 border-sky-500/40" : ""
                }`}
              >
                <input
                  ref={inputRef}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-lg text-white placeholder-white/30 outline-none focus:border-sky-500/60 focus:bg-white/10 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-8 py-4 font-bold text-white shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:brightness-110 transition-all active:scale-95 whitespace-nowrap"
                >
                  {status === "loading" ? "..." : "Claim Free Month"}
                </button>
              </div>

              <div className="mt-6 px-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Optional: Where are you from?</p>
                <div className="flex gap-2">
                  {["Europe", "US", "Other"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setOrigin(opt as any)}
                      className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-all ${
                        origin === opt
                          ? "bg-sky-500 border-sky-500 text-white shadow-sm shadow-sky-500/40"
                          : "bg-white/5 border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 px-2">
                <p className="text-sm font-bold uppercase tracking-widest text-white/40">
                  Join 100+ others already on the list.
                </p>
              </div>

              {message && (
                <p className={`mt-4 text-sm font-bold ${status === "success" ? "text-emerald-400" : "text-red-400"}`}>
                  {message}
                </p>
              )}
            </form>
          </div>

          {/* Video Preview */}
          <div className="relative">
            <p className="mb-4 text-center text-sm font-bold uppercase tracking-widest text-white/30">
              Product Preview
            </p>
            <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 shadow-[0_32px_80px_-12px_rgba(56,189,248,0.15)] ring-1 ring-white/5">
              <div className="relative aspect-[9/19] w-full bg-black overflow-hidden">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover scale-[1.05] -translate-y-4"
                >
                  <source src="/productpreview.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="animate-fadeUp rounded-2xl bg-black/60 p-4 text-center text-sm font-bold text-white backdrop-blur-md border border-white/10">
                    Planning your trip in 30 seconds...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quotes */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quotes.map((q, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/8 bg-white/4 p-6 backdrop-blur-sm hover:border-sky-500/30 hover:bg-white/6 transition-all"
            >
              <p className="text-sm font-semibold leading-relaxed text-white/70">"{q.text}"</p>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-sky-400/60">{q.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold text-white">Common Questions</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur-sm transition-all hover:border-white/20 open:border-sky-500/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-white/90">
                {f.q}
                <span className="text-sky-400 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-white/50">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-16 text-center">
        <div className="mb-8 flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-white/30">
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
            Instagram
          </a>
          <a href={`mailto:${contactEmail}`} className="hover:text-sky-400 transition-colors">
            Contact
          </a>
        </div>
        <p className="text-[10px] font-bold text-white/15 uppercase tracking-[0.2em]">© 2026 TripFind — All Rights Reserved</p>
      </footer>

      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 0.4s ease-out forwards; }
        html { scroll-behavior: smooth; }
      `}</style>
    </main>
  );
}
