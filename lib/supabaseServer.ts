// Server-only Supabase access for writes. Import this from route handlers only.
//
// The anon key is public (NEXT_PUBLIC_*, shipped to every browser), so it must
// only be allowed to read. Writes use the service-role key, which bypasses RLS
// and never leaves the server. See supabase/lock-down-rls.sql.
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { supabase } from './supabase'

let writeClient: SupabaseClient | null = null

function getWriteClient(): SupabaseClient {
  if (writeClient) return writeClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (url && serviceRoleKey) {
    writeClient = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    return writeClient
  }

  // Fallback so saving keeps working until SUPABASE_SERVICE_ROLE_KEY is set.
  // It stops working once the anon key is made read-only, which is intended.
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not set; writing with the anon key')
  return supabase
}

// Save content for a specific section
export async function saveContent(locale: 'en' | 'ar', section: string, data: Record<string, unknown>) {
  const { data: result, error } = await getWriteClient()
    .from('content')
    .upsert({
      locale,
      section,
      data,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'locale,section'
    })
    .select()

  if (error) throw error
  return result
}
