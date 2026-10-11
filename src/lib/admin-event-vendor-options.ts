import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApplicationType } from "@/data/events";

export type EventVendorOptionInput = {
  id: string | null;
  applicationType: ApplicationType;
  name: string;
  description: string;
  price: number;
  capacity: number | null;
  active: boolean;
  sortOrder: number;
};

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionsForType(
  formData: FormData,
  applicationType: ApplicationType,
) {
  const count = Number(readString(formData, `${applicationType}OptionCount`) || 0);
  const options: EventVendorOptionInput[] = [];

  for (let index = 0; index < count; index += 1) {
    const prefix = `${applicationType}Option:${index}`;
    const name = readString(formData, `${prefix}:name`);
    const price = Number(readString(formData, `${prefix}:price`) || 0);
    const capacityValue = readString(formData, `${prefix}:capacity`);
    const capacity = capacityValue ? Number(capacityValue) : null;

    if (!name) continue;
    if (!Number.isFinite(price) || price < 0) {
      throw new Error(`${name} needs a valid price.`);
    }
    if (capacity !== null && (!Number.isInteger(capacity) || capacity < 1)) {
      throw new Error(`${name} needs a valid capacity or no capacity at all.`);
    }

    options.push({
      id: readString(formData, `${prefix}:id`) || null,
      applicationType,
      name,
      description: readString(formData, `${prefix}:description`),
      price,
      capacity,
      active: formData.get(`${prefix}:active`) === "on",
      sortOrder: index,
    });
  }

  return options;
}

export function readEventVendorOptions(formData: FormData) {
  return [
    ...optionsForType(formData, "vendor"),
    ...optionsForType(formData, "food"),
  ];
}

export function validateEnabledVendorOptions(
  options: EventVendorOptionInput[],
  generalEnabled: boolean,
  foodEnabled: boolean,
) {
  if (
    generalEnabled &&
    !options.some((option) => option.applicationType === "vendor" && option.active)
  ) {
    throw new Error("Add at least one active general vendor option before opening general applications.");
  }

  if (
    foodEnabled &&
    !options.some((option) => option.applicationType === "food" && option.active)
  ) {
    throw new Error("Add at least one active food vendor option before opening food applications.");
  }
}

export async function saveEventVendorOptions(
  supabase: SupabaseClient,
  eventId: string,
  options: EventVendorOptionInput[],
) {
  const { data: existing, error: existingError } = await supabase
    .from("event_vendor_options")
    .select("id")
    .eq("event_id", eventId);

  if (existingError) throw new Error(existingError.message);

  const retainedIds = new Set(options.flatMap((option) => option.id ? [option.id] : []));
  const removedIds = (existing || [])
    .map((option) => option.id as string)
    .filter((id) => !retainedIds.has(id));

  if (removedIds.length) {
    const { error } = await supabase
      .from("event_vendor_options")
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq("event_id", eventId)
      .in("id", removedIds);
    if (error) throw new Error(error.message);
  }

  for (const option of options) {
    const values = {
      event_id: eventId,
      application_type: option.applicationType,
      name: option.name,
      description: option.description,
      price: option.price,
      capacity: option.capacity,
      active: option.active,
      sort_order: option.sortOrder,
      updated_at: new Date().toISOString(),
    };

    const result = option.id
      ? await supabase
          .from("event_vendor_options")
          .update(values)
          .eq("event_id", eventId)
          .eq("id", option.id)
      : await supabase.from("event_vendor_options").insert(values);

    if (result.error) throw new Error(result.error.message);
  }
}
