import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, getAdminEmails, hasSupabaseEnv } from "@/lib/admin-auth";
import { hasAdminSessionSecret } from "@/lib/admin-session";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin Login | MarketElla" };

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  const isConfigured =
    hasSupabaseEnv() &&
    getAdminEmails().length > 0 &&
    hasAdminSessionSecret();

  return (
    <main className="admin-login-page">
      <section className="admin-login-panel">
        <Link className="admin-brand" href="/" aria-label="MarketElla home">
          Market<span>Ella</span><small>Admin</small>
        </Link>
        <div className="admin-login-copy">
          <p className="eyebrow">Staff login</p>
          <h1>Welcome<br /><em>back.</em></h1>
          <p>
            Sign in with the Supabase Auth account assigned to this admin
            workspace.
          </p>
        </div>
        {!isConfigured ? (
          <p className="form-error" role="status">
            Add Supabase env values, ADMIN_EMAILS, and ADMIN_SESSION_SECRET before signing in.
          </p>
        ) : null}
        <LoginForm />
      </section>
    </main>
  );
}
