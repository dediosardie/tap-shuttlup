import { NextResponse } from "next/server";
import { tapEventSchema } from "@/lib/zod-schemas";
import { parseUserAgent } from "@/lib/analytics";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const limiter = checkRateLimit(`tap:${ip}`, 120, 60_000);
  if (!limiter.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const payload = await request.json();
  const parsed = tapEventSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const ua = request.headers.get("user-agent");
  const device = parseUserAgent(ua);

  return NextResponse.json({
    ok: true,
    shortcode: parsed.data.shortcode,
    device,
    remaining: limiter.remaining,
    trackedAt: new Date().toISOString(),
  });
}
