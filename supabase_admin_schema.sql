-- ==========================================
-- ADMIN PANEL MIGRATION SCRIPT
-- Jalankan script ini di SQL Editor Supabase
-- ==========================================

-- 1. Tambahkan kolom role ke tabel profiles jika belum ada
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
    END IF;
END $$;

-- 2. Hapus policy lama jika ada bentrok (opsional, untuk memastikan)
-- DROP POLICY IF EXISTS "Admins can manage services" ON services;
-- DROP POLICY IF EXISTS "Admins can manage barbers" ON barbers;
-- DROP POLICY IF EXISTS "Admins can manage products" ON products;
-- DROP POLICY IF EXISTS "Admins can manage bookings" ON bookings;

-- 3. Policy untuk Admin di tabel Services (ALL: Insert, Update, Delete)
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- 4. Policy untuk Admin di tabel Barbers
CREATE POLICY "Admins can manage barbers" ON barbers FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- 5. Policy untuk Admin di tabel Products
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- 6. Policy untuk Admin di tabel Bookings (Admin bisa merubah status dll)
CREATE POLICY "Admins can manage bookings" ON bookings FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ==========================================
-- CARA MENJADIKAN AKUN ANDA SEBAGAI ADMIN:
-- 1. Buka Supabase Dashboard > Table Editor > profiles
-- 2. Cari email/nama Anda
-- 3. Ubah kolom "role" menjadi "admin"
-- 4. Simpan
-- ==========================================
