import { AdminLayout } from '../../components/AdminLayout.js';
import { supabase } from '../../supabaseClient.js';
import { formatPrice } from '../../data/services.js';
import { getState } from '../../state.js';
import { navigate } from '../../router.js';

export async function AdminDashboardPage() {
  const state = getState();
  if (state.user.role !== 'admin') {
    setTimeout(() => navigate('/'), 0);
    return '<div style="padding: 50px; text-align:center;">Access Denied. Redirecting...</div>';
  }

  let stats = {
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    completedBookings: 0
  };

  try {
    const { data, error } = await supabase.from('bookings').select('total_price, status');
    if (error) throw error;
    
    if (data) {
      stats.totalBookings = data.length;
      stats.totalRevenue = data.filter(b => b.status === 'Selesai').reduce((sum, b) => sum + (b.total_price || 0), 0);
      stats.pendingBookings = data.filter(b => !b.status || b.status === 'Pending').length;
      stats.completedBookings = data.filter(b => b.status === 'Selesai').length;
    }
  } catch (err) {
    console.error("Failed to load admin stats:", err);
  }

  const content = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-8);">
      <div class="admin-card">
        <h3 style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: var(--space-2);">Total Bookings</h3>
        <div style="font-size: 2rem; font-weight: 700;">${stats.totalBookings}</div>
      </div>
      <div class="admin-card">
        <h3 style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: var(--space-2);">Pendapatan (Selesai)</h3>
        <div style="font-size: 2rem; font-weight: 700; color: var(--gold-primary);">${formatPrice(stats.totalRevenue)}</div>
      </div>
      <div class="admin-card">
        <h3 style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: var(--space-2);">Bookings Pending</h3>
        <div style="font-size: 2rem; font-weight: 700; color: #eab308;">${stats.pendingBookings}</div>
      </div>
      <div class="admin-card">
        <h3 style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: var(--space-2);">Bookings Selesai</h3>
        <div style="font-size: 2rem; font-weight: 700; color: #22c55e;">${stats.completedBookings}</div>
      </div>
    </div>

    <div class="admin-card">
      <h3 style="margin-bottom: var(--space-4);">Selamat Datang di Admin Panel</h3>
      <p style="color: var(--text-muted); line-height: 1.6;">
        Dari panel ini Anda dapat melihat ringkasan performa barbershop Anda.
        Gunakan menu di sebelah kiri untuk mengelola data master (Services, Barbers, Products) 
        dan melihat serta mengubah status pemesanan (Bookings).
      </p>
    </div>
  `;

  return AdminLayout(content, 'dashboard');
}
