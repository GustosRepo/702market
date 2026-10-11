"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  getExpiredAdminSessionCookieOptions,
} from "@/lib/admin-session";
import { createClient } from "@/lib/supabase/server";

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const cookieStore = await cookies();
  cookieStore.set(
    ADMIN_SESSION_COOKIE,
    "",
    getExpiredAdminSessionCookieOptions(),
  );
  redirect("/admin/login");
}
