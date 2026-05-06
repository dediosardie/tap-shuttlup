import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function isAdminPath(pathname: string) {
  return pathname.startsWith("/admin");
}

function isDashboardPath(pathname: string) {
  return pathname.startsWith("/dashboard");
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isDashboardPath(request.nextUrl.pathname) && !user) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  if (isAdminPath(request.nextUrl.pathname)) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    const role = user.app_metadata?.role as string | undefined;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
