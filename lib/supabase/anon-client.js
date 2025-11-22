import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env.server";

export function createSupabaseAnonClient() {
  return createClient(serverEnv.supabaseUrl, serverEnv.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
