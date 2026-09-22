import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin-shell";
import { getAdminMerchProductBySlug } from "@/lib/merch";
import { updateProduct } from "../../actions";

type EditProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const metadata = { title: "Edit Product | 702Market" };

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { slug } = await params;
  const product = await getAdminMerchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <AdminShell title="Edit Product">
      <div className="admin-toolbar">
        <p>Update public merch information and checkout links.</p>
        <Link className="text-link" href="/admin/merch">All merch ↗</Link>
      </div>
      <form className="admin-form" action={updateProduct}>
        <input name="originalSlug" type="hidden" value={product.slug} />
        <fieldset>
          <legend>Product details</legend>
          <div className="form-grid two-column">
            <label>Name<input name="name" defaultValue={product.name} required /></label>
            <label>Slug<input name="slug" defaultValue={product.slug} required /></label>
          </div>
          <label>Description<textarea name="description" rows={5} defaultValue={product.description} required /></label>
          <div className="form-grid two-column">
            <label>Price<input min="0" name="displayPrice" required step="0.01" type="number" defaultValue={product.displayPrice} /></label>
            <label>Display order<input name="sortOrder" type="number" defaultValue={product.sortOrder} /></label>
          </div>
          <label>External checkout URL<input name="externalUrl" type="url" defaultValue={product.externalUrl} required /></label>
          <label>Image path<input name="imagePath" defaultValue={product.imagePath || ""} /></label>
          <label className="checkbox-label"><input name="active" type="checkbox" defaultChecked={product.active} /> Active on public merch page</label>
          <label className="checkbox-label"><input name="featured" type="checkbox" defaultChecked={product.featured} /> Featured product</label>
        </fieldset>

        <button className="button button-accent submit-button" type="submit">
          Save product <span aria-hidden="true">↗</span>
        </button>
      </form>
    </AdminShell>
  );
}
