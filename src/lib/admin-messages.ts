import { cache } from "react";
import { createAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";

export type AdminMessage = {
  id: string;
  type: "contact" | "podcast_story" | "podcast_chisme";
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  newsletterOptIn: boolean;
  status: "new" | "read" | "archived";
  submittedAt: string;
};

export const getAdminMessages = cache(async (includeArchived = false): Promise<AdminMessage[]> => {
  if (!hasSupabaseAdminEnv()) return [];

  const supabase = createAdminClient();
  let query = supabase
    .from("contact_submissions")
    .select("id, submission_type, first_name, last_name, email, subject, message, newsletter_opt_in, status, created_at")
    .order("created_at", { ascending: false });
  if (!includeArchived) query = query.neq("status", "archived");

  const { data, error } = await query;
  if (error) {
    console.error("Unable to load messages", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    type: row.submission_type,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    newsletterOptIn: row.newsletter_opt_in,
    status: row.status,
    submittedAt: new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(row.created_at)),
  }));
});
