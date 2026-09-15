import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, supabaseConfigured } from "./env";

let client: SupabaseClient | null = null;

/** Server-only Supabase client. The service role key must never use a NEXT_PUBLIC_ name. */
export function supabaseAdmin(): SupabaseClient {
  if (!supabaseConfigured) throw new Error("Supabase is not configured");
  if (!client) {
    client = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { headers: { "x-application-name": "wtech.md" } },
    });
  }
  return client;
}

export function dbError(operation: string, error: { message: string; code?: string } | null): void {
  if (error) throw new Error(`${operation} failed${error.code ? ` (${error.code})` : ""}: ${error.message}`);
}
