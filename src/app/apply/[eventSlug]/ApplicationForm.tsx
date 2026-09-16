"use client";

import { FormEvent, useState } from "react";

const categories = [
  "Vintage",
  "Clothing",
  "Jewelry",
  "Art",
  "Food",
  "Collectibles",
  "Handmade",
  "Beauty",
  "Accessories",
  "Other",
];

export default function ApplicationForm({ eventTitle }: { eventTitle: string }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="application-success" role="status">
        <span className="success-mark" aria-hidden="true">✦</span>
        <p className="eyebrow">You&apos;re on the list</p>
        <h2>Application<br /><em>received.</em></h2>
        <p>Thanks for applying to {eventTitle}. We&apos;ll review your details and email you with the next step.</p>
        <button className="button button-dark" type="button" onClick={() => setSubmitted(false)}>
          Submit another <span aria-hidden="true">↗</span>
        </button>
      </div>
    );
  }

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend>About you</legend>
        <div className="form-grid two-column">
          <label>First name<input name="firstName" required /></label>
          <label>Last name<input name="lastName" required /></label>
          <label>Email<input name="email" type="email" required /></label>
          <label>Phone<input name="phone" type="tel" required /></label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Your business</legend>
        <div className="form-grid">
          <label>Business or vendor name<input name="businessName" required /></label>
          <div className="form-grid two-column">
            <label>Instagram<input name="instagram" placeholder="@yourhandle" /></label>
            <label>Website<input name="website" type="url" placeholder="https://" /></label>
          </div>
          <label>What do you sell?
            <select name="category" required defaultValue="">
              <option value="" disabled>Select a category</option>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label>Tell us about your products<textarea name="productDescription" rows={5} required /></label>
          <label>Typical price range<input name="priceRange" placeholder="$15 - $80" required /></label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Market details</legend>
        <div className="form-grid">
          <label>Booth type
            <select name="boothType" defaultValue="standard">
              <option value="standard">Standard booth</option>
              <option value="shared">Shared booth</option>
            </select>
          </label>
          <label className="checkbox-label"><input name="electricity" type="checkbox" /> I need access to electricity</label>
          <label>Special requests<textarea name="specialRequests" rows={4} /></label>
          <label className="checkbox-label"><input name="agreement" type="checkbox" required /> I agree to the 702Market vendor rules</label>
        </div>
      </fieldset>

      <button className="button button-accent submit-button" type="submit">
        Send application <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}
