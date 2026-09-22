"use server";

import { createClient } from "@/lib/supabase/server";

export type ApplicationFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const requiredFields = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "businessName",
  "category",
  "productDescription",
  "priceRange",
  "boothType",
] as const;

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

function validateApplication(formData: FormData) {
  for (const field of requiredFields) {
    if (!readString(formData, field)) {
      return "Please complete every required field before sending.";
    }
  }

  const email = readString(formData, "email");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address.";
  }

  const website = readString(formData, "website");
  if (website) {
    try {
      const url = new URL(website);
      if (!["http:", "https:"].includes(url.protocol)) {
        return "Website links must start with http:// or https://.";
      }
    } catch {
      return "Please enter a valid website URL.";
    }
  }

  if (formData.get("agreement") !== "on") {
    return "Please agree to the vendor rules before sending.";
  }

  return null;
}

export async function submitApplication(
  eventSlug: string,
  _previousState: ApplicationFormState,
  formData: FormData,
): Promise<ApplicationFormState> {
  if (!hasSupabaseEnv()) {
    return {
      status: "error",
      message:
        "Supabase is not connected yet. Add the project URL and publishable key to .env.local, then try again.",
    };
  }

  const validationError = validateApplication(formData);
  if (validationError) {
    return { status: "error", message: validationError };
  }

  const supabase = await createClient();
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, application_fee, applications_enabled")
    .eq("slug", eventSlug)
    .eq("published", true)
    .maybeSingle();

  if (eventError || !event) {
    return {
      status: "error",
      message:
        "We could not find this event in Supabase. Make sure the event seed has been run and published.",
    };
  }

  if (!event.applications_enabled) {
    return {
      status: "error",
      message: "Applications are currently closed for this event.",
    };
  }

  const { error } = await supabase.from("applications").insert({
    event_id: event.id,
    first_name: readString(formData, "firstName"),
    last_name: readString(formData, "lastName"),
    email: readString(formData, "email"),
    phone: readString(formData, "phone"),
    business_name: readString(formData, "businessName"),
    instagram: readString(formData, "instagram") || null,
    website: readString(formData, "website") || null,
    category: readString(formData, "category"),
    product_description: readString(formData, "productDescription"),
    price_range: readString(formData, "priceRange"),
    booth_type: readString(formData, "boothType"),
    electricity_required: formData.get("electricity") === "on",
    special_requests: readString(formData, "specialRequests") || null,
    application_fee: event.application_fee,
    status: "pending",
    payment_status: "unpaid",
  });

  if (error) {
    console.error("Unable to submit application", error);
    return {
      status: "error",
      message:
        "Something went wrong while sending your application. Please try again.",
    };
  }

  return {
    status: "success",
    message:
      "Thanks for applying. We received your application and will email you with the next step.",
  };
}
