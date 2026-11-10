"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import type { ApplicationType, EventVendorOption } from "@/data/events";
import type { ApplicationFormState } from "./actions";
import { siteConfig } from "@/lib/site-config";

const categories = ["Vintage", "Clothing", "Jewelry", "Art", "Collectibles", "Handmade", "Beauty", "Accessories", "Prepackaged Food", "Other"];
const steps = ["Event", "You", "Business", "Space", "Uploads", "Rules"];

type ApplicationFlowProps = {
  applicationType: ApplicationType;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  options: EventVendorOption[];
  applicationNote: string;
  rules: string;
  submissionToken: string;
  submitAction: (state: ApplicationFormState, formData: FormData) => Promise<ApplicationFormState>;
};

const initialState: ApplicationFormState = { status: "idle", message: "" };

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: value % 1 ? 2 : 0 }).format(value);
}

export default function ApplicationFlow({
  applicationType,
  eventTitle,
  eventDate,
  eventLocation,
  options,
  applicationNote,
  rules,
  submissionToken,
  submitAction,
}: ApplicationFlowProps) {
  const [step, setStep] = useState(0);
  const [state, formAction, pending] = useActionState(submitAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.status === "error") {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      errorRef.current?.focus({ preventScroll: true });
    }
  }, [state]);

  function validateSubmission(event: FormEvent<HTMLFormElement>) {
    const controls = Array.from(
      event.currentTarget.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea"),
    );
    const invalid = controls.find((control) => !control.checkValidity());

    if (!invalid) return;

    event.preventDefault();
    const panel = invalid.closest<HTMLElement>("[data-application-step]");
    const invalidStep = Number(panel?.dataset.applicationStep);
    if (Number.isInteger(invalidStep)) setStep(invalidStep);
    requestAnimationFrame(() => {
      invalid.reportValidity();
      invalid.focus();
    });
  }

  function nextStep() {
    const panel = formRef.current?.querySelector<HTMLElement>(`[data-application-step="${step}"]`);
    const controls = Array.from(panel?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea") || []);
    const invalid = controls.find((control) => !control.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      invalid.focus();
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: formRef.current?.offsetTop || 0, behavior: "smooth" });
  }

  if (state.status === "success") {
    return (
      <section className="application-success" role="status">
        <span className="success-mark" aria-hidden="true">✦</span>
        <p className="eyebrow">Application submitted</p>
        <h2>{state.businessName || "Your business"}<br /><em>is in review.</em></h2>
        <dl className="application-confirmation-list">
          <div><dt>Event</dt><dd>{eventTitle}</dd></div>
          <div><dt>Application</dt><dd>{applicationType === "food" ? "Food vendor" : "General vendor"}</dd></div>
          <div><dt>Reference</dt><dd>{state.referenceCode}</dd></div>
        </dl>
        <p>{state.message}</p>
      </section>
    );
  }

  return (
    <form className="application-form application-flow" action={formAction} onSubmit={validateSubmission} ref={formRef}
      onReset={(event) => {
        // Success replaces the form. Keep fields and files for recoverable errors.
        event.preventDefault();
      }}
    >
      <input name="submissionToken" type="hidden" value={submissionToken} />
      <div className="application-progress" aria-label={`Step ${step + 1} of ${steps.length}`}>
        <span style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>
      <ol className="application-step-labels">
        {steps.map((label, index) => <li className={index === step ? "is-current" : index < step ? "is-complete" : ""} key={label}>{label}</li>)}
      </ol>

      <fieldset data-application-step="0" hidden={step !== 0}>
        <legend>Your application</legend>
        <div className="application-event-summary">
          <p className="eyebrow">{applicationType === "food" ? "Food vendor" : "General vendor"}</p>
          <h2>{eventTitle}</h2>
          <p>{eventDate}<br />{eventLocation}</p>
        </div>
        {applicationNote ? (
          <div className="application-event-note">
            <p className="eyebrow">Before you continue</p>
            <p>{applicationNote}</p>
          </div>
        ) : null}
      </fieldset>

      <fieldset data-application-step="1" hidden={step !== 1}>
        <legend>About you</legend>
        <div className="form-grid two-column">
          <label>First name<input autoComplete="given-name" name="firstName" required /></label>
          <label>Last name<input autoComplete="family-name" name="lastName" required /></label>
          <label>Email<input autoComplete="email" name="email" required type="email" /></label>
          <label>Phone<input autoComplete="tel" name="phone" required type="tel" /></label>
        </div>
      </fieldset>

      <fieldset data-application-step="2" hidden={step !== 2}>
        <legend>Your business</legend>
        <label>Business name<input name="businessName" required /></label>
        <div className="form-grid two-column">
          <label>Instagram or social handle (optional)<input name="instagram" placeholder="@yourbusiness" /></label>
          <label>Website (optional)<input name="website" placeholder="https://" type="url" /></label>
        </div>
        <label>City of Las Vegas business license number (optional)<input name="businessLicenseNumber" placeholder="G00-0000" /></label>
        {applicationType === "food" ? (
          <>
            <label>Setup measurements<input name="setupMeasurements" placeholder="Tow hitch to back of trailer, or tent dimensions" required /></label>
            <label>Health department number<input name="healthDepartmentNumber" required /></label>
            <label>Complete food and drink menu<textarea name="foodMenu" required rows={6} /></label>
          </>
        ) : (
          <>
            <label>Primary category
              <select defaultValue="" name="category" required>
                <option disabled value="">Select a category</option>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label>List every product you plan to sell<textarea name="productDescription" required rows={6} /></label>
          </>
        )}
        <label>How will you fit the theme? (Character art, decor, merch, etc.)
          <textarea name="themeFit" required rows={4} />
        </label>
      </fieldset>

      <fieldset data-application-step="3" hidden={step !== 3}>
        <legend>Choose your setup</legend>
        <div className="vendor-option-list">
          {options.map((option, index) => (
            <label className="vendor-option" key={option.id}>
              <input defaultChecked={index === 0} name="vendorOptionId" required type="radio" value={option.id} />
              <span><strong>{option.name}</strong><small>{option.description}</small></span>
              <b>{money(option.price)}</b>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset data-application-step="4" hidden={step !== 4}>
        <legend>Documents and photos</legend>
        <p className="form-helper">All uploads are optional. Share any documents or photos you have available. JPG, PNG, WebP, or PDF. Maximum 10MB per file, 12 files, and 45MB total.</p>
        <label>Business license upload (optional)<input accept="image/jpeg,image/png,image/webp,application/pdf" name="businessLicense" type="file" /></label>
        {applicationType === "food" ? <label>Health permit upload (optional)<input accept="image/jpeg,image/png,image/webp,application/pdf" name="healthPermit" type="file" /></label> : <label>Health permit, if selling sealed or prepackaged food (optional)<input accept="image/jpeg,image/png,image/webp,application/pdf" name="healthPermit" type="file" /></label>}
        {applicationType === "food" ? <label>Business logo (optional)<input accept="image/jpeg,image/png,image/webp" name="logo" type="file" /></label> : null}
        <label>Setup, truck, tent, and booth photos (optional)<input accept="image/jpeg,image/png,image/webp" multiple name="setupPhotos" type="file" /></label>
        {applicationType === "food" ? <label>Food and product photos (optional)<input accept="image/jpeg,image/png,image/webp" multiple name="productPhotos" type="file" /></label> : null}
        {applicationType === "food" ? <label>Menu file (optional)<input accept="image/jpeg,image/png,image/webp,application/pdf" name="menuFile" type="file" /></label> : null}
      </fieldset>

      <fieldset data-application-step="5" hidden={step !== 5}>
        <legend>Rules and review</legend>
        <div className="application-rules" role="region" aria-label="Event terms and agreement" tabIndex={0}>
          {(rules || "Approved vendors must follow event instructions, arrive on time, keep their space clean, sell only approved items, and remain for the full event.")
            .split(/\n\s*\n/)
            .map((paragraph, index) => /^(?:VENDOR TERMS & AGREEMENT|VENDOR ACKNOWLEDGEMENT|\d+\.\s)/.test(paragraph.trim())
              ? <h3 key={index}>{paragraph}</h3>
              : <p key={index}>{paragraph}</p>)}
        </div>
        <label className="checkbox-label"><input name="followingInstagram" type="checkbox" /> I’m following {siteConfig.name} on Instagram.</label>
        <p className="form-helper"><a href={siteConfig.socials.instagram} target="_blank" rel="noreferrer">Follow {siteConfig.name} on Instagram ↗</a></p>
        <label className="checkbox-label"><input name="rulesAcknowledged" required type="checkbox" /> I read and agree to these event rules and understand that submitting does not guarantee acceptance.</label>
        <p className="application-copyright">
          © 2026 MarketElla LV LLC. All rights reserved. This application and all included content are protected by copyright. No part may be copied, reproduced, or distributed without written permission from the owner.
        </p>
      </fieldset>

      {state.status === "error" ? <p className="form-error application-submit-error" ref={errorRef} role="alert" tabIndex={-1}>{state.message}</p> : null}

      <div className="application-step-actions">
        {step > 0 ? <button className="button button-dark" disabled={pending} onClick={() => setStep((current) => current - 1)} type="button">Back</button> : <span />}
        {step < steps.length - 1 ? (
          <button key="next" className="button button-accent" onClick={nextStep} type="button">Next <span aria-hidden="true">↗</span></button>
        ) : (
          <button key="submit" className="button button-accent submit-button" disabled={pending} formNoValidate type="submit">
            {pending ? "Uploading and submitting..." : "Submit application"} <span aria-hidden="true">↗</span>
          </button>
        )}
      </div>
      {pending ? <div className="application-upload-status" role="status"><span aria-hidden="true" /> Uploading files and saving your application. Keep this page open.</div> : null}
    </form>
  );
}
