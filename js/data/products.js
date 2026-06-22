/* ========================================
   DATA — Hair Products
   ======================================== */

export const products = [
  {
    id: 'deep-smoothing-serum',
    name: 'Deep Smoothing Serum',
    price: 120000,
    image: '/Image/Hair product 1.png',
    description: 'Serum smoothing premium untuk rambut lurus, halus, dan berkilau sepanjang hari.',
    fungsi: [
      'Melindungi rambut dari panas dan sinar UV',
      'Menutrisi rambut dari akar hingga ujung',
      'Mengurangi frizz dan rambut mengembang',
    ],
    manfaat: [
      'Rambut terasa lebih lembut dan halus',
      'Kilau rambut alami yang tahan lama',
      'Menjaga kelembapan rambut',
    ],
  },
  {
    id: 'hair-styling-powder',
    name: 'Hair Styling Powder',
    price: 80000,
    image: '/Image/Hair product 2.png',
    description: 'Styling powder untuk volume dan tekstur rambut yang natural. Mudah diaplikasikan.',
    fungsi: [
      'Memberikan volume instan pada rambut',
      'Tekstur matte yang natural',
      'Mudah dicuci dan dibersihkan',
    ],
    manfaat: [
      'Tampilan rambut lebih tebal dan bervolume',
      'Hold yang kuat namun tetap fleksibel',
      'Tidak membuat rambut kaku',
    ],
  },
  {
    id: 'hair-pomade',
    name: 'Hair Pomade',
    price: 95000,
    image: '/Image/Hair product 3.png',
    description: 'Pomade water-based premium dengan hold kuat dan kilau elegan. Mudah dicuci.',
    fungsi: [
      'Menata rambut dengan hold kuat',
      'Memberikan kilau premium',
      'Water-based, mudah dicuci',
    ],
    manfaat: [
      'Gaya rambut tahan sepanjang hari',
      'Tidak meninggalkan residu',
      'Cocok untuk semua jenis rambut',
    ],
  },
];

export const upsellProducts = [
  {
    id: 'hair-styling-powder',
    name: 'Hair Styling Powder',
    price: 80000,
    image: '/Image/Hair product 2.png',
    note: 'Ambil di kasir',
  },
  {
    id: 'hair-pomade',
    name: 'Hair Pomade',
    price: 95000,
    image: '/Image/Hair product 3.png',
    note: 'Ambil di kasir',
  },
];
