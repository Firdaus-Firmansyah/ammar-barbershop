import { AdminLayout } from '../../components/AdminLayout.js';
import { supabase } from '../../supabaseClient.js';
import { formatPrice } from '../../data/services.js';
import { getState } from '../../state.js';
import { navigate } from '../../router.js';

export async function AdminBookingsPage() {
  const state = getState();
  if (state.user.role !== 'admin') {
    setTimeout(() => navigate('/'), 0);
    return '<div style="padding: 50px; text-align:center;">Access Denied. Redirecting...</div>';
  }

  let bookings = [];
  try {
    const { data, error } = await supabase.from('bookings').select(`
      id,
      booking_date,
      booking_time,
      total_price,
      status,
      created_at,
      profiles ( full_name, phone_number ),
      services ( name ),
      barbers ( name )
    `).order('created_at', { ascending: false });
    if (error) throw error;
    bookings = data || [];
  } catch (err) {
    console.error("Failed to load bookings:", err);
  }

  const content = `
    <div class="admin-card" style="overflow-x: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
        <h3>Daftar Pemesanan (Bookings)</h3>
      </div>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Pelanggan</th>
            <th>Layanan</th>
            <th>Barber</th>
            <th>Total</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${bookings.map(b => `
            <tr>
              <td>
                <div style="font-weight: 500;">${b.booking_date}</div>
                <div style="color: var(--text-muted); font-size: 0.85rem;">${b.booking_time}</div>
              </td>
              <td>
                <div>${b.profiles?.full_name || 'Unknown'}</div>
                <div style="color: var(--text-muted); font-size: 0.85rem;">${b.profiles?.phone_number || '-'}</div>
              </td>
              <td>${b.services?.name || '-'}</td>
              <td>${b.barbers?.name || '-'}</td>
              <td style="color: var(--gold-primary); font-weight: 600;">${formatPrice(b.total_price)}</td>
              <td>
                <span style="background: ${b.status === 'Selesai' ? 'rgba(34, 197, 94, 0.1)' : (b.status === 'Dibatalkan' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)')}; color: ${b.status === 'Selesai' ? '#22c55e' : (b.status === 'Dibatalkan' ? '#ef4444' : '#eab308')}; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
                  ${b.status || 'Pending'}
                </span>
              </td>
              <td>
                <select class="status-select" data-id="${b.id}" style="background: var(--bg-primary); color: var(--text-white); border: 1px solid var(--border-subtle); padding: 4px 8px; border-radius: 4px; cursor: pointer;">
                  <option value="Pending" ${(!b.status || b.status === 'Pending') ? 'selected' : ''}>Pending</option>
                  <option value="Selesai" ${b.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
                  <option value="Dibatalkan" ${b.status === 'Dibatalkan' ? 'selected' : ''}>Dibatalkan</option>
                </select>
              </td>
            </tr>
          `).join('')}
          ${bookings.length === 0 ? '<tr><td colspan="7" style="text-align:center; padding: var(--space-4);">Belum ada data pemesanan.</td></tr>' : ''}
        </tbody>
      </table>
    </div>
  `;

  setTimeout(() => {
    document.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', async (e) => {
        const id = e.target.dataset.id;
        const newStatus = e.target.value;
        const prevStatus = e.target.getAttribute('data-prev') || 'Pending';
        
        e.target.disabled = true;
        try {
          const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
          if (error) throw error;
          alert('Status berhasil diubah!');
          // Refresh page
          window.location.reload();
        } catch (err) {
          console.error(err);
          alert('Gagal mengubah status: ' + err.message);
          e.target.value = prevStatus;
        } finally {
          e.target.disabled = false;
        }
      });
    });
  }, 50);

  return AdminLayout(content, 'bookings');
}
