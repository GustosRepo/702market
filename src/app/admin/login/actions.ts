"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getAdminEmails, hasSupabaseEnv, isAdminEmail } from "@/lib/admin-auth";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
  getAdminSessionCookieOptions,
  hasAdminSessionSecret,
} from "@/lib/admin-session";
import { createClient } from "@/lib/supabase/server";

export type LoginFormState = {
  message: string;
};

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function loginAdmin(
  _previousState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  if (!hasSupabaseEnv()) {
    return {
      message:
        "Supabase is not configured yet. Add the project URL and publishable key to .env.local.",
    };
  }

  if (getAdminEmails().length === 0) {
    return {
      message:
        "No admin emails are configured. Add ADMIN_EMAILS to .env.local.",
    };
  }

  if (!hasAdminSessionSecret()) {
    return {
      message:
        "Admin session security is not configured. Add ADMIN_SESSION_SECRET to .env.local.",
    };
  }

  const email = readString(formData, "email").toLowerCase();
  const password = readString(formData, "password");

  if (!email || !password || email.length > 254 || password.length > 1024) {
    return { message: "Enter your admin email and password." };
  }

  if (!isAdminEmail(email)) {
    return { message: "The email or password is incorrect." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: "The email or password is incorrect." };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !isAdminEmail(user?.email)) {
    await supabase.auth.signOut();
    return { message: "The email or password is incorrect." };
  }

  const issuedAt = Date.now();
  const sessionValue = await createAdminSessionValue(issuedAt, issuedAt);

  if (!sessionValue) {
    await supabase.auth.signOut();
    return { message: "Admin session security is not configured." };
  }

  const cookieStore = await cookies();
  cookieStore.set(
    ADMIN_SESSION_COOKIE,
    sessionValue,
    getAdminSessionCookieOptions(issuedAt),
  );

  redirect("/admin");
}
