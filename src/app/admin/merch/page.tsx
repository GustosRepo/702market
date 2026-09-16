import AdminShell from "@/components/admin-shell";
import { merchProducts } from "@/data/merch";

export const metadata = { title: "Manage Merch | 702Market" };

export default function AdminMerchPage() {
  return <AdminShell title="Merch">
    <div className="admin-toolbar"><p>Control what appears in the public merch catalog.</p><button className="button button-accent" type="button">+ Add product</button></div>
    <section className="admin-product-list">{merchProducts.map((product) => <article key={product.slug}><div className="admin-product-art">702</div><div><h2>{product.name}</h2><p>{product.description}</p><span className="status-pill status-active">Active</span>{product.featured && <span className="status-pill status-featured">Featured</span>}</div><strong>{product.price}</strong><button className="text-button" type="button">Edit ↗</button></article>)}</section>
  </AdminShell>;
}
