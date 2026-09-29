import Link from "next/link";
import AdminShell from "@/components/admin-shell";
import { createProduct } from "./actions";

export const metadata = { title: "Add Product | Marketella" };

export default function NewMerchProductPage() {
  return (
    <AdminShell title="Add Product">
      <div className="admin-toolbar">
        <p>Add a public merch item that links to an external checkout.</p>
        <Link className="text-link" href="/admin/merch">All merch ↗</Link>
      </div>
      <form className="admin-form" action={createProduct}>
        <fieldset>
          <legend>Product details</legend>
          <div className="form-grid two-column">
            <label>Name<input name="name" required /></label>
            <label>Slug<input name="slug" placeholder="auto-generated if blank" /></label>
          </div>
          <label>Description<textarea name="description" rows={5} required /></label>
          <div className="form-grid two-column">
            <label>Price<input min="0" name="displayPrice" required step="0.01" type="number" /></label>
            <label>Display order<input name="sortOrder" type="number" defaultValue="0" /></label>
          </div>
          <label>External checkout URL<input name="externalUrl" type="url" placeholder="https://" required /></label>
          <label>Image path<input name="imagePath" placeholder="optional storage path" /></label>
          <label className="checkbox-label"><input name="active" type="checkbox" defaultChecked /> Active on public merch page</label>
          <label className="checkbox-label"><input name="featured" type="checkbox" /> Featured product</label>
        </fieldset>

        <button className="button button-accent submit-button" type="submit">
          Add product <span aria-hidden="true">↗</span>
        </button>
      </form>
    </AdminShell>
  );
}
