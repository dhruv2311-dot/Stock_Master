import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env.server";

let serviceClient;

export function getSupabaseServiceClient() {
  if (!serviceClient) {
    serviceClient = createClient(
      serverEnv.supabaseUrl,
      serverEnv.supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return serviceClient;
}
