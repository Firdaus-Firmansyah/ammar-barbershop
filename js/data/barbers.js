import { supabase } from '../supabaseClient.js';

const fallbackBarbers = [
  { id: 'onic-gilang', name: 'Onic Gilang', age: 28, specialization: 'Korean Perm & Texture', experience: '5 Tahun', description: 'Onic Gilang adalah pakar dalam gaya rambut Korea dan tekstur modern.', image: '/Image/Staff Profile haircut Onic Gilang.png', rating: 4.9, review_count: 245, services: [{ name: 'Haircut', price: 150000, rating: 4.9, reviewCount: 245 }, { name: 'Shave', price: 75000, rating: 4.8, reviewCount: 122 }] },
  { id: 'rrq-ammar', name: 'Rrq Ammar', age: 25, specialization: 'Fade & Modern Cut', experience: '3 Tahun', description: 'Rrq Ammar memiliki keahlian khusus dalam teknik fade dan potongan modern.', image: '/Image/Staff 2.png', rating: 4.8, review_count: 189, services: [{ name: 'Haircut', price: 150000, rating: 4.8, reviewCount: 189 }, { name: 'Shave', price: 75000, rating: 4.7, reviewCount: 94 }] },
  { id: 'ae-roman', name: 'AE Roman', age: 30, specialization: 'Classic Cut & Masculine Style', experience: '8 Tahun', description: 'AE Roman memiliki keahlian bertahun-tahun dengan spesialisasi potongan classic.', image: '/Image/Staff 3.png', rating: 4.9, review_count: 312, services: [{ name: 'Haircut', price: 150000, rating: 4.9, reviewCount: 312 }, { name: 'Shave', price: 75000, rating: 4.8, reviewCount: 156 }] },
  { id: 'evos-dika', name: 'Evos Dika', age: 26, specialization: 'Hair Coloring & Treatment', experience: '4 Tahun', description: 'Spesialis warna rambut dan perawatan.', image: '/Image/Staff 4.png', rating: 4.7, review_count: 156, services: [{ name: 'Haircut', price: 150000, rating: 4.7, reviewCount: 156 }, { name: 'Shave', price: 75000, rating: 4.6, reviewCount: 78 }] },
  { id: 'btr-zuxxy', name: 'BTR Zuxxy', age: 24, specialization: 'Street Style & Undercut', experience: '3 Tahun', description: 'Gaya jalanan dan undercut tajam adalah andalannya.', image: '/Image/Staff 5.png', rating: 4.8, review_count: 201, services: [{ name: 'Haircut', price: 150000, rating: 4.8, reviewCount: 201 }, { name: 'Shave', price: 75000, rating: 4.7, reviewCount: 100 }] },
  { id: 'aura-kabuki', name: 'Aura Kabuki', age: 29, specialization: 'Hot Towel Shave & Grooming', experience: '7 Tahun', description: 'Berpengalaman dalam ritual shaving tradisional.', image: '/Image/Staff 6.png', rating: 5.0, review_count: 420, services: [{ name: 'Haircut', price: 150000, rating: 5.0, reviewCount: 420 }, { name: 'Shave', price: 75000, rating: 4.9, reviewCount: 210 }] },
  { id: 'alter-ego-celiboy', name: 'AE Celiboy', age: 23, specialization: 'Modern Mullet & Wolf Cut', experience: '2 Tahun', description: 'Talenta muda yang sangat mahir membentuk mullet dan wolf cut.', image: '/Image/Staff 7.png', rating: 4.6, review_count: 112, services: [{ name: 'Haircut', price: 150000, rating: 4.6, reviewCount: 112 }, { name: 'Shave', price: 75000, rating: 4.5, reviewCount: 56 }] },
  { id: 'geek-fam-baloyskie', name: 'Geek Baloyskie', age: 32, specialization: 'Executive Cut & Styling', experience: '10 Tahun', description: 'Senior barber untuk gaya eksekutif profesional.', image: '/Image/Staff 8.png', rating: 4.9, review_count: 534, services: [{ name: 'Haircut', price: 150000, rating: 4.9, reviewCount: 534 }, { name: 'Shave', price: 75000, rating: 4.8, reviewCount: 267 }] },
];

export let barbers = [];

export async function fetchBarbers() {
  if (barbers.length > 0) return barbers; // cache
  try {
    const { data, error } = await supabase.from('barbers').select('*');
    if (error) throw error;

    // Ambil juga data barber_services
    const { data: bServices, error: err2 } = await supabase.from('barber_services').select(`
      barber_id, rating, review_count, services(name, price)
    `);

    if (err2) console.warn("Error fetching barber services:", err2);

    // Gabungkan
    barbers = data.map(b => {
      // FIX ONIC GILANG IMAGE AS REQUESTED
      if (b.id === 'onic-gilang') {
        b.image = '/Image/Staff 1.png';
      }
      
      let bs = bServices ? bServices.filter(s => s.barber_id === b.id) : [];
      return {
        ...b,
        services: bs.length > 0 ? bs.map(item => ({
          name: item.services?.name || 'Service',
          price: item.services?.price || 0,
          rating: item.rating,
          reviewCount: item.review_count
        })) : [{ name: 'Haircut', price: 150000, rating: b.rating, reviewCount: b.review_count }]
      };
    });
  } catch (e) {
    console.warn("Supabase fetch failed, using fallback barbers:", e.message);
    barbers = fallbackBarbers;
  }
  return barbers;
}
