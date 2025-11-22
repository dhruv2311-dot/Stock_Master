import PageHeader from "@/components/layout/PageHeader";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import { apiFetch } from "@/lib/server-fetch";

async function fetchLedgerData() {
  const response = await apiFetch("/api/ledger");
  if (!response.ok) return [];
  const payload = await response.json();
  return payload.data || [];
}

export default async function LedgerPage() {
  const rows = await fetchLedgerData();

  const columns = [
    {
      label: "Timestamp",
      accessor: "occurred_at",
      render: (row) => new Date(row.occurred_at).toLocaleString(),
    },
    {
      label: "Product",
      accessor: "product",
      render: (row) => (
        <div>
          <p className="font-medium text-white">{row.products?.name}</p>
          <p className="text-xs text-slate-400">{row.products?.sku}</p>
        </div>
      ),
    },
    {
      label: "Operation",
      accessor: "operation_type",
      render: (row) => <StatusBadge status={row.operation_type} />,
    },
    {
      label: "Quantity",
      accessor: "quantity_change",
      render: (row) => {
        const qty = Number(row.quantity_change) || 0;
        const tone = qty === 0 ? "text-slate-200" : qty > 0 ? "text-emerald-300" : "text-rose-300";
        const sign = qty > 0 ? "+" : "";
        return <span className={`font-semibold ${tone}`}>{`${sign}${qty}`}</span>;
      },
    },
    {
      label: "Balance",
      accessor: "balance_after",
      render: (row) => Number(row.balance_after).toLocaleString(),
    },
    {
      label: "Warehouse / Location",
      accessor: "warehouse",
      render: (row) => (
        <div>
          <p>{row.warehouses?.name || "—"}</p>
          <p className="text-xs text-slate-500">{row.locations?.name || "—"}</p>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Stock Ledger"
        description="Immutable trail of every movement across receipts, deliveries, transfers, and adjustments."
      />
      <DataTable columns={columns} data={rows} emptyState="No ledger entries yet." />
    </div>
  );
}
