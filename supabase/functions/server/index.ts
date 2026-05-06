// @ts-nocheck
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey", "x-client-info"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Explicit OPTIONS handler for preflight requests
app.options("/*", (c) => {
  return c.text("", 204);
});

// Health check
app.get("/server/make-server-fb6c0f85/health", (c) => c.json({ status: "ok" }));

// Send email via Resend
const sendEmail = async (opts: {
  to: string;
  cc?: string;
  replyTo: string;
  subject: string;
  html: string;
}): Promise<void> => {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email send");
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Shutt'L Up  Website <noreply@shuttlup.com>",
      to: [opts.to],
      ...(opts.cc ? { cc: [opts.cc] } : {}),
      reply_to: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Resend error:", res.status, detail);
    throw new Error(`Email delivery failed (${res.status})`);
  }
};

// Build notification email HTML
const buildNotificationHtml = (entry: {
  fullName: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  type: string;
  timestamp: string;
}) => {
  const isDemo = entry.type === "demo";
  const tag = isDemo ? "🗓️ DEMO REQUEST" : "📩 CONTACT MESSAGE";
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
      <div style="background:#f97316;padding:20px 24px;border-radius:8px 8px 0 0">
        <h2 style="margin:0;color:#fff;font-size:18px">${tag} — Shutt'L Up  Website</h2>
      </div>
      <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 8px 8px">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#6b7280;width:120px">Name</td><td style="padding:8px 0;font-weight:600">${entry.fullName}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0"><a href="mailto:${entry.email}" style="color:#f97316">${entry.email}</a></td></tr>
          ${entry.company ? `<tr><td style="padding:8px 0;color:#6b7280">Company</td><td style="padding:8px 0">${entry.company}</td></tr>` : ""}
          <tr><td style="padding:8px 0;color:#6b7280">Subject</td><td style="padding:8px 0">${entry.subject}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280">Type</td><td style="padding:8px 0"><span style="background:${isDemo ? "#fef3c7" : "#e0f2fe"};color:${isDemo ? "#92400e" : "#0369a1"};padding:2px 8px;border-radius:12px;font-size:12px">${entry.type.toUpperCase()}</span></td></tr>
          <tr><td style="padding:8px 0;color:#6b7280">Submitted</td><td style="padding:8px 0">${new Date(entry.timestamp).toLocaleString("en-US", { timeZone: "UTC" })} UTC</td></tr>
        </table>
        <hr style="margin:20px 0;border:none;border-top:1px solid #e5e7eb"/>
        <p style="margin:0 0 8px;color:#6b7280;font-size:13px">Message:</p>
        <div style="background:#f9fafb;padding:16px;border-radius:6px;white-space:pre-wrap;font-size:14px">${entry.message}</div>
        <p style="margin:20px 0 0;font-size:12px;color:#9ca3af">Reply directly to this email to respond to ${entry.fullName}.</p>
      </div>
    </div>`;
};

// Contact / Demo request submission
const contactHandler = async (c) => {
  try {
    const body = await c.req.json();
    const { fullName, email, company, subject, message, type } = body;

    if (!fullName || !email || !subject || !message) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const entry = {
      id,
      fullName,
      email,
      company: company || "",
      subject,
      message,
      type: type || "contact",
      timestamp,
    };

    // Store the message — non-fatal if kv fails
    try {
      await kv.set(`contact_${id}`, entry);
      const index: string[] = (await kv.get("contact_index")) || [];
      index.push(id);
      await kv.set("contact_index", index);
    } catch (kvErr) {
      console.error("KV storage error (non-fatal):", kvErr);
    }

    // Send notification email — non-fatal
    try {
      await sendEmail({
        to: "info@shuttlup.com",
        cc: "advillanuevajr@gmail.com",
        replyTo: email,
        subject: `[${entry.type === "demo" ? "Demo Request" : "Contact"}] ${subject} — from ${fullName}`,
        html: buildNotificationHtml(entry),
      });
    } catch (emailErr) {
      console.error("Email send error (non-fatal):", String(emailErr));
    }

    return c.json({ success: true, message: "Your message has been received. We'll be in touch shortly!" });
  } catch (err) {
    console.error("Contact form error:", String(err));
    return c.json({ error: "Internal server error", detail: String(err) }, 500);
  }
};

// Register contact route
app.post("/server/make-server-fb6c0f85/contact", contactHandler);

Deno.serve(app.fetch);