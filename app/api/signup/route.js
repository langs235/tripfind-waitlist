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
    const origin = body?.origin || null; // save "Europe" / "US" / "Other"

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
      .insert([{ email, origin }]); // insert origin too

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

    // Send welcome email AFTER successful insert
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM,
          to: [email],
          subject: "Early access confirmed",
          html: `
            <!-- Preview Text -->
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
              Your free Premium month is secured.
            </div>

            <div style="font-family:system-ui,Arial,sans-serif;line-height:1.6;color:#111;">
              
              <h2 style="margin-bottom:16px;">
                You're officially on the TripFind waitlist
              </h2>

              <p>
                Thanks for signing up for <strong>TripFind</strong>.
              </p>

              <p>
                We’re building a smarter way to plan trips - no endless tabs, no overwhelm,
                just personalized travel in seconds.
              </p>

              <p>
                As an early subscriber, you’ll receive 
                <strong>one month of Premium completely free</strong> when we launch.
              </p>

              <p>
                We’re working behind the scenes to make travel planning faster, simpler,
                and more personal - and we can’t wait to share it with you.
              </p>

              <p>
                We’ll let you know as soon as TripFind goes live 🚀
              </p>

              <p style="font-size:14px;color:#666;margin-top:24px;">
                If you didn’t sign up for TripFind, you can safely ignore this email.
              </p>

              <p style="margin-top:32px;">
                <strong>The TripFind Team</strong><br/>
                tripfind.net
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

  } catch (err) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
