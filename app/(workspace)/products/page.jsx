import PageHeader from "@/components/layout/PageHeader";
import DataTable from "@/components/common/DataTable";
import { getSessionAndProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const { supabase } = await getSessionAndProfile({ redirectToLogin: true });
  const { data: products } = await supabase
    .from("products")
    .select("id, name, sku, unit, reorder_level, product_categories(name)")
    .order("created_at", { ascending: false });

  const columns = [
    { label: "Name", accessor: "name" },
    { label: "SKU", accessor: "sku" },
    { label: "Unit", accessor: "unit" },
    {
      label: "Category",
      accessor: "category",
      render: (row) => row.product_categories?.name || "—",
    },
    {
      label: "Reorder Level",
      accessor: "reorder_level",
    },
    {
      label: "Actions",
      accessor: "actions",
      render: (row) => (
        <div className="space-x-3 text-xs">
          <a href={`/products/${row.id}/edit`} className="text-emerald-300 hover:text-emerald-200">
            Edit
          </a>
          <a href={`/products/${row.id}/stock`} className="text-slate-400 hover:text-slate-200">
            Stock
          </a>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Products"
        description="Catalog of every SKU and unit of measure managed across warehouses."
        actions={
          <a
            href="/products/create"
            className="rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            + Add Product
          </a>
        }
      />

      <DataTable columns={columns} data={products || []} emptyState="No products yet." />
    </div>
  );
}
