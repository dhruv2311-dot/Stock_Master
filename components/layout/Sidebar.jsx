"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { sidebarNav } from "@/lib/navigation";

export default function Sidebar({ profile }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-full flex-col border-r border-white/5 bg-slate-950/80 px-6 py-8 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">StockMaster</p>
        <h2 className="mt-2 text-lg font-semibold text-white">Control Tower</h2>
        <p className="text-xs text-slate-500">Hi {profile.full_name.split(" ")[0]}</p>
      </div>

      <nav className="mt-10 flex-1 space-y-6 text-sm font-medium text-slate-400">
        {sidebarNav.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2 transition ${
                pathname.startsWith(item.href)
                  ? "bg-emerald-500/10 text-white"
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
            {item.children && (
              <div className="ml-8 mt-2 space-y-1 text-xs">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`block rounded-xl px-2 py-1 transition ${
                      pathname === child.href
                        ? "text-emerald-300"
                        : "text-slate-500 hover:text-slate-200"
                    }`}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-xs text-slate-400">
        <p className="text-slate-200">Role</p>
        <p className="capitalize text-white">{profile.role.replace("_", " ")}</p>
        <p className="mt-3 text-slate-200">Login ID</p>
        <p className="text-slate-400">{profile.login_id}</p>
      </div>
    </aside>
  );
}

function Icon({ name }) {
  const Component = Icons[name] ?? Icons.Circle;
  return <Component size={16} />;
}
