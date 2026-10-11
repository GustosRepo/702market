import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
  getAdminSessionCookieOptions,
  getExpiredAdminSessionCookieOptions,
  hasAdminSessionSecret,
  validateAdminSessionValue,
} from "@/lib/admin-session";

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  return getAdminEmails().includes(email.toLowerCase());
}

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    return NextResponse.next();
  }

  if (!hasSupabaseEnv() || !hasAdminSessionSecret()) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const now = Date.now();
  const adminSession = await validateAdminSessionValue(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
    now,
  );

  if (!adminSession.valid) {
    const redirectResponse = NextResponse.redirect(
      new URL("/admin/login", request.url),
    );
    redirectResponse.cookies.set(
      ADMIN_SESSION_COOKIE,
      "",
      getExpiredAdminSessionCookieOptions(),
    );
    return redirectResponse;
  }

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    const redirectResponse = NextResponse.redirect(
      new URL("/admin/login", request.url),
    );

    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  const refreshedAdminSession = await createAdminSessionValue(
    adminSession.issuedAt,
    now,
  );

  if (!refreshedAdminSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    refreshedAdminSession,
    getAdminSessionCookieOptions(adminSession.issuedAt),
  );

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
