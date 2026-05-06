import { NextResponse } from "next/server";
import { getDemoProfile } from "@/lib/mock-data";
import { buildVCard } from "@/lib/vcard";

export async function GET(_request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = getDemoProfile(username);

  if (!profile) {
    return new NextResponse("Profile not found", { status: 404 });
  }

  const vcard = buildVCard(profile);
  return new NextResponse(vcard, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename=${profile.username}.vcf`,
    },
  });
}
