/* ========================================
   DATA — Barber Profiles
   ======================================== */

/**
 * Array yang berisi daftar staff/barber.
 * Setiap object barber berisi informasi dasar, keahlian, gambar,
 * serta daftar layanan yang bisa mereka lakukan beserta harga/ratingnya.
 * @type {Array<Object>}
 */
export const barbers = [
  {
    id: 'onic-gilang',
    name: 'Onic Gilang',
    age: 28,
    specialization: 'Haircut & Coloring',
    experience: '5 Tahun',
    description: 'Onic Gilang adalah seorang yang sangat teliti, sehingga banyak customer yang ingin melakukan haircare kepadanya.',
    image: '/Image/Staff 1.png',
    rating: 5.0,
    reviewCount: 234,
    services: [
      { name: 'Haircut', price: 150000, rating: 5.0, reviewCount: 234 },
      { name: 'Coloring', price: 300000, rating: 5.0, reviewCount: 135 },
    ],
  },
  {
    id: 'rrq-ammar',
    name: 'Rrq Ammar',
    age: 25,
    specialization: 'Fade & Modern Cut',
    experience: '3 Tahun',
    description: 'Rrq Ammar memiliki keahlian khusus dalam teknik fade dan potongan modern yang sedang tren saat ini.',
    image: '/Image/Staff 2.png',
    rating: 4.8,
    reviewCount: 189,
    services: [
      { name: 'Haircut', price: 150000, rating: 4.8, reviewCount: 189 },
      { name: 'Shave', price: 75000, rating: 4.9, reviewCount: 98 },
    ],
  },
  {
    id: 'ae-roman',
    name: 'AE Roman',
    age: 30,
    specialization: 'Classic Cut & Masculine Style',
    experience: '8 Tahun',
    description: 'AE Roman memiliki keahlian bertahun-tahun dengan spesialisasi potongan classic dan gaya maskulin yang elegan.',
    image: '/Image/Staff 3.png',
    rating: 4.9,
    reviewCount: 312,
    services: [
      { name: 'Haircut', price: 150000, rating: 4.9, reviewCount: 312 },
      { name: 'Shave', price: 75000, rating: 5.0, reviewCount: 145 },
    ],
  },
  {
    id: 'evos-ilham',
    name: 'Evos Ilham',
    age: 26,
    specialization: 'Perm & Smoothing',
    experience: '4 Tahun',
    description: 'Evos Ilham adalah ahli dalam teknik perm dan smoothing. Selalu memberikan hasil yang memuaskan pelanggan.',
    image: '/Image/Staff 4.png',
    rating: 4.7,
    reviewCount: 156,
    services: [
      { name: 'Perm', price: 350000, rating: 4.7, reviewCount: 156 },
      { name: 'Smoothing', price: 400000, rating: 4.8, reviewCount: 89 },
    ],
  },
  {
    id: 'geek-rahma',
    name: 'Geek Rahma',
    age: 24,
    specialization: 'Hair Consultation & Styling',
    experience: '3 Tahun',
    description: 'Geek Rahma terkenal dengan konsultasi rambut yang mendalam dan styling kreatif untuk setiap pelanggan.',
    image: '/Image/Staff 5.png',
    rating: 4.8,
    reviewCount: 178,
    services: [
      { name: 'Hair Consultation', price: 50000, rating: 4.8, reviewCount: 178 },
      { name: 'Haircut', price: 150000, rating: 4.7, reviewCount: 134 },
    ],
  },
];
