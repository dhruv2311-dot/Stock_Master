import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import MoveHistoryKanban from "@/components/move-history/MoveHistoryKanban";
import { getSessionAndProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

const STATUS_LABELS = {
  draft: "Draft",
  waiting: "Waiting",
  ready: "Ready",
  done: "Done",
  cancelled: "Cancelled",
};

function buildParams(searchParams = {}) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string" && value.length > 0) {
      params.set(key, value);
    }
  });
  return params;
}

export default async function MoveHistoryPage({ searchParams }) {
  const activeView = searchParams?.view === "kanban" ? "kanban" : "list";
  const query = (searchParams?.q || "").trim();

  const { supabase } = await getSessionAndProfile({ redirectToLogin: true });
  const { data: transfers = [] } = await supabase
    .from("internal_transfers")
    .select(
      "id, reference_no, status, created_at, from:from_warehouse_id(name), to:to_warehouse_id(name), profiles:created_by(full_name, email), transfer_items(id, quantity, products(name, sku, unit))"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const normalized = (transfers || []).map((transfer) => {
    const totalQuantity = transfer.transfer_items?.reduce((acc, item) => acc + Number(item.quantity || 0), 0) || 0;
    return {
      ...transfer,
      contactName: transfer.profiles?.full_name || "",
      contactEmail: transfer.profiles?.email || "",
      totalQuantity,
    };
  });

  const term = query.toLowerCase();
  const filteredTransfers = term
    ? normalized.filter((transfer) => {
        const matchesReference = transfer.reference_no?.toLowerCase().includes(term);
        const matchesContact =
          transfer.contactName?.toLowerCase().includes(term) || transfer.contactEmail?.toLowerCase().includes(term);
        const matchesProduct = transfer.transfer_items?.some((item) => {
          const productName = item.products?.name || "";
          const sku = item.products?.sku || "";
          return productName.toLowerCase().includes(term) || sku.toLowerCase().includes(term);
        });
        return matchesReference || matchesContact || matchesProduct;
      })
    : normalized;

  const listRows = filteredTransfers.flatMap((transfer) => {
    const items = transfer.transfer_items?.length ? transfer.transfer_items : [null];
    return items.map((item, index) => ({
      id: item?.id || `${transfer.id}-row-${index}`,
      transferId: transfer.id,
      reference: transfer.reference_no,
      created_at: transfer.created_at,
      contactName: transfer.contactName,
      contactEmail: transfer.contactEmail,
      from: transfer.from?.name || "—",
      to: transfer.to?.name || "—",
      status: transfer.status,
      quantity: item ? Number(item.quantity) || 0 : 0,
      unit: item?.products?.unit,
      productName: item?.products?.name,
      productSku: item?.products?.sku,
    }));
  });

  const columns = [
    {
      label: "Reference",
      accessor: "reference",
      render: (row) => (
        <div>
          <Link href={`/transfers/${row.transferId}`} className="font-semibold text-emerald-300 hover:text-emerald-200">
            {row.reference}
          </Link>
          {row.productName && (
            <p className="text-xs text-slate-400">
              {row.productName}
              {row.productSku ? ` · ${row.productSku}` : ""}
            </p>
          )}
        </div>
      ),
    },
    {
      label: "Date",
      accessor: "created_at",
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      label: "Contact",
      accessor: "contactName",
      render: (row) => (
        <div className="text-sm">
          <p className="font-medium text-white">{row.contactName || "—"}</p>
          <p className="text-xs text-slate-400">{row.contactEmail || ""}</p>
        </div>
      ),
    },
    {
      label: "From",
      accessor: "from",
    },
    {
      label: "To",
      accessor: "to",
    },
    {
      label: "Quantity",
      accessor: "quantity",
      render: (row) => (
        <span className="font-semibold text-white">
          {row.quantity.toLocaleString()} {row.unit || ""}
        </span>
      ),
    },
    {
      label: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} label={STATUS_LABELS[row.status] || row.status} />,
    },
  ];

  const params = buildParams(searchParams);
  const toggleParams = new URLSearchParams(params);
  toggleParams.set("view", activeView === "kanban" ? "list" : "kanban");
  const toggleHref = `/ledger${toggleParams.size ? `?${toggleParams.toString()}` : ""}`;

  const clearParams = new URLSearchParams(params);
  clearParams.delete("q");
  const clearHref = `/ledger${clearParams.size ? `?${clearParams.toString()}` : ""}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Move History"
        description="Audit every stock relocation with quick filtering and flexible views."
        actions={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <form method="get" className="flex items-center gap-2">
              <input type="hidden" name="view" value={activeView} />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search reference, contact, product"
                className="w-56 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
              <button
                type="submit"
                className="rounded-2xl bg-emerald-400 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-300"
              >
                Search
              </button>
              {query && (
                <a
                  href={clearHref}
                  className="rounded-2xl border border-white/15 px-3 py-2 text-xs text-slate-300 hover:text-white"
                >
                  Clear
                </a>
              )}
            </form>
            <a
              href={toggleHref}
              className="rounded-2xl border border-white/15 px-3 py-2 text-xs text-slate-200 hover:text-white"
            >
              {activeView === "kanban" ? "Show List View" : "Show Kanban View"}
            </a>
          </div>
        }
      />

      {activeView === "kanban" ? (
        <MoveHistoryKanban moves={filteredTransfers} />
      ) : (
        <DataTable columns={columns} data={listRows} emptyState="No moves recorded." />
      )}
    </div>
  );
}
