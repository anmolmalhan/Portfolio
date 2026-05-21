"use server";

import { headers } from "next/headers";

import { redirect } from "next/navigation";

export type ContactResult =
  | { ok: true; mode: "sent" }
  | { ok: true; mode: "mailto" }
  | { ok: false; error: string };

const RESEND_ENDPOINT = "https://api.resend.com/emails";

// In-memory rate limit: max 3 successful sends per IP per 10 minutes.
// Lives in the function instance. Fluid Compute reuses instances, so this
// shares state across nearby requests on the same warm container. For a
// hardened deployment, swap for Upstash KV.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 3;
const ipHits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX) {
    ipHits.set(ip, arr);
    return true;
  }
  arr.push(now);
  ipHits.set(ip, arr);
  return false;
}

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  message: string;
  // Honeypot. bots fill hidden fields. Real users leave it empty.
  website?: string;
}): Promise<ContactResult> {
  const name = payload.name.trim();
  const email = payload.email.trim();
  const message = payload.message.trim();

  if (payload.website && payload.website.length > 0) {
    return { ok: true, mode: "sent" }; // pretend-success for bots
  }

  if (!name || !email || !message) {
    return { ok: false, error: "All fields are required." };
  }
  if (name.length > 200) {
    return { ok: false, error: "Name is too long." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (message.length > 5000) {
    return { ok: false, error: "Message is too long (max 5000 chars)." };
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "unknown";
  if (rateLimited(ip)) {
    return { ok: false, error: "Too many requests. Please try again later." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  // No backend creds configured. tell the client to fall back to mailto.
  if (!apiKey || !to || !from) {
    return { ok: true, mode: "mailto" };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: [email],
        subject: `Portfolio inquiry from ${name}`,
        text: `${message}\n\nFrom: ${name}\n${email}`,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Resend error", res.status, text);
      return { ok: false, error: "Mail delivery failed. Please try again later." };
    }
    return { ok: true, mode: "sent" };
  } catch (err) {
    console.error("Contact send error", err);
    return { ok: false, error: "Network error. Please try again later." };
  }
}

// Progressive-enhancement wrapper. Used by `<form action={sendContactForm}>`
// so visitors without JS get a real submission (and a redirect with status).
export async function sendContactForm(formData: FormData): Promise<void> {
  const result = await sendContactMessage({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  });
  redirect(
    result.ok
      ? `/contact?status=ok&mode=${result.mode}`
      : `/contact?status=err&msg=${encodeURIComponent(result.error)}`
  );
}
