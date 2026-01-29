"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

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

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error || "Something went wrong. Try again.");
        return;
      }

      setStatus("success");
      setMessage("You're on the waitlist! 🎉");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">TripFind</div>
          <a
            href="#signup"
            className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Join Waitlist
          </a>
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-6 pb-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Find your next trip in seconds — not hours.
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              TripFind helps you discover trips that match your vibe, budget, and
              time. Join the waitlist for early access.
            </p>

            <form
              id="signup"
              onSubmit={onSubmit}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-60"
              >
                {status === "loading" ? "Joining..." : "Join waitlist"}
              </button>
            </form>

            {message ? (
              <p
                className={`mt-3 text-sm ${
                  status === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            ) : null}

            <p className="mt-3 text-xs text-gray-500">
              No spam. Only launch updates.
            </p>
          </div>

          <div className="rounded-2xl border bg-gray-50 p-6">
            <div className="text-sm font-medium text-gray-700">
              Product Preview
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Replace this box with screenshots or a short demo video from your
              Rork app.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="h-36 rounded-xl bg-white border flex items-center justify-center text-xs text-gray-500">
                Screenshot 1
              </div>
              <div className="h-36 rounded-xl bg-white border flex items-center justify-center text-xs text-gray-500">
                Screenshot 2
              </div>
              <div className="h-36 rounded-xl bg-white border flex items-center justify-center text-xs text-gray-500">
                Screenshot 3
              </div>
              <div className="h-36 rounded-xl bg-white border flex items-center justify-center text-xs text-gray-500">
                Screenshot 4
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-14">
        <h2 className="text-2xl font-semibold">Why TripFind?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border p-5">
            <div className="font-medium">Faster discovery</div>
            <p className="mt-2 text-sm text-gray-600">
              Stop endless scrolling. Get trip ideas that fit you.
            </p>
          </div>
          <div className="rounded-2xl border p-5">
            <div className="font-medium">Better matches</div>
            <p className="mt-2 text-sm text-gray-600">
              Filter by vibe, budget, and time — not just destination.
            </p>
          </div>
          <div className="rounded-2xl border p-5">
            <div className="font-medium">Plan with confidence</div>
            <p className="mt-2 text-sm text-gray-600">
              Save and compare options before you decide.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="rounded-2xl bg-gray-50 border p-8">
            <h3 className="text-2xl font-semibold">Get early access</h3>
            <p className="mt-2 text-gray-600">
              Join the waitlist and be first to try TripFind when we launch.
            </p>

            <a
              href="#signup"
              className="mt-5 inline-block rounded-xl bg-black px-5 py-3 text-white"
            >
              Join waitlist
            </a>
          </div>

          <footer className="mt-10 text-xs text-gray-500">
            © {new Date().getFullYear()} TripFind
          </footer>
        </div>
      </section>
    </main>
  );
}
