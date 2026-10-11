"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type ContactSubmissionType = "contact" | "podcast_story" | "podcast_chisme";
export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContactForm(
  submissionType: ContactSubmissionType,
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (readString(formData, "companyWebsite")) {
    return { status: "success", message: "Thanks. We got it." };
  }

  const firstName = readString(formData, "firstName");
  const lastName = readString(formData, "lastName");
  const email = readString(formData, "email").toLowerCase();
  const subject = readString(formData, "subject");
  const message = readString(formData, "message");

  if (!firstName || !email || !message || (submissionType === "contact" && (!lastName || !subject))) {
    return { status: "error", message: "Please complete every required field." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }
  if (message.length > 5000 || subject.length > 160) {
    return { status: "error", message: "Please shorten your message and try again." };
  }

  const fallbackSubject = submissionType === "podcast_story" ? "Podcast story" : "702 chisme submission";
  const { error } = await createAdminClient().from("contact_submissions").insert({
    submission_type: submissionType,
    first_name: firstName,
    last_name: lastName,
    email,
    subject: subject || fallbackSubject,
    message,
    newsletter_opt_in: formData.get("updates") === "on",
  });

  if (error) {
    console.error("Unable to save contact submission", error);
    return { status: "error", message: "We could not send that right now. Please try again." };
  }

  return {
    status: "success",
    message: submissionType === "contact" ? "Message sent. We will get back to you soon." : "Sent. Thanks for trusting us with it.",
  };
}
