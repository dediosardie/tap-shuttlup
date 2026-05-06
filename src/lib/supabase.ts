import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null | undefined;

export function getViteSupabaseClient(): SupabaseClient | null {
  if (_client !== undefined) return _client;
  const url = ((import.meta.env.VITE_SUPABASE_URL ?? import.meta.env.NEXT_PUBLIC_SUPABASE_URL ?? "") as string).trim();
  const key = ((import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "") as string).trim();
  if (!url || !key) {
    _client = null;
    return null;
  }
  _client = createClient(url, key);
  return _client;
}
