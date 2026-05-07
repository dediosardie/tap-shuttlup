import { NextResponse } from "next/server";
import { getPublicProfileByShortcode, recordShortcodeAccess } from "@/lib/public-profile-server";
import { createSourceToken } from "@/lib/source-token";

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
  const token = createSourceToken(profile.username, "tap");
  const query = token ? `?src=tap&st=${encodeURIComponent(token)}` : "?src=tap";

  return NextResponse.redirect(new URL(`/${profile.username}${query}`, request.url));
}
