export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resend } from "../../lib/resend";

// FIXED: Removed ": string" to make this valid JavaScript
function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// FIXED: Removed ": Request" from the parameter
export async function POST(req) {
  try {
    const body = await req.json();

    const email = (body?.email || "").trim().toLowerCase();
    const origin = body?.origin || "Not Specified"; 

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
      // Handle Duplicate Email (Postgres error code 23505)
      if (error.code === "23505") {
        return NextResponse.json({
          ok: true,
          message: "You're already on the waitlist ✅",
        });
      }
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    // Send welcome email AFTER successful insert
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM,
          to: email,
          subject: "Early access confirmed",
          html: `
            <div style="font-family:system-ui,Arial,sans-serif;line-height:1.6;color:#111;max-width:500px;">
              <h2 style="margin-bottom:16px;">You're officially on the TripFind waitlist</h2>
              <p>Thanks for signing up for <strong>TripFind</strong>.</p>
              <p>We’re building a smarter way to plan trips—no endless tabs, no overwhelm, just personalized travel in seconds.</p>
              <p>As an early subscriber, you’ll receive <strong>one month of Premium completely free</strong> when we launch.</p>
              <p>We’ll let you know as soon as TripFind goes live 🚀</p>
              <p style="margin-top:32px; border-top: 1px solid #eee; padding-top: 24px;">
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
    return NextResponse.json({ error: "Invalid request format." }, { status: 400 });
  }
}
