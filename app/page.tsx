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
  
  // State to trigger the "opening" animation on the form
  const [isHighlighting, setIsHighlighting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const contactEmail = "info@tripfind.net";
  const instagramUrl = "https://www.instagram.com/tripfind.app?igsh=ZWUwaDQ2d2RhbWlw";

  const quotes: Quote[] = useMemo(() => [
    { text: "I found a weekend trip in 3 minutes that actually matched my budget.", author: "— Beta user" },
    { text: "Your app looks great thoug. Honestly, well done!", author: "— Early tester" },
    { text: "You couldn't have sent this to a better person. I'd be traveling constantly if I could, but the prices lately have been just terrible!", author: "— Waitlist member" },
    { text: "I hate tab-hopping. This makes planning feel effortless.", author: "— Early tester" },
  ], []);

  const faqs: FAQ[] = useMemo(() => [
    { q: "When does TripFind launch?", a: "We’re rolling out access in waves. Join the waitlist to get early access first." },
    { q: "Is TripFind free?", a: "Yes — the core experience is free. Premium adds extra features and perks." },
    { q: "How does personalization work?", a: "We learn from your vibe, budget, and time to tailor trips that fit you." },
  ], []);

  // Function for the "Join Waitlist" shortcut
  const scrollToSignup = () => {
    setIsHighlighting(true);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    inputRef.current?.focus();
    
    // Remove the highlight class after animation finishes
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
    <main className={`${font.className} min-h-screen bg-white text-black pb-24 sm:pb-0`}>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-sky-100 blur-3xl opacity-50" />
        <div className="absolute bottom-[-5rem] right-[-5rem] h-72 w-72 rounded-full bg-rose-100 blur-3xl opacity-50" />
      </div>

      <header className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="TripFind logo" className="h-10 w-auto" />
            <div className="leading-tight">
              <div className="font-bold tracking-tight">TripFind</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-400">Beta Access</div>
            </div>
          </div>
          <button 
            onClick={scrollToSignup}
            className="rounded-full bg-black px-5 py-2.5 text-xs font-bold text-white hover:scale-105 transition-transform"
          >
            Get Early Access
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm">
              <span className="text-emerald-500">●</span> Limited Beta Open
            </div>
            
            <h1 className="mt-8 text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl">
              Travel planning <br />
              <span className="text-gray-400 italic">without</span> the tabs.
            </h1>
            
            <p className="mt-6 max-w-lg text-xl text-gray-600 leading-relaxed">
              Stop endless searching. Get personalized itineraries and smart comparisons in seconds with <b>Tap-to-Plan™</b>.
            </p>

            <form 
              ref={formRef}
              id="signup" 
              onSubmit={onSubmit} 
              className={`mt-10 max-w-xl transition-all duration-500 ${isHighlighting ? "scale-105" : "scale-100"}`}
            >
              <div className={`flex flex-col gap-3 sm:flex-row p-1 rounded-[22px] transition-all duration-500 ${isHighlighting ? "ring-4 ring-sky-400/30" : "ring-0"}`}>
                <input
                  ref={inputRef}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-4 text-lg outline-none focus:border-black transition-colors shadow-sm"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-2xl bg-black px-8 py-4 font-bold text-white shadow-lg hover:bg-gray-900 transition-all active:scale-95"
                >
                  {status === "loading" ? "..." : "Claim Free Month"}
                </button>
              </div>

              <div className="mt-6 px-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Optional: Where are you from?</p>
                <div className="flex gap-2">
                  {["Europe", "US", "Other"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setOrigin(opt as any)}
                      className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-all ${
                        origin === opt ? "bg-black border-black text-white" : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 px-2">
                <p className="text-sm font-bold uppercase tracking-widest text-gray-600">
                  Join 100+ others already on the list.
                </p>
              </div>

              {message && (
                <p className={`mt-4 text-sm font-bold ${status === "success" ? "text-emerald-600" : "text-red-500"}`}>
                  {message}
                </p>
              )}
            </form>
          </div>

          {/* Video Preview Container */}
          <div className="relative">
            <p className="mb-4 text-center text-sm font-bold uppercase tracking-widest text-gray-400">
              Product Preview
            </p>

            <div 
              className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[3rem] border-[8px] border-white bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)]"
            >
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
                
                {/* Floating Action Badge */}
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="animate-fadeUp rounded-2xl bg-black/80 p-4 text-center text-sm font-bold text-white backdrop-blur-md">
                    Planning your trip in 30 seconds...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quotes.map((q, i) => (
            <div key={i} className="rounded-3xl border border-gray-100 bg-white/50 p-6 backdrop-blur-sm">
              <p className="text-sm font-semibold leading-relaxed text-gray-800">"{q.text}"</p>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">{q.author}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold">Common Questions</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <details key={i} className="group rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-gray-300">
              <summary className="flex cursor-pointer list-none items-center justify-between font-bold">
                {f.q}
                <span className="transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-gray-500">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-100 py-16 text-center">
        <div className="mb-8 flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Instagram</a>
          <a href={`mailto:${contactEmail}`} className="hover:text-black transition-colors">Contact</a>
        </div>
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">© 2026 TripFind — All Rights Reserved</p>
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
