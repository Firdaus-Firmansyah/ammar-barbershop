import { supabase } from '../supabaseClient.js';

const fallbackProducts = [
  { id: 'deep-smoothing-serum', name: 'Deep Smoothing Serum', price: 155000, category: 'hair-care', image: '/Image/Hair product 1.png', description: 'Serum khusus untuk melembutkan rambut kaku dan kering.' },
  { id: 'texture-clay', name: 'Texture Clay Pomade', price: 185000, category: 'hair-care', image: '/Image/Hair product 2.png', description: 'Pomade dengan daya rekat tinggi dan hasil akhir matte natural.' },
  { id: 'hair-tonic-ginseng', name: 'Ginseng Hair Tonic', price: 125000, category: 'hair-care', image: '/Image/Hair product 3.png', description: 'Tonic rambut untuk memperkuat akar dan mencegah kerontokan.' },
];

const fallbackUpsell = [
  { id: 'hair-styling-powder', name: 'Texture Styling Powder', price: 85000, category: 'upsell', image: '/Image/Hair product 1.png', description: 'Bedak rambut untuk menambah volume dan tekstur secara instan.' },
  { id: 'beard-oil-premium', name: 'Premium Beard Oil', price: 120000, category: 'upsell', image: '/Image/Hair product 2.png', description: 'Minyak perawatan brewok dengan aroma maskulin yang elegan.' },
  { id: 'scalp-massage', name: 'Relaxing Scalp Massage (15 Min)', price: 50000, category: 'upsell', image: '/Image/Consultation 1.png', description: 'Tambahan pijat kepala relaksasi selama 15 menit.' },
];

export let products = [];
export let upsellProducts = [];

export async function fetchProducts() {
  if (products.length > 0) return products; // cache
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    products = data.filter(p => p.category === 'hair-care');
    upsellProducts = data.filter(p => p.category === 'upsell');
  } catch (e) {
    console.warn("Supabase fetch failed, using fallback products:", e.message);
    products = fallbackProducts;
    upsellProducts = fallbackUpsell;
  }
  return products;
}
