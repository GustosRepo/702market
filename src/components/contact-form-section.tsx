"use client";

import { useActionState, type ReactNode } from "react";
import { submitContactForm, type ContactFormState } from "@/app/contact/actions";
import { siteConfig } from "@/lib/site-config";

type ContactFormSectionProps = {
  id?: string;
  showMarquee?: boolean;
};

const contactPhrases = ["comments?", "questions?", "concerns?", "wanna connect?"];
const socialLinks = [
  { name: "Instagram", href: siteConfig.socials.instagram },
  { name: "TikTok", href: siteConfig.socials.tiktok },
  { name: "Linktree", href: siteConfig.socials.linktree },
];
const initialState: ContactFormState = { status: "idle", message: "" };

function ContactMarquee() {
  const repeated = [...contactPhrases, ...contactPhrases, ...contactPhrases];

  return (
    <div className="marquee-band marquee-contact" aria-hidden="true">
      <div className="marquee-track">
        {repeated.map((phrase, index) => (
          <span key={`${phrase}-${index}`}>{phrase}</span>
        ))}
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  required = true,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <span className="home-contact-field-label">
      {children}
      {required ? <small> (required)</small> : null}
    </span>
  );
}

export default function ContactFormSection({
  id = "contact",
  showMarquee = true,
}: ContactFormSectionProps) {
  const [state, action, pending] = useActionState(
    submitContactForm.bind(null, "contact"),
    initialState,
  );

  return (
    <section className="home-contact-section" id={id} aria-labelledby={`${id}-heading`}>
      {showMarquee ? <ContactMarquee /> : null}
      <div className="home-contact-layout">
        <div className="home-contact-copy">
          <h2 id={`${id}-heading`}>
            <span>wanna</span>
            <span>connect?</span>
          </h2>
          <div className="home-contact-socials" aria-label="Social links">
            {socialLinks.map((link) => (
              <a href={link.href} key={link.name} target="_blank" rel="noreferrer">
                {link.name}
              </a>
            ))}
          </div>
        </div>
        {state.status === "success" ? (
          <div className="home-contact-success" role="status">
            <p className="eyebrow">message sent</p>
            <h3>we got u.</h3>
            <p>{state.message}</p>
          </div>
        ) : <form className="home-contact-form" action={action}>
          <label className="form-honeypot" aria-hidden="true">Company website<input autoComplete="off" name="companyWebsite" tabIndex={-1} /></label>
          <fieldset>
            <legend>Name</legend>
            <div className="home-contact-form-grid">
              <label>
                <FieldLabel>First Name</FieldLabel>
                <input name="firstName" required />
              </label>
              <label>
                <FieldLabel>Last Name</FieldLabel>
                <input name="lastName" required />
              </label>
            </div>
          </fieldset>
          <label>
            <FieldLabel>Email</FieldLabel>
            <input name="email" type="email" required />
          </label>
          <label className="home-contact-checkbox">
            <input name="updates" type="checkbox" />
            <span>Sign up for news and updates</span>
          </label>
          <label>
            <FieldLabel>Subject</FieldLabel>
            <input name="subject" required />
          </label>
          <label>
            <FieldLabel>Message</FieldLabel>
            <textarea name="message" required rows={5} />
          </label>
          {state.status === "error" ? <p className="form-error contact-form-error" role="alert">{state.message}</p> : null}
          <button className="home-contact-submit" disabled={pending} type="submit">{pending ? "Sending..." : "Submit"}</button>
        </form>}
      </div>
    </section>
  );
}
