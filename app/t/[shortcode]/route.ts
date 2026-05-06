import { NextResponse } from "next/server";
import { getPublicProfileByShortcode, recordShortcodeAccess } from "@/lib/public-profile-server";

export async function GET(request: Request, { params }: { params: Promise<{ shortcode: string }> }) {
  const { shortcode } = await params;
  if (!/^[a-zA-Z0-9_-]{3,32}$/.test(shortcode)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const profile = await getPublicProfileByShortcode(shortcode);

  if (!profile) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  await recordShortcodeAccess(shortcode, "tap", request.headers);

  return NextResponse.redirect(new URL(`/${profile.username}`, request.url));
}
