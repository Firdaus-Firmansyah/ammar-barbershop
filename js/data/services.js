/* ========================================
   DATA — Services Catalog
   ======================================== */

/**
 * Array yang berisi katalog layanan/service yang tersedia di Barbershop.
 * Setiap layanan mencakup nama, harga, ikon, durasi, dan gambar.
 * @type {Array<Object>}
 */
export const services = [
  {
    id: 'haircut',
    name: 'Haircut',
    price: 150000,
    icon: '✂️',
    image: '/Image/Haircut 1.png',
    description: 'Potong rambut profesional dengan teknik terkini. Termasuk konsultasi gaya rambut, cuci rambut, dan styling.',
    duration: '30-45 menit',
  },
  {
    id: 'perm',
    name: 'Perm',
    price: 350000,
    icon: '🌀',
    image: '/Image/Perm 1.png',
    description: 'Perm rambut dengan teknik modern untuk volume dan tekstur alami. Cocok untuk semua jenis rambut.',
    duration: '60-90 menit',
  },
  {
    id: 'smoothing',
    name: 'Smoothing',
    price: 400000,
    icon: '💆',
    image: '/Image/Smoothing 1.png',
    description: 'Treatment smoothing untuk rambut lurus, halus, dan berkilau. Menggunakan produk premium berkualitas tinggi.',
    duration: '90-120 menit',
  },
  {
    id: 'coloring',
    name: 'Coloring',
    price: 300000,
    icon: '🎨',
    image: '/Image/Coloring 1.png',
    description: 'Pewarnaan rambut dengan berbagai pilihan warna. Menggunakan cat rambut aman dan tahan lama.',
    duration: '60-90 menit',
  },
  {
    id: 'shave',
    name: 'Shave',
    price: 75000,
    icon: '🪒',
    image: '/Image/Shave 1.png',
    description: 'Cukur jenggot dan kumis dengan pisau cukur tradisional. Termasuk hot towel treatment dan after-shave.',
    duration: '20-30 menit',
  },
  {
    id: 'consultation',
    name: 'Hair Consultation',
    price: 50000,
    icon: '💬',
    image: '/Image/Consultation 1.png',
    description: 'Konsultasi lengkap tentang perawatan rambut, pemilihan gaya, dan rekomendasi produk dari ahli.',
    duration: '15-20 menit',
  },
];

export function formatPrice(price) {
  return 'Rp ' + price.toLocaleString('id-ID');
}
