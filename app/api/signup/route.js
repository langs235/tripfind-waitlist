export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resend } from "@/app/lib/resend";

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const email = (body?.email || "").trim().toLowerCase();
    const origin = body?.origin || null;

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: "Server not configured: missing Supabase keys." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const { error } = await supabase
      .from("pre_signups")
      .insert([{ email, origin }]);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({
          ok: true,
          message: "You're already on the waitlist ✅",
        });
      }
      return NextResponse.json(
        { error: `Supabase error: ${error.message}` },
        { status: 500 }
      );
    }

    // ✅ Send welcome email AFTER successful insert
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM,
          to: [email],
          subject: "Welcome to TripFind 🎉",
          html: `
            <div style="font-family:system-ui,Arial,sans-serif;line-height:1.6;color:#111">
              <h2>Welcome to TripFind 🎉</h2>

              <p>
                You’re officially on the TripFind waitlist — thanks for joining early.
              </p>

              <p>
                As a thank-you, you’ve unlocked
                <strong>1 month of TripFind Premium — completely free</strong>.
              </p>

              <p>
                Your Premium access will become available once TripFind launches.
                We’ll notify you by email as soon as everything is live.
              </p>

              <p>
                With Premium, you’ll be able to discover better trips,
                get smarter recommendations, and access exclusive features.
              </p>

              <p>-</p>

              <p>
                Until then, follow us for updates and sneak peeks.
              </p>

              <div style="margin-top:12px">
                <a
                  href="https://www.instagram.com/tripfind.app?igsh=ZWUwaDQ2d2RhbWlw"
                  target="_blank"
                  style="margin-right:12px;text-decoration:none"
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.png"
                    alt="Instagram"
                    width="22"
                    height="22"
                    style="vertical-align:middle"
                  />
                </a>

                <a
                  href="https://www.tiktok.com/@tripfind.app?_r=1&_t=ZN-93okj5KIqKU"
                  target="_blank"
                  style="text-decoration:none"
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.png"
                    alt="TikTok"
                    width="22"
                    height="22"
                    style="vertical-align:middle"
                  />
                </a>
              </div>

              <p style="margin-top:28px;font-size:14px;color:#666">
                If you didn’t sign up for TripFind, you can safely ignore this email.
              </p>
            </div>
          `,
        });
      } catch (err) {
        console.error("Resend email failed:", err);
      }
    }

    return NextResponse.json({
      ok: true,
      message: "You're on the waitlist! 🎉",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
