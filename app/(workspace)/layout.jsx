import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import StockRealtimeObserver from "@/components/realtime/StockRealtimeObserver";
import { getSessionAndProfile } from "@/lib/auth";

export default async function WorkspaceLayout({ children }) {
  const { profile } = await getSessionAndProfile({ redirectToLogin: true });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      <StockRealtimeObserver />
      <div className="hidden w-80 lg:block">
        <Sidebar profile={profile} />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="block lg:hidden">
          <Header profile={profile} />
        </div>
        <div className="hidden lg:block">
          <Header profile={profile} />
        </div>
        <main className="flex-1 overflow-y-auto bg-slate-950/70 px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
