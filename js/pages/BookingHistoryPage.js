/* ========================================
   BOOKING HISTORY PAGE
   ======================================== */

import { createNavbar, createFooter } from '../components/shared.js';
import { getState } from '../state.js';
import { navigate } from '../router.js';
import { supabase } from '../supabaseClient.js';
import { formatPrice } from '../data/services.js';

export async function BookingHistoryPage() {
  const state = getState();
  
  if (!state.user.isLoggedIn) {
    setTimeout(() => navigate('/auth'), 0);
    return '<div style="min-height:100vh; display:flex; align-items:center; justify-content:center; color: var(--text-muted);">Redirecting to Login...</div>';
  }

  let bookings = [];
  let isLoading = true;
  let errorMessage = '';

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        booking_date,
        booking_time,
        total_price,
        status,
        barbers ( name ),
        services ( name )
      `)
      .eq('user_id', state.user.id)
      .order('booking_date', { ascending: false })
      .order('booking_time', { ascending: false });

    if (error) throw error;
    bookings = data || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    errorMessage = 'Gagal memuat jadwal booking. Pastikan Anda terhubung ke internet.';
  }

  isLoading = false;

  const html = `
    <div class="page-container" style="padding-top: 100px; min-height: 100vh;">
      ${createNavbar()}
      
      <div class="container" style="max-width: 800px; margin: 0 auto; padding-bottom: var(--space-8);">
        <h2 style="font-size: 2rem; margin-bottom: var(--space-2); color: var(--gold-primary);">Jadwal Booking Saya</h2>
        <p style="color: var(--text-muted); margin-bottom: var(--space-6);">Riwayat dan jadwal layanan yang telah Anda pesan.</p>
        
        ${errorMessage ? `<div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: var(--space-3); border-radius: var(--radius-md); margin-bottom: var(--space-4);">${errorMessage}</div>` : ''}
        
        ${bookings.length === 0 && !errorMessage ? `
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: var(--space-8); text-align: center;">
            <div style="font-size: 3rem; margin-bottom: var(--space-4);">📅</div>
            <h3 style="font-size: 1.25rem; margin-bottom: var(--space-2);">Belum ada booking</h3>
            <p style="color: var(--text-muted); margin-bottom: var(--space-6);">Anda belum merencanakan layanan apapun. Yuk, jadwalkan potongan rambut Anda sekarang!</p>
            <a href="#/services" class="btn btn-primary">Booking Sekarang</a>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            ${bookings.map(b => `
              <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: var(--space-4); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-4);">
                <div>
                  <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2);">
                    <span style="background: ${b.status === 'Selesai' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)'}; color: ${b.status === 'Selesai' ? '#22c55e' : '#eab308'}; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
                      ${b.status || 'Pending'}
                    </span>
                    <strong style="font-size: 1.1rem;">${b.services?.name || 'Service'}</strong>
                  </div>
                  <div style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 4px;">
                    💈 Barber: <span style="color: var(--text-white);">${b.barbers?.name || '-'}</span>
                  </div>
                  <div style="color: var(--text-muted); font-size: 0.9rem;">
                    📅 Tanggal: <span style="color: var(--text-white);">${b.booking_date} | ${b.booking_time}</span>
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="color: var(--gold-primary); font-size: 1.25rem; font-weight: 700;">
                    ${formatPrice(b.total_price)}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
      
      ${createFooter()}
    </div>
  `;

  return html;
}
