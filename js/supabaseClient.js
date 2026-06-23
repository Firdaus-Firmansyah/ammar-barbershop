import { createClient } from '@supabase/supabase-js';

/**
 * Konfigurasi Supabase Client.
 * Anon Key bersifat publik (aman diekspos di client-side).
 * Keamanan data dijaga oleh Row Level Security (RLS) di Supabase.
 */
const supabaseUrl = 'https://vxhzqcfuumiiqgecpleq.supabase.co';
const supabaseAnonKey = 'sb_publishable_ClxucW0IumPFcQMgRMv06Q__RrUK4Gt';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
