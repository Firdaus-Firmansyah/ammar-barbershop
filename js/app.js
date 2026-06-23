/* ========================================
   APP — Main Entry Point
   Ammar Barbershop SPA
   ======================================== */

import { registerRoute, initRouter } from './router.js';
import { LandingPage } from './pages/LandingPage.js';
import { AuthPage } from './pages/AuthPage.js';
import { ServicePage } from './pages/ServicePage.js';
import { BarberPage } from './pages/BarberPage.js';
import { SchedulePage } from './pages/SchedulePage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { SuccessPage } from './pages/SuccessPage.js';
import { BookingHistoryPage } from './pages/BookingHistoryPage.js';
import { supabase } from './supabaseClient.js';
import { updateNested, getState } from './state.js';

/**
 * Mendaftarkan semua route/halaman pada aplikasi.
 * '/' adalah route default untuk Landing Page.
 */
registerRoute('/', LandingPage);
registerRoute('/auth', AuthPage);
registerRoute('/services', ServicePage);
registerRoute('/barbers', BarberPage);
registerRoute('/schedule', SchedulePage);
registerRoute('/checkout', CheckoutPage);
registerRoute('/success', SuccessPage);
registerRoute('/booking-history', BookingHistoryPage);

// Admin Routes
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage.js';
import { AdminServicesPage } from './pages/admin/AdminServicesPage.js';
import { AdminBarbersPage } from './pages/admin/AdminBarbersPage.js';
import { AdminProductsPage } from './pages/admin/AdminProductsPage.js';

registerRoute('/admin', AdminDashboardPage);
registerRoute('/admin/bookings', AdminBookingsPage);
registerRoute('/admin/services', AdminServicesPage);
registerRoute('/admin/barbers', AdminBarbersPage);
registerRoute('/admin/products', AdminProductsPage);

/**
 * Cek sesi Supabase yang masih aktif saat pertama kali load.
 * Jika user pernah login dan belum logout, state akan dipulihkan.
 */
async function restoreSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const user = session.user;
      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) {
        const newProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email.split('@')[0],
          role: 'user'
        };
        const { error: upsertErr } = await supabase.from('profiles').upsert(newProfile);
        if (!upsertErr) profile = newProfile;
      }

      updateNested('user.id', user.id);
      updateNested('user.name', profile?.full_name || user.user_metadata?.full_name || '');
      updateNested('user.email', user.email || '');
      updateNested('user.phone', profile?.phone_number || user.user_metadata?.phone_number || '');
      updateNested('user.gender', profile?.gender?.toLowerCase() === 'male' ? 'pria' : (profile?.gender?.toLowerCase() === 'female' ? 'wanita' : ''));
      updateNested('user.role', profile?.role || 'user');
      updateNested('user.isLoggedIn', true);
    }
  } catch (e) {
    console.warn("Session restore failed:", e.message);
  }
}

async function initApp() {
  await restoreSession();
  
  /**
   * Menginisialisasi router sehingga aplikasi mulai mendengarkan
   * perubahan URL (hash) dan merender halaman pertama.
   */
  initRouter();

  // Log startup
  console.log('%c✂️ Ammar Barbershop', 'color: #C59D5F; font-size: 20px; font-weight: bold;');
  console.log('%cApp initialized successfully', 'color: #9CA3AF; font-size: 12px;');
}

initApp();

