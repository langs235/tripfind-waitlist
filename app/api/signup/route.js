export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resend } from "../../lib/resend";


function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const email = (body?.email || "").trim().toLowerCase();
    const origin = body?.origin || null; // ✅ NEW: save "Europe" / "US" / "Other"

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
      .insert([{ email, origin }]); // ✅ NEW: insert origin too

    if (error) {
      // duplicate email
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
            <div style="font-family:system-ui,Arial,sans-serif;line-height:1.6">
              <h2>You're on the waitlist!</h2>
              <p>Thanks for signing up for <strong>TripFind</strong>.</p>
              <p>We'll let you know as soon as we launch 🚀</p>
              <p style="font-size:14px;color:#666">
                If you didn’t sign up, you can safely ignore this email.
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
