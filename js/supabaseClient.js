import { createClient } from '@supabase/supabase-js';

// Kredensial Supabase (akan diisi setelah Anda memberikan URL dan Key)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'REPLACE_WITH_YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'REPLACE_WITH_YOUR_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
