import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vxhzqcfuumiiqgecpleq.supabase.co';
const supabaseKey = 'sb_publishable_ClxucW0IumPFcQMgRMv06Q__RrUK4Gt';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateDB() {
  // Update Onic Gilang image
  const { data, error } = await supabase
    .from('barbers')
    .update({ image: '/Image/Staff 1.png' })
    .eq('id', 'onic-gilang');
    
  if (error) console.error("Error updating barber:", error);
  else console.log("Barber updated successfully!");
}

updateDB();
