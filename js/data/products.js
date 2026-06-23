import { supabase } from '../supabaseClient.js';

export let products = [];
export let upsellProducts = [];

export async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  
  products = data.filter(p => p.category === 'hair-care');
  upsellProducts = data.filter(p => p.category === 'upsell');
  return data;
}
