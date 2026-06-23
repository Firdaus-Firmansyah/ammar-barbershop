import { supabase } from '../supabaseClient.js';

export let barbers = [];

export async function fetchBarbers() {
  const { data, error } = await supabase.from('barbers').select('*');
  if (error) {
    console.error("Error fetching barbers:", error);
    return [];
  }
  
  // Ambil juga data barber_services
  const { data: bServices, error: err2 } = await supabase.from('barber_services').select(`
    barber_id, rating, review_count, services(name, price)
  `);
  
  if (err2) console.error("Error fetching barber services:", err2);

  // Gabungkan
  barbers = data.map(b => {
    let bs = bServices ? bServices.filter(s => s.barber_id === b.id) : [];
    return {
      ...b,
      services: bs.map(item => ({
        name: item.services.name,
        price: item.services.price,
        rating: item.rating,
        reviewCount: item.review_count
      }))
    };
  });
  
  return barbers;
}
