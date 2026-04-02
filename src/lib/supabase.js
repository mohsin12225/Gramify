import { createClient } from '@supabase/supabase-js'

var supabaseUrl = ''
var supabaseAnonKey = ''

try {
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
  supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
} catch (e) {
  console.warn('[Supabase] Could not read env vars:', e)
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing credentials. Auth will not work.')
}

// Always create a client — even with empty URL it won't crash
export var supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'gf-auth',
    },
  }
)