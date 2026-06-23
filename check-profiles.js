import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vxhzqcfuumiiqgecpleq.supabase.co';
const supabaseKey = 'sb_publishable_ClxucW0IumPFcQMgRMv06Q__RrUK4Gt';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfiles() {
  const { data, error } = await supabase.from('profiles').select('*');
  console.log("PROFILES:", data);
  console.log("ERROR:", error);
}

checkProfiles();
