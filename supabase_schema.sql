-- Ammar Barbershop Supabase Database Schema

-- 1. Profiles Table (Extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  gender TEXT CHECK (gender IN ('Male', 'Female')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Services Table
CREATE TABLE public.services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  icon TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are viewable by everyone." ON services FOR SELECT USING (true);

-- 3. Products Table
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hair-care', 'upsell')),
  image TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone." ON products FOR SELECT USING (true);

-- 4. Barbers Table
CREATE TABLE public.barbers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  specialization TEXT NOT NULL,
  experience TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for barbers
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Barbers are viewable by everyone." ON barbers FOR SELECT USING (true);

-- 5. Barber Services Junction Table (Which barber provides which service and specific rating)
CREATE TABLE public.barber_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  barber_id TEXT REFERENCES barbers(id) ON DELETE CASCADE,
  service_id TEXT REFERENCES services(id) ON DELETE CASCADE,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  UNIQUE(barber_id, service_id)
);

-- Enable RLS for barber_services
ALTER TABLE public.barber_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Barber services are viewable by everyone." ON barber_services FOR SELECT USING (true);

-- 6. Bookings Table
CREATE TABLE public.bookings (
  id TEXT PRIMARY KEY, -- ex: AMR-2024-1234
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Allow guest bookings temporarily
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service_id TEXT REFERENCES services(id) NOT NULL,
  barber_id TEXT REFERENCES barbers(id) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'qris', 'ewallet')),
  total_price INTEGER NOT NULL,
  discount INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(barber_id, booking_date, booking_time) -- Prevent double booking for the same barber
);

-- Enable RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own bookings." ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookings." ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 7. Booking Addons (Products bought during booking)
CREATE TABLE public.booking_addons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id TEXT REFERENCES bookings(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  price_at_booking INTEGER NOT NULL
);

-- Enable RLS for booking_addons
ALTER TABLE public.booking_addons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own addons." ON booking_addons FOR SELECT USING (true);
CREATE POLICY "Users can insert addons." ON booking_addons FOR INSERT WITH CHECK (true);


-- =======================================================
-- SEED DATA (Initial Data Insertion)
-- =======================================================

-- Seed Services
INSERT INTO public.services (id, name, price, duration, icon, image) VALUES
('haircut', 'Classic Haircut', 150000, 45, 'fa-scissors', '/Image/Haircut.png'),
('shave', 'Hot Towel Shave', 75000, 30, 'fa-razor', '/Image/Shave 1.png'),
('coloring', 'Hair Coloring', 250000, 90, 'fa-palette', '/Image/Coloring 1.png'),
('perm', 'Korean Perm', 350000, 120, 'fa-water', '/Image/Perm 1.png'),
('smoothing', 'Keratin Smoothing', 450000, 120, 'fa-wind', '/Image/Smoothing 1.png'),
('consultation', 'Style Consultation', 50000, 20, 'fa-comments', '/Image/Consultation 1.png');

-- Seed Products (Hair-care)
INSERT INTO public.products (id, name, price, category, image, description) VALUES
('deep-smoothing-serum', 'Deep Smoothing Serum', 155000, 'hair-care', '/Image/Hair product 1.png', 'Serum khusus untuk melembutkan rambut kaku dan kering.'),
('texture-clay', 'Texture Clay Pomade', 185000, 'hair-care', '/Image/Hair product 2.png', 'Pomade dengan daya rekat tinggi dan hasil akhir matte natural.'),
('hair-tonic-ginseng', 'Ginseng Hair Tonic', 125000, 'hair-care', '/Image/Hair product 3.png', 'Tonic rambut untuk memperkuat akar dan mencegah kerontokan.');

-- Seed Products (Upsell)
INSERT INTO public.products (id, name, price, category, image, description) VALUES
('hair-styling-powder', 'Texture Styling Powder', 85000, 'upsell', '/Image/Hair product 1.png', 'Bedak rambut untuk menambah volume dan tekstur secara instan. Sangat cocok untuk model rambut modern.'),
('beard-oil-premium', 'Premium Beard Oil', 120000, 'upsell', '/Image/Hair product 2.png', 'Minyak perawatan brewok dengan aroma maskulin yang elegan. Melembutkan dan merangsang pertumbuhan.'),
('scalp-massage', 'Relaxing Scalp Massage (15 Min)', 50000, 'upsell', '/Image/Consultation 1.png', 'Tambahan pijat kepala relaksasi selama 15 menit menggunakan tonik penyegar khusus.');

-- Seed Barbers
INSERT INTO public.barbers (id, name, age, specialization, experience, description, image, rating, review_count) VALUES
('onic-gilang', 'Onic Gilang', 28, 'Korean Perm & Texture', '5 Tahun', 'Onic Gilang adalah pakar dalam gaya rambut Korea dan tekstur modern. Selalu up-to-date dengan tren Asia terkini.', '/Image/Staff Profile haircut Onic Gilang.png', 4.9, 245),
('rrq-ammar', 'Rrq Ammar', 25, 'Fade & Modern Cut', '3 Tahun', 'Rrq Ammar memiliki keahlian khusus dalam teknik fade dan potongan modern yang sedang tren saat ini.', '/Image/Staff 2.png', 4.8, 189),
('ae-roman', 'AE Roman', 30, 'Classic Cut & Masculine Style', '8 Tahun', 'AE Roman memiliki keahlian bertahun-tahun dengan spesialisasi potongan classic dan gaya maskulin yang elegan.', '/Image/Staff 3.png', 4.9, 312),
('evos-dika', 'Evos Dika', 26, 'Hair Coloring & Treatment', '4 Tahun', 'Spesialis warna rambut dan perawatan. Hasil karyanya selalu berani, rapi, dan menjaga kesehatan rambut.', '/Image/Staff 4.png', 4.7, 156),
('btr-zuxxy', 'BTR Zuxxy', 24, 'Street Style & Undercut', '3 Tahun', 'Gaya jalanan dan undercut tajam adalah andalannya. Cocok untuk Anda yang ingin tampil berani dan beda.', '/Image/Staff 5.png', 4.8, 201),
('aura-kabuki', 'Aura Kabuki', 29, 'Hot Towel Shave & Grooming', '7 Tahun', 'Berpengalaman dalam ritual shaving tradisional dan grooming pria yang sangat detail dan rileks.', '/Image/Staff 6.png', 5.0, 420),
('alter-ego-celiboy', 'AE Celiboy', 23, 'Modern Mullet & Wolf Cut', '2 Tahun', 'Talenta muda yang sangat mahir membentuk mullet dan wolf cut yang saat ini sedang hype di kalangan anak muda.', '/Image/Staff 7.png', 4.6, 112),
('geek-fam-baloyskie', 'Geek Baloyskie', 32, 'Executive Cut & Styling', '10 Tahun', 'Senior barber untuk gaya eksekutif profesional. Sangat teliti dan memberikan konsultasi gaya terbaik.', '/Image/Staff 8.png', 4.9, 534);

-- Seed Barber Services (Which barber provides which service and their rating)
-- (Simplified: Giving every barber the 'haircut' and 'shave' services as an example)
INSERT INTO public.barber_services (barber_id, service_id, rating, review_count)
SELECT b.id, 'haircut', b.rating, b.review_count FROM barbers b;

INSERT INTO public.barber_services (barber_id, service_id, rating, review_count)
SELECT b.id, 'shave', b.rating - 0.1, b.review_count / 2 FROM barbers b;

