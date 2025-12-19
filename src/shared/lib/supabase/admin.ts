import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin Client (Service Role Key 사용)
 * RLS를 우회하여 모든 데이터에 접근할 수 있습니다.
 * 서버 사이드(API Routes 등)에서만 사용해야 합니다.
 */
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase URL or Service Role Key is missing.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};





