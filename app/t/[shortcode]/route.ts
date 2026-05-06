import { NextResponse } from "next/server";
import { getPublicProfileByShortcode } from "@/lib/public-profile-server";
import { parseUserAgent } from "@/lib/analytics";

export async function GET(request: Request, { params }: { params: Promise<{ shortcode: string }> }) {
  const { shortcode } = await params;
  if (!/^[a-zA-Z0-9_-]{3,32}$/.test(shortcode)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const profile = await getPublicProfileByShortcode(shortcode);

  if (!profile) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const ua = request.headers.get("user-agent");
  const details = parseUserAgent(ua);
  console.info("tap-event", { shortcode, ...details });

  return NextResponse.redirect(new URL(`/${profile.username}`, request.url));
}
