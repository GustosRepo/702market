"use server";

import { redirect } from "next/navigation";
import { getAdminEmails, hasSupabaseEnv, isAdminEmail } from "@/lib/admin-auth";
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

  const email = readString(formData, "email").toLowerCase();
  const password = readString(formData, "password");

  if (!email || !password) {
    return { message: "Enter your admin email and password." };
  }

  if (!isAdminEmail(email)) {
    return { message: "This email is not allowed to access the admin." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: "The email or password did not match Supabase Auth." };
  }

  redirect("/admin");
}
