import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import { getSessionAndProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ReceiptsPage() {
  const { supabase } = await getSessionAndProfile({ redirectToLogin: true });
  const { data: receipts = [] } = await supabase
    .from("receipts")
    .select("id, reference_no, supplier_name, status, created_at, warehouses(name)")
    .order("created_at", { ascending: false });

  const columns = [
    {
      label: "Reference",
      accessor: "reference_no",
      render: (row) => (
        <Link href={`/receipts/${row.id}`} className="text-emerald-300 hover:text-emerald-200">
          {row.reference_no}
        </Link>
      ),
    },
    { label: "Supplier", accessor: "supplier_name" },
    {
      label: "Warehouse",
      accessor: "warehouse",
      render: (row) => row.warehouses?.name || "—",
    },
    {
      label: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      label: "Created",
      accessor: "created_at",
      render: (row) => new Date(row.created_at).toLocaleString(),
    },
    {
      label: "Actions",
      accessor: "actions",
      render: (row) => (
        <div className="space-x-3 text-xs">
          <Link href={`/receipts/${row.id}`} className="text-slate-400 hover:text-slate-200">
            View
          </Link>
          <Link href={`/receipts/${row.id}?edit=true`} className="text-emerald-300 hover:text-emerald-200">
            Edit
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Receipts"
        description="Capture every supplier delivery from draft through validation."
        actions={
          <Link
            href="/receipts/create"
            className="rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            + New Receipt
          </Link>
        }
      />

      <DataTable columns={columns} data={receipts} emptyState="No receipts yet." />
    </div>
  );
}
