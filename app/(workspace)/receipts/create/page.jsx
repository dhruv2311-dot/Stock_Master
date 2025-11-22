import PageHeader from "@/components/layout/PageHeader";
import ReceiptForm from "@/components/receipts/ReceiptForm";
import { getSessionAndProfile } from "@/lib/auth";

export const metadata = {
  title: "Create Receipt | StockMaster",
};

export default async function CreateReceiptPage() {
  const { supabase } = await getSessionAndProfile({ redirectToLogin: true });

  const [{ data: products }, { data: warehouses }, { data: locations }] = await Promise.all([
    supabase.from("products").select("id, name, sku").order("name", { ascending: true }),
    supabase.from("warehouses").select("id, name").order("name", { ascending: true }),
    supabase.from("locations").select("id, name, warehouse_id").order("name", { ascending: true }),
  ]);

  return (
    <div>
      <PageHeader
        title="Create receipt"
        description="Draft a goods receipt and capture each SKU entering the warehouse."
      />
      <div className="rounded-3xl border border-white/5 bg-slate-900/50 p-8">
        <ReceiptForm products={products || []} warehouses={warehouses || []} locations={locations || []} />
      </div>
    </div>
  );
}
