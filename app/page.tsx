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

  const contactEmail = "info@tripfind.net";

  const instagramUrl = "https://www.instagram.com/tripfind.app?igsh=ZWUwaDQ2d2RhbWlw";
  const whatsappUrl = "https://wa.me/";

  const WAITLIST_COUNT = 2143;

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
      {
        text: "I picked my vibe and instantly got options I’d actually book.",
        author: "— Beta user",
      },
    ],
    []
  );

  const [quoteIndex, setQuoteIndex] = useState(0);

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
  const intervalRef = useRef<number | null>(null);

  const FRAME_HEIGHT_PX = 560;

  const year = useMemo(() => new Date().getFullYear(), []);

  const pointerDownRef = useRef<{ x: number; y: number } | null>(null);

  function goTo(i: number) {
    if (i === index) return;
    setAnimDir(i > index ? "next" : "prev");
    setIndex(i);
  }

  function next() {
    setAnimDir("next");
    setIndex((prev) => (prev + 1) % slides.length);
  }

  function prev() {
    setAnimDir("prev");
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }

  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = window.setInterval(() => {
      next();
    }, 4200);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        body: JSON.stringify({ email }),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {}

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error || "Signup failed.");
        return;
      }

      setStatus("success");
      setMessage(data?.message || "You're on the waitlist! 🎉");
      setEmail("");
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
  const fitClass =
    (active.fit ?? "contain") === "cover" ? "object-cover" : "object-contain";
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

    if (Math.abs(dx) < 40) return;
    if (Math.abs(dy) > 60) return;

    if (dx < 0) next();
    else prev();
  }

  return (
    <main className={`${font.className} min-h-screen bg-white text-black pb-24 sm:pb-0`}>
      {/* ✅ Dev Tasks (explicit) */}
      <div className="hidden" aria-hidden="true">
        {/* DEV TASKS:
          1) Replace contact email (done): info@tripfind.net
          2) Ensure mail forwarding works
        */}
      </div>

      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-200 via-emerald-200 to-indigo-200 blur-3xl opacity-70" />
        <div className="absolute bottom-[-9rem] right-[-9rem] h-72 w-72 rounded-full bg-gradient-to-tr from-amber-200 via-rose-200 to-purple-200 blur-3xl opacity-70" />
      </div>

      {/* Header */}
      <header className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* ✅ UPDATED: bigger logo, no frame */}
            <img
              src="/logo.png"
              alt="TripFind logo"
              className="h-10 w-auto"
              draggable={false}
            />

            <div className="leading-tight">
              <div className="font-semibold tracking-tight">TripFind</div>
              <div className="text-xs text-gray-500">Smarter travel discovery</div>
            </div>
          </div>

          <a
            href="#signup"
            className="rounded-2xl border border-black bg-white/70 px-4 py-2 text-sm text-black hover:bg-white"
          >
            Get early access
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          {/* Left */}
          <div className="pt-2">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border bg-white/70 px-3 py-1 text-xs">
                ✨ Personalized
              </span>
              <span className="rounded-full border bg-white/70 px-3 py-1 text-xs">
                💸 Budget-aware
              </span>
              <span className="rounded-full border bg-white/70 px-3 py-1 text-xs font-medium">
                ⚡ Tap-to-Plan™️
              </span>
            </div>

            <h1 className="mt-6 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
              Find your next trip in seconds.
            </h1>

            <p className="mt-4 max-w-xl text-lg text-gray-600">
              <span className="block font-medium text-gray-900">
                Discover like TikTok. Plan like a pro.
              </span>
              <span className="block">
                Trip videos → instant plans, personalized to your budget and schedule.
              </span>
              <span className="block">No endless searching. No tab-hopping.</span>
            </p>

            <div className="mt-5 max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs text-gray-700">
                ⚡ <span className="font-semibold">Tap-to-Plan™️</span> turns a trip
                idea into an instant itinerary.
              </span>
            </div>

            <div className="mt-6 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-2xl border bg-white/70 px-4 py-2 text-sm text-gray-800">
                <span className="text-base">🔥</span>
                <span className="font-semibold">
                  {WAITLIST_COUNT.toLocaleString()} travelers already joined
                </span>
              </div>
            </div>

            <form id="signup" onSubmit={onSubmit} className="mt-4 max-w-xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for early access"
                  className="w-full rounded-2xl border bg-white/90 px-4 py-3 outline-none backdrop-blur focus:ring-2"
                />

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-2xl bg-black px-5 py-3 text-white disabled:opacity-60 hover:opacity-90"
                >
                  {status === "loading" ? "Joining..." : "Get early access"}
                </button>
              </div>

              <div className="mt-3">
                <p className="text-sm font-medium text-gray-900">
                  🎁 Early access + 1 month of Premium free for early users
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Priority onboarding. Cancel anytime.
                </p>
              </div>
            </form>

            {message && (
              <p
                className={`mt-3 max-w-xl text-sm ${
                  status === "success" ? "text-emerald-700" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <p className="mt-3 max-w-xl text-xs text-gray-500">
              No spam. Only launch updates. Unsubscribe anytime.
            </p>

            {/* How TripFind works */}
            <div className="mt-8 max-w-xl">
              <h2 className="text-lg font-semibold tracking-tight">
                How TripFind works
              </h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border bg-white/70 p-4 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-xl border bg-white">
                      🎛️
                    </div>
                    <div className="text-sm font-semibold">Step 1</div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">
                    <span className="font-semibold">Pick your vibe</span>{" "}
                    <span className="text-gray-600">Budget, days, interests.</span>
                  </p>
                </div>

                <div className="rounded-2xl border bg-white/70 p-4 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-xl border bg-white">
                      📲
                    </div>
                    <div className="text-sm font-semibold">Step 2</div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">
                    <span className="font-semibold">Discover Trips</span>
                    <span className="block text-gray-600">
                      Scroll videos + curated topics
                    </span>
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm">
                  <div className="pointer-events-none absolute -inset-12 bg-gradient-to-r from-emerald-200 via-sky-200 to-indigo-200 blur-2xl opacity-70" />
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-black text-white">
                        ✨
                      </div>
                      <div className="text-sm font-semibold">Step 3</div>
                    </div>

                    <p className="mt-2 text-sm text-gray-900">
                      <span className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1 text-white text-sm font-semibold shadow-md ring-2 ring-black/10 whitespace-nowrap">
                        ⭕ Tap to plan
                      </span>
                      <span className="block mt-2 text-gray-700">
                        Instant itinerary. Compare options.
                        <span className="block">Book when ready.</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border bg-white/70 px-4 py-3 text-sm text-gray-700">
                🌍 Powered by global inventory partners across flights, stays, and
                experiences.
              </div>
            </div>

            {/* Quotes */}
            <div className="mt-8 max-w-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  What early users say
                </h3>
                <span className="text-xs text-gray-500">(simulated for now)</span>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {fixedQuotes.map((q) => (
                  <blockquote
                    key={q.text}
                    className="rounded-2xl border bg-white/70 p-4 shadow-sm backdrop-blur"
                  >
                    <p className="text-sm text-gray-800">“{q.text}”</p>
                    <footer className="mt-2 text-xs text-gray-500">
                      {q.author}
                    </footer>
                  </blockquote>
                ))}
              </div>

              <blockquote className="mt-3 rounded-2xl border bg-white/70 p-4 shadow-sm backdrop-blur">
                <p
                  key={rotatingQuote.text}
                  className="text-sm text-gray-800 animate-fadeIn"
                >
                  “{rotatingQuote.text}”
                </p>
                <footer className="mt-2 text-xs text-gray-500">
                  {rotatingQuote.author}
                </footer>
              </blockquote>
            </div>
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
                  <div className="text-xs text-gray-500">
                    👆 Swipe through real in-app flow
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    className="rounded-2xl border bg-white px-4 py-2 text-sm hover:bg-gray-50"
                    aria-label="Previous slide"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="rounded-2xl border bg-white px-4 py-2 text-sm hover:bg-gray-50"
                    aria-label="Next slide"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="relative rounded-2xl border bg-white p-2">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-16 rounded-2xl bg-gradient-to-b from-black/10 to-transparent" />

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
                    className={[
                      "absolute inset-0 h-full w-full",
                      fitClass,
                      "will-change-transform",
                      animDir === "next"
                        ? "animate-slideInFromRight"
                        : "animate-slideInFromLeft",
                    ].join(" ")}
                    style={{ transform: `scale(${scale})` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  {slides.map((s, i) => (
                    <button
                      key={s.src}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={[
                        "h-2.5 w-2.5 rounded-full border transition-all",
                        i === index
                          ? "bg-black border-black w-7"
                          : "bg-white border-gray-300 hover:bg-gray-50",
                      ].join(" ")}
                    />
                  ))}
                </div>

                <div className="text-xs font-semibold tracking-tight text-gray-900">
                  {active.caption ?? ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why TripFind */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold">Why TripFind?</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Feature icon="⚡" title="Faster discovery">
              Find trips you’d actually take in minutes, not hours.
            </Feature>
            <Feature icon="🎯" title="Better matches">
              Vibe, budget, and time — not just destination.
            </Feature>
            <Feature icon="🔥" title="Tap-to-Plan">
              See something you like? Tap once and get a full trip.
            </Feature>
          </div>
        </div>
      </section>

      {/* ✅ FAQ (before Privacy) */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <p className="mt-2 text-sm text-gray-600">
            Quick answers to remove hesitation.
          </p>

          <div className="mt-6 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border bg-white p-4"
              >
                <summary className="cursor-pointer list-none font-semibold text-gray-900 flex items-center justify-between">
                  <span>{f.q}</span>
                  <span className="ml-3 text-gray-500 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy / Contact */}
      <section id="privacy" className="mx-auto max-w-6xl px-6 pb-8 scroll-mt-24">
        <div className="rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur">
          <h3 className="text-lg font-semibold">Privacy</h3>
          <p className="mt-2 text-sm text-gray-600">
            We only collect your email to notify you about TripFind launch updates and
            early access. We don’t sell your data. You can unsubscribe anytime.
          </p>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 pb-14 scroll-mt-24">
        <div className="rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur">
          <h3 className="text-lg font-semibold">Contact</h3>
          <p className="mt-2 text-sm text-gray-600">
            Want to partner or ask a question? Email us at{" "}
            <a className="underline" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
            .
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border bg-white px-4 py-2 text-sm hover:bg-gray-50"
            >
              Instagram
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border bg-white px-4 py-2 text-sm hover:bg-gray-50"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-gray-500 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {/* ✅ UPDATED: bigger logo, no frame */}
            <img
              src="/logo.png"
              alt="TripFind logo"
              className="h-10 w-auto"
              draggable={false}
            />

            <div className="flex flex-col gap-0.5">
              <div>© {year} TripFind</div>
              <div className="text-xs text-gray-500">Built with ❤️ for travelers.</div>
            </div>
          </div>

          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-black">
              Privacy
            </a>
            <a href="#contact" className="hover:text-black">
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* ✅ Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/90 backdrop-blur sm:hidden">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="leading-tight">
            <div className="text-sm font-semibold">Get early access</div>
            <div className="text-xs text-gray-600">1 month Premium free</div>
          </div>
          <button
            type="button"
            onClick={focusSignup}
            className="rounded-2xl bg-black px-4 py-2 text-sm text-white"
          >
            Get early access
          </button>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        html {
          scrollbar-gutter: stable;
          scroll-behavior: smooth;
        }

        @keyframes slideInFromRight {
          0% {
            opacity: 0;
            transform: translateX(18px) scale(${scale});
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(${scale});
          }
        }
        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-18px) scale(${scale});
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(${scale});
          }
        }
        .animate-slideInFromRight {
          animation: slideInFromRight 0.5s ease-out;
        }
        .animate-slideInFromLeft {
          animation: slideInFromLeft 0.5s ease-out;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out;
        }
      `}</style>
    </main>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl border bg-white">
          {icon}
        </div>
        <div className="font-semibold">{title}</div>
      </div>
      <p className="mt-3 text-sm text-gray-600">{children}</p>
    </div>
  );
}
