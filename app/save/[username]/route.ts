import { NextResponse } from "next/server";
import { getPublicProfileByUsername } from "@/lib/public-profile-server";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { buildVCard } from "@/lib/vcard";

export async function GET(_request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(username);

  if (!profile) {
    return new NextResponse("Profile not found", { status: 404 });
  }

  // Save trigger: count every successful vCard download request.
  const supabase = await getSupabaseServerClient();
  await supabase.from("tap_saves").insert({ profile_id: profile.id });

  const vcard = buildVCard(profile);
  return new NextResponse(vcard, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename=${profile.username}.vcf`,
    },
  });
}
