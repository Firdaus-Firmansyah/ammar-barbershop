import { supabase } from '../supabaseClient.js';

/**
 * Menyimpan cache katalog layanan
 */
export let services = [];

/**
 * Mengambil data services dari Supabase
 */
export async function fetchServices() {
  const { data, error } = await supabase.from('services').select('*');
  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }
  services = data;
  return data;
}

export function formatPrice(price) {
  if (!price) return 'Rp 0';
  return 'Rp ' + price.toLocaleString('id-ID');
}
