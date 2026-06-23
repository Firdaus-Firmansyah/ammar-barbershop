import { supabase } from '../supabaseClient.js';

/**
 * Fallback data jika koneksi Supabase gagal
 */
const fallbackServices = [
  { id: 'haircut', name: 'Haircut', price: 150000, duration: 45, icon: '✂️', image: '/Image/Haircut.png' },
  { id: 'shave', name: 'Shave', price: 75000, duration: 30, icon: '🪒', image: '/Image/Shave 1.png' },
  { id: 'coloring', name: 'Coloring', price: 250000, duration: 90, icon: '🎨', image: '/Image/Coloring 1.png' },
  { id: 'perm', name: 'Perm', price: 350000, duration: 120, icon: '🌀', image: '/Image/Perm 1.png' },
  { id: 'smoothing', name: 'Smoothing', price: 450000, duration: 120, icon: '💆', image: '/Image/Smoothing 1.png' },
  { id: 'consultation', name: 'Consultation', price: 50000, duration: 20, icon: '💬', image: '/Image/Consultation 1.png' },
];

export let services = [];

/**
 * Mengambil data services dari Supabase, dengan fallback jika gagal
 */
export async function fetchServices() {
  if (services.length > 0) return services; // cache
  try {
    const { data, error } = await supabase.from('services').select('*');
    if (error) throw error;
    services = data;
  } catch (e) {
    console.warn("Supabase fetch failed, using fallback services:", e.message);
    services = fallbackServices;
  }
  return services;
}

export function formatPrice(price) {
  if (!price) return 'Rp 0';
  return 'Rp ' + price.toLocaleString('id-ID');
}
