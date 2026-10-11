import Link from "next/link";
import AdminShell from "@/components/admin-shell";
import { getAdminMessages } from "@/lib/admin-messages";
import { updateMessageStatus } from "./actions";

export const metadata = { title: "Messages | MarketElla Admin" };

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ archive?: string }>;
}) {
  const { archive } = await searchParams;
  const includeArchived = archive === "all";
  const messages = await getAdminMessages(includeArchived);

  return (
    <AdminShell title="Messages">
      <div className="admin-toolbar"><p>Contact messages, podcast stories, chisme, and newsletter consent.</p></div>
      <section className="admin-filter-row" aria-label="Message filters">
        <Link className={!includeArchived ? "filter-active" : ""} href="/admin/messages">Inbox</Link>
        <Link className={includeArchived ? "filter-active" : ""} href="/admin/messages?archive=all">All</Link>
      </section>
      {messages.length ? (
        <div className="admin-message-list">
          {messages.map((message) => (
            <article className={message.status === "new" ? "is-new" : ""} key={message.id}>
              <header>
                <div><p className="eyebrow">{message.type.replaceAll("_", " ")}</p><h2>{message.subject}</h2></div>
                <span className={`status-pill status-${message.status}`}>{message.status}</span>
              </header>
              <p className="admin-message-from">{message.firstName} {message.lastName} · <a href={`mailto:${message.email}`}>{message.email}</a></p>
              <p className="admin-message-body">{message.message}</p>
              <footer>
                <span>{message.submittedAt}{message.newsletterOptIn ? " · newsletter opt-in" : ""}</span>
                <div>
                  {message.status === "new" ? <form action={updateMessageStatus}><input name="id" type="hidden" value={message.id} /><input name="status" type="hidden" value="read" /><button className="text-button" type="submit">Mark read</button></form> : null}
                  {message.status !== "archived" ? <form action={updateMessageStatus}><input name="id" type="hidden" value={message.id} /><input name="status" type="hidden" value="archived" /><button className="text-button text-button-danger" type="submit">Archive</button></form> : null}
                </div>
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <section className="admin-empty-panel compact"><p className="eyebrow">Inbox zero</p><h2>No messages<br /><em>waiting.</em></h2><p>New contact and podcast submissions will appear here.</p></section>
      )}
    </AdminShell>
  );
}
