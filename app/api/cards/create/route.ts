import { NextResponse } from "next/server";
import { cardSchema } from "@/lib/zod-schemas";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = cardSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const shortcode = `tap${Math.floor(1000 + Math.random() * 9000)}`;

  return NextResponse.json({
    ok: true,
    data: {
      ...parsed.data,
      shortcode,
      tap_url: `https://tap.shuttlup.com/t/${shortcode}`,
    },
  });
}
