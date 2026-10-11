"use server";

import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ApplicationType } from "@/data/events";
import { sendApplicationConfirmationEmail } from "@/lib/application-email";

export type ApplicationFormState = {
  status: "idle" | "success" | "error";
  message: string;
  referenceCode?: string;
  businessName?: string;
};

const APPLICATION_BUCKET = "application-images";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TOTAL_FILE_SIZE = 45 * 1024 * 1024;
const MAX_FILES = 12;
const ALLOWED_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readFiles(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function safeFileName(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() || "file";
  const base = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "upload"}.${extension}`;
}

function losAngelesDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function referenceCode() {
  return `MKT-${Date.now().toString(36).slice(-6)}-${randomUUID().slice(0, 4)}`.toUpperCase();
}

function validateFiles(files: File[]) {
  if (files.length > MAX_FILES) return "Please upload no more than 12 files.";
  if (files.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_FILE_SIZE) {
    return "Please keep all uploads together under 45MB.";
  }

  for (const file of files) {
    if (!ALLOWED_FILE_TYPES.has(file.type)) {
      return `${file.name} must be a JPG, PNG, WebP, or PDF.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name} must be 10MB or smaller.`;
    }
  }

  return null;
}

function validateFields(formData: FormData, applicationType: ApplicationType) {
  const common = ["firstName", "lastName", "email", "phone", "businessName", "vendorOptionId"];
  const required = applicationType === "food"
    ? [...common, "foodMenu", "setupMeasurements", "healthDepartmentNumber", "businessLicenseNumber"]
    : [...common, "category", "productDescription", "businessLicenseNumber"];

  if (required.some((field) => !readString(formData, field))) {
    return "Please complete every required field before submitting.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(readString(formData, "email"))) {
    return "Please enter a valid email address.";
  }

  const website = readString(formData, "website");
  if (website) {
    try {
      const url = new URL(website);
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        return "Website links must start with http:// or https://.";
      }
    } catch {
      return "Please enter a valid website URL.";
    }
  }

  if (formData.get("rulesAcknowledged") !== "on") {
    return "Please acknowledge the event rules before submitting.";
  }

  const businessLicense = readFiles(formData, "businessLicense");
  const setupPhotos = readFiles(formData, "setupPhotos");
  if (!businessLicense.length || !setupPhotos.length) {
    return "Upload your business license and at least one setup or product photo.";
  }

  if (applicationType === "food") {
    if (!readFiles(formData, "healthPermit").length || !readFiles(formData, "logo").length) {
      return "Food vendors must upload a health permit and logo.";
    }
  }

  const allFiles = [
    ...businessLicense,
    ...setupPhotos,
    ...readFiles(formData, "healthPermit"),
    ...readFiles(formData, "logo"),
    ...readFiles(formData, "productPhotos"),
    ...readFiles(formData, "menuFile"),
  ];

  return validateFiles(allFiles);
}

async function uploadApplicationFiles(
  applicationId: string,
  formData: FormData,
) {
  const supabase = createAdminClient();
  const groups = [
    ["businessLicense", "business_license"],
    ["setupPhotos", "setup_photo"],
    ["healthPermit", "health_permit"],
    ["logo", "logo"],
    ["productPhotos", "product_photo"],
    ["menuFile", "menu"],
  ] as const;
  const uploadedPaths: string[] = [];
  const metadata = [];
  let sortOrder = 0;

  try {
    for (const [field, documentType] of groups) {
      for (const file of readFiles(formData, field)) {
        const storagePath = `${applicationId}/${documentType}/${randomUUID()}-${safeFileName(file.name)}`;
        const { error } = await supabase.storage
          .from(APPLICATION_BUCKET)
          .upload(storagePath, file, { contentType: file.type, upsert: false });

        if (error) throw new Error(error.message);
        uploadedPaths.push(storagePath);
        metadata.push({
          application_id: applicationId,
          storage_path: storagePath,
          document_type: documentType,
          original_name: file.name,
          mime_type: file.type,
          size_bytes: file.size,
          sort_order: sortOrder,
        });
        sortOrder += 1;
      }
    }

    if (metadata.length) {
      const { error } = await supabase.from("application_images").insert(metadata);
      if (error) throw new Error(error.message);
    }
  } catch (error) {
    if (uploadedPaths.length) {
      await supabase.storage.from(APPLICATION_BUCKET).remove(uploadedPaths);
    }
    throw error;
  }
}

export async function submitVendorApplication(
  eventSlug: string,
  applicationType: ApplicationType,
  _previousState: ApplicationFormState,
  formData: FormData,
): Promise<ApplicationFormState> {
  if (applicationType !== "vendor" && applicationType !== "food") {
    return { status: "error", message: "Choose a valid application type." };
  }

  const validationError = validateFields(formData, applicationType);
  if (validationError) return { status: "error", message: validationError };

  const supabase = createAdminClient();
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, title, event_date, application_open_date, application_deadline, status, published, general_applications_enabled, food_applications_enabled")
    .eq("slug", eventSlug)
    .is("archived_at", null)
    .maybeSingle();

  if (eventError || !event || !event.published) {
    return { status: "error", message: "This event is not available for applications." };
  }

  const enabled = applicationType === "food"
    ? event.food_applications_enabled
    : event.general_applications_enabled;
  const today = losAngelesDate();
  if (
    !enabled ||
    event.status !== "upcoming" ||
    (event.application_open_date && today < event.application_open_date) ||
    (event.application_deadline && today > event.application_deadline)
  ) {
    return { status: "error", message: "Applications are currently closed for this event." };
  }

  const vendorOptionId = readString(formData, "vendorOptionId");
  const { data: vendorOption, error: optionError } = await supabase
    .from("event_vendor_options")
    .select("id, name, price")
    .eq("id", vendorOptionId)
    .eq("event_id", event.id)
    .eq("application_type", applicationType)
    .eq("active", true)
    .maybeSingle();

  if (optionError || !vendorOption) {
    return { status: "error", message: "That vendor option is no longer available. Refresh and choose another option." };
  }

  const token = readString(formData, "submissionToken") || randomUUID();
  const businessName = readString(formData, "businessName");
  const code = referenceCode();
  const foodMenu = readString(formData, "foodMenu");
  const { data: application, error: insertError } = await supabase
    .from("applications")
    .insert({
      event_id: event.id,
      application_type: applicationType,
      first_name: readString(formData, "firstName"),
      last_name: readString(formData, "lastName"),
      email: readString(formData, "email"),
      phone: readString(formData, "phone"),
      business_name: businessName,
      instagram: readString(formData, "instagram") || null,
      website: readString(formData, "website") || null,
      category: applicationType === "food" ? "Food" : readString(formData, "category"),
      product_description: applicationType === "food" ? foodMenu : readString(formData, "productDescription"),
      food_menu: applicationType === "food" ? foodMenu : null,
      price_range: readString(formData, "priceRange"),
      booth_type: vendorOption.name,
      vendor_option_id: vendorOption.id,
      vendor_option_name: vendorOption.name,
      electricity_required: false,
      special_requests: readString(formData, "specialRequests") || null,
      business_license_number: readString(formData, "businessLicenseNumber"),
      setup_measurements: applicationType === "food" ? readString(formData, "setupMeasurements") : null,
      health_department_number: applicationType === "food" ? readString(formData, "healthDepartmentNumber") : null,
      rules_acknowledged: true,
      rules_acknowledged_at: new Date().toISOString(),
      application_fee: Number(vendorOption.price),
      status: "submitted",
      payment_status: "unpaid",
      reference_code: code,
      submission_token: token,
    })
    .select("id, reference_code")
    .single();

  if (insertError) {
    if (insertError.code === "P0001") {
      return { status: "error", message: insertError.message || "That vendor option is full." };
    }
    if (insertError.code === "23505") {
      const { data: existing } = await supabase
        .from("applications")
        .select("reference_code, business_name")
        .eq("submission_token", token)
        .maybeSingle();
      if (existing) {
        return {
          status: "success",
          message: "Your application was already received.",
          referenceCode: existing.reference_code,
          businessName: existing.business_name,
        };
      }
    }
    console.error("Unable to submit vendor application", insertError);
    return { status: "error", message: "We could not submit the application. Please try again." };
  }

  try {
    await uploadApplicationFiles(application.id, formData);
  } catch (error) {
    console.error("Unable to upload application files", error);
    await supabase.from("applications").delete().eq("id", application.id);
    return { status: "error", message: "One or more files could not be uploaded. Check the file type and size, then try again." };
  }

  try {
    await sendApplicationConfirmationEmail({
      to: readString(formData, "email"),
      firstName: readString(formData, "firstName"),
      businessName,
      eventTitle: event.title,
      eventDate: event.event_date,
      applicationType,
      referenceCode: application.reference_code,
    });
  } catch (error) {
    console.error("Application saved but confirmation email failed", error);
  }

  return {
    status: "success",
    message: "Submission does not automatically mean acceptance. The MarketElla team will review your application and follow up.",
    referenceCode: application.reference_code,
    businessName,
  };
}
