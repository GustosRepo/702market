"use client";

import { useState } from "react";
import type { ApplicationType, EventVendorOption } from "@/data/events";
import { AdminConfirmButton } from "@/components/admin-confirm-action";

type EditableOption = Omit<EventVendorOption, "id"> & { id: string };

type EventVendorOptionsEditorProps = {
  applicationType: ApplicationType;
  initialOptions?: EventVendorOption[];
};

function blankOption(applicationType: ApplicationType, sortOrder: number): EditableOption {
  return {
    id: "",
    applicationType,
    name: "",
    description: "",
    price: 0,
    capacity: null,
    active: true,
    sortOrder,
  };
}

export default function EventVendorOptionsEditor({
  applicationType,
  initialOptions = [],
}: EventVendorOptionsEditorProps) {
  const [options, setOptions] = useState<EditableOption[]>(
    initialOptions.length
      ? initialOptions
      : [blankOption(applicationType, 0)],
  );

  return (
    <div className="admin-option-editor">
      <input name={`${applicationType}OptionCount`} type="hidden" value={options.length} />
      {options.map((option, index) => {
        const prefix = `${applicationType}Option:${index}`;
        return (
          <article className="admin-option-row" key={option.id || `${applicationType}-${index}`}>
            <input name={`${prefix}:id`} type="hidden" value={option.id} />
            <input name={`${prefix}:sortOrder`} type="hidden" value={index} />
            <div className="form-grid two-column">
              <label>
                Option name
                <input
                  name={`${prefix}:name`}
                  onChange={(event) => setOptions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))}
                  placeholder={applicationType === "food" ? "Food Truck" : "Standard Space"}
                  value={option.name}
                />
              </label>
              <label>
                Price
                <input
                  min="0"
                  name={`${prefix}:price`}
                  onChange={(event) => setOptions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, price: Number(event.target.value) } : item))}
                  step="0.01"
                  type="number"
                  value={option.price}
                />
              </label>
            </div>
            <label>
              Description
              <input
                name={`${prefix}:description`}
                onChange={(event) => setOptions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item))}
                placeholder="Space size or setup details"
                value={option.description}
              />
            </label>
            <label>
              Capacity <small>(optional)</small>
              <input
                min="1"
                name={`${prefix}:capacity`}
                onChange={(event) => setOptions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, capacity: event.target.value ? Number(event.target.value) : null } : item))}
                placeholder="No limit"
                type="number"
                value={option.capacity ?? ""}
              />
            </label>
            <div className="admin-option-controls">
              <label className="checkbox-label">
                <input
                  checked={option.active}
                  name={`${prefix}:active`}
                  onChange={(event) => setOptions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, active: event.target.checked } : item))}
                  type="checkbox"
                />
                Active
              </label>
              <AdminConfirmButton
                confirmLabel="Remove option"
                message={`Remove “${option.name || "this option"}” from the editor? Existing applications will keep their saved selection.`}
                onConfirm={() => setOptions((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                title="Remove vendor option?"
                tone="danger"
                triggerLabel="Remove"
              />
            </div>
          </article>
        );
      })}
      <button
        className="button button-dark"
        onClick={() => setOptions((current) => [...current, blankOption(applicationType, current.length)])}
        type="button"
      >
        + Add {applicationType === "food" ? "food" : "vendor"} option
      </button>
    </div>
  );
}
