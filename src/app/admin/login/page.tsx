import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, getAdminEmails, hasSupabaseEnv } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin Login | 702Market" };

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  const isConfigured = hasSupabaseEnv() && getAdminEmails().length > 0;

  return (
    <main className="admin-login-page">
      <section className="admin-login-panel">
        <Link className="admin-brand" href="/" aria-label="702Market home">
          702<span>Market</span><small>Admin</small>
        </Link>
        <div>
          <p className="eyebrow">Staff login</p>
          <h1>Welcome<br /><em>back.</em></h1>
          <p>
            Sign in with the Supabase Auth account assigned to this admin
            workspace.
          </p>
        </div>
        {!isConfigured ? (
          <p className="form-error" role="status">
            Add Supabase env values and ADMIN_EMAILS before signing in.
          </p>
        ) : null}
        <LoginForm />
      </section>
    </main>
  );
}
