"use client";

import { useActionState } from "react";
import {
  submitContactForm,
  type ContactFormState,
  type ContactSubmissionType,
} from "@/app/contact/actions";

const initialState: ContactFormState = { status: "idle", message: "" };

type PodcastSubmissionFormProps = {
  type: Extract<ContactSubmissionType, "podcast_story" | "podcast_chisme">;
  eyebrow: string;
  heading: string;
  description: string;
  fieldLabel: string;
  buttonLabel: string;
  className: string;
};

export default function PodcastSubmissionForm({
  type,
  eyebrow,
  heading,
  description,
  fieldLabel,
  buttonLabel,
  className,
}: PodcastSubmissionFormProps) {
  const [state, action, pending] = useActionState(
    submitContactForm.bind(null, type),
    initialState,
  );

  if (state.status === "success") {
    return (
      <div className={`podcast-form ${className} podcast-form-success`} role="status">
        <p className="eyebrow">sent</p>
        <h2>we got it.</h2>
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form className={`podcast-form ${className}`} action={action}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{heading}</h2>
      <p>{description}</p>
      <label>Name<input autoComplete="name" name="firstName" required /></label>
      <label>Email<input autoComplete="email" name="email" required type="email" /></label>
      <label>{fieldLabel}<textarea name="message" required rows={5} /></label>
      <label className="form-honeypot" aria-hidden="true">Company website<input autoComplete="off" name="companyWebsite" tabIndex={-1} /></label>
      {state.status === "error" ? <p className="form-error" role="alert">{state.message}</p> : null}
      <button disabled={pending} type="submit">{pending ? "Sending..." : buttonLabel}</button>
    </form>
  );
}
