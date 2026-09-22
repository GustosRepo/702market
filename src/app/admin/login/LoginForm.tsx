"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginFormState } from "./actions";

const initialState: LoginFormState = {
  message: "",
};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAdmin,
    initialState,
  );

  return (
    <form className="admin-login-form" action={formAction}>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      {state.message ? (
        <p className="form-error" role="alert">{state.message}</p>
      ) : null}

      <button className="button button-accent submit-button" type="submit" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"} <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}
