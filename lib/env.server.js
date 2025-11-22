const requiredServerEnv = {
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
};

for (const [key, value] of Object.entries(requiredServerEnv)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const serverEnv = {
  supabaseUrl: requiredServerEnv.NEXT_PUBLIC_SUPABASE_URL,
  supabaseServiceRoleKey: requiredServerEnv.SUPABASE_SERVICE_ROLE_KEY,
  supabaseAnonKey: requiredServerEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  siteUrl: requiredServerEnv.NEXT_PUBLIC_SITE_URL,
};
