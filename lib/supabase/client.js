import { createClient } from "@supabase/supabase-js";

// Browser-klient. Magic link-sessionen håndteres automatisk (detectSessionInUrl).
// Nøglerne er offentlige (anon) - al adgangskontrol ligger i RLS i databasen.
let _client = null;

export function getSupabase() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return _client;
}
