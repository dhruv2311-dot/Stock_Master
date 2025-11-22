import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server-client";

async function fetchSessionAndProfile() {
  const supabase = getSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { supabase, session: null, profile: null };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, login_id, email, role, default_warehouse_id")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("Failed to fetch profile", error);
    throw new Error("Profile not found");
  }

  return { supabase, session, profile };
}

export async function getSessionAndProfile({ redirectToLogin = false } = {}) {
  const { supabase, session, profile } = await fetchSessionAndProfile();

  if (!session) {
    if (redirectToLogin) {
      redirect("/auth/login");
    }
    throw new Error("Unauthorized");
  }

  return { supabase, session, profile };
}

export async function requireApiSession() {
  const result = await fetchSessionAndProfile();
  if (!result.session) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
  return result;
}

export function assertInventoryManager(profile) {
  if (profile.role !== "inventory_manager") {
    throw new Error("Forbidden: inventory manager role required");
  }
}
