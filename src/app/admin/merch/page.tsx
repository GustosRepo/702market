import Link from "next/link";
import AdminShell from "@/components/admin-shell";
import { AdminConfirmAction } from "@/components/admin-confirm-action";
import { getAdminMerchProducts, type MerchArchiveView } from "@/lib/merch";
import { archiveProduct, restoreProduct } from "./actions";

export const metadata = { title: "Manage Merch | MarketElla" };

type AdminMerchPageProps = { searchParams: Promise<{ archive?: string }> };

function cleanArchive(value?: string): MerchArchiveView {
  return value === "archived" || value === "all" ? value : "active";
}

function archiveHref(archive: MerchArchiveView) {
  return archive === "active" ? "/admin/merch" : `/admin/merch?archive=${archive}`;
}

export default async function AdminMerchPage({ searchParams }: AdminMerchPageProps) {
  const params = await searchParams;
  const archive = cleanArchive(params.archive);
  const merchProducts = await getAdminMerchProducts(archive);

  return (
    <AdminShell title="Merch">
      <div className="admin-toolbar">
        <p>Control what appears in the public merch catalog.</p>
        <Link className="button button-accent" href="/admin/merch/new">+ Add product</Link>
      </div>
      <section className="admin-filter-row" aria-label="Merch archive filters">
        {(["active", "archived", "all"] as const).map((value) => (
          <Link className={archive === value ? "filter-active" : ""} href={archiveHref(value)} key={value}>{value}</Link>
        ))}
      </section>
      {merchProducts.length > 0 ? (
        <section className="admin-product-list">
          {merchProducts.map((product) => (
            <article key={product.slug}>
              <div className="admin-product-art">M</div>
              <div>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <span className={`status-pill ${product.active ? "status-active" : "status-cancelled"}`}>{product.active ? "Active" : "Inactive"}</span>
                {product.featured && <span className="status-pill status-featured">Featured</span>}
              </div>
              <strong>{product.price}</strong>
              <a className="text-button" href={product.externalUrl} target="_blank" rel="noreferrer">Checkout ↗</a>
              <Link className="text-button" href={`/admin/merch/${product.slug}/edit`}>Edit</Link>
              {product.archivedAt ? (
                <form action={restoreProduct}><input name="slug" type="hidden" value={product.slug} /><button className="text-button" type="submit">Restore</button></form>
              ) : (
                <AdminConfirmAction action={archiveProduct} confirmLabel="Archive product" fields={{ slug: product.slug }} message={`Archive “${product.name}”? It will be removed from active admin lists, but the product record will be preserved.`} title="Archive this product?" tone="danger" triggerLabel="Archive" />
              )}
            </article>
          ))}
        </section>
      ) : (
        <section className="admin-empty-panel compact">
          <p className="eyebrow">No merch yet</p>
          <h2>Add the first<br /><em>market drop.</em></h2>
          <p>Products created here can appear on the public merch page when active.</p>
          <Link className="button button-accent" href="/admin/merch/new">Add product ↗</Link>
        </section>
      )}
    </AdminShell>
  );
}
