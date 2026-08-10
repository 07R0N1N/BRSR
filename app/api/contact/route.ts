import { NextResponse } from "next/server";
import { Resend } from "resend";

// Public, unauthenticated marketing contact form (demo request + tool suggestion).
// No leads table exists yet, so a successful send is logged server-side as
// the only fallback record.
const CONTACT_RECIPIENT = "hello@brsr.co.in";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGE_MAX_LENGTH = 1000;
const IDEA_MAX_LENGTH = 2000;

const ALLOWED_PROBLEMS = new Set([
  "Coordinating BRSR data collection across departments",
  "Currently using spreadsheets and it's chaotic",
  "Don't have visibility into what's missing or incomplete",
  "Need help with the actual export/filing format",
  "Curious about peer benchmarking",
  "Not sure where to start with BRSR",
]);

interface ContactRequestBody {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  problems?: unknown;
  message?: unknown;
  idea?: unknown;
  // "demo" (default) or "suggest". Missing/unrecognized → "demo".
  type?: unknown;
  // Honeypot field: real users never fill this in (it's hidden in the UI).
  // Bots that blindly fill every field will trip it. Any non-empty value
  // here is treated as spam and silently-but-explicitly rejected.
  website?: unknown;
}

export async function POST(request: Request) {
  let body: ContactRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Honeypot check — reject bots before doing any real validation work.
  // Applies identically to both demo and suggest submissions.
  const honeypot = typeof body.website === "string" ? body.website.trim() : "";
  if (honeypot) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const type = body.type === "suggest" ? "suggest" : "demo";

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  let subject: string;
  let html: string;
  let logPayload: Record<string, unknown>;

  if (type === "suggest") {
    const idea =
      typeof body.idea === "string" ? body.idea.trim().slice(0, IDEA_MAX_LENGTH) : "";
    if (!idea) {
      return NextResponse.json({ error: "Idea is required" }, { status: 400 });
    }

    subject = `Tool suggestion from ${name}`;
    html = `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Idea:</strong></p>
      <p>${escapeHtml(idea)}</p>
    `;
    logPayload = { type, name, email, idea };
  } else {
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const rawProblems = Array.isArray(body.problems) ? body.problems : [];
    const rawMessage = typeof body.message === "string" ? body.message : "";

    if (!company) {
      return NextResponse.json(
        { error: "Name, email, and company are required" },
        { status: 400 }
      );
    }

    if (!rawProblems.every((p): p is string => typeof p === "string" && ALLOWED_PROBLEMS.has(p))) {
      return NextResponse.json({ error: "Invalid problem selection" }, { status: 400 });
    }
    const problems = rawProblems as string[];
    const message = rawMessage.trim().slice(0, MESSAGE_MAX_LENGTH);

    const problemsHtml = problems.length
      ? `<ul>${problems.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>`
      : "<p>(none selected)</p>";

    subject = `Demo request from ${company}`;
    html = `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Company:</strong> ${escapeHtml(company)}</p>
      <p><strong>Problems:</strong></p>
      ${problemsHtml}
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message) || "(none)"}</p>
    `;
    logPayload = { type, name, email, company, problems, message };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is not configured");
    return NextResponse.json({ error: "Email service is not configured" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: "BRSR Central <notifications@brsr.co.in>",
    to: CONTACT_RECIPIENT,
    replyTo: email,
    subject,
    html,
  });

  if (error) {
    console.error("Contact form: Resend send failed", error, logPayload);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 502 });
  }

  // Only reached once Resend has confirmed the send. This log is the
  // fallback record of the lead since there is no leads table.
  console.log("Contact form submission sent", {
    resendId: data?.id,
    ...logPayload,
  });

  return NextResponse.json({ ok: true });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
