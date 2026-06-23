import { AdminLayout } from '../../components/AdminLayout.js';
import { supabase } from '../../supabaseClient.js';
import { formatPrice } from '../../data/services.js';
import { getState } from '../../state.js';
import { navigate } from '../../router.js';

export async function AdminServicesPage() {
  const state = getState();
  if (state.user.role !== 'admin') {
    setTimeout(() => navigate('/'), 0);
    return '<div style="padding: 50px; text-align:center;">Access Denied. Redirecting...</div>';
  }

  let services = [];
  try {
    const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    services = data || [];
  } catch (err) {
    console.error("Failed to load services:", err);
  }

  const content = `
    <div class="admin-card" style="margin-bottom: var(--space-6);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
        <h3>Manajemen Layanan (Services)</h3>
        <button class="btn btn-primary btn-sm" id="btn-add-service">+ Tambah Layanan</button>
      </div>
      
      <!-- Form Tambah/Edit -->
      <div id="service-form-container" style="display: none; background: var(--bg-primary); padding: var(--space-4); border-radius: var(--radius-md); margin-bottom: var(--space-4); border: 1px solid var(--border-subtle);">
        <h4 id="form-title" style="margin-bottom: var(--space-4);">Tambah Layanan</h4>
        <form id="service-form">
          <input type="hidden" id="service-id" />
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
            <div class="input-group">
              <label class="input-label">ID (Slug, misal: haircut)</label>
              <input type="text" class="input-field" id="service-slug" required />
            </div>
            <div class="input-group">
              <label class="input-label">Nama Layanan</label>
              <input type="text" class="input-field" id="service-name" required />
            </div>
            <div class="input-group">
              <label class="input-label">Harga (Rp)</label>
              <input type="number" class="input-field" id="service-price" required />
            </div>
            <div class="input-group">
              <label class="input-label">Durasi (Menit)</label>
              <input type="number" class="input-field" id="service-duration" required />
            </div>
            <div class="input-group">
              <label class="input-label">Path Gambar (cth: /Image/Haircut.png)</label>
              <input type="text" class="input-field" id="service-image" required />
            </div>
            <div class="input-group">
              <label class="input-label">Ikon (FontAwesome/Emoji)</label>
              <input type="text" class="input-field" id="service-icon" required />
            </div>
          </div>
          <div style="margin-top: var(--space-4); display: flex; gap: var(--space-2);">
            <button type="submit" class="btn btn-primary" id="btn-save-service">Simpan</button>
            <button type="button" class="btn btn-outline" id="btn-cancel-service">Batal</button>
          </div>
        </form>
      </div>

      <div style="overflow-x: auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Gambar</th>
              <th>Nama Layanan</th>
              <th>Harga</th>
              <th>Durasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${services.map(s => `
              <tr>
                <td><img src="${s.image}" alt="${s.name}" style="width: 40px; height: 40px; object-fit: contain; background: rgba(255,255,255,0.1); border-radius: 4px;" /></td>
                <td>
                  <div style="font-weight: 500;">${s.name}</div>
                  <div style="color: var(--text-muted); font-size: 0.85rem;">ID: ${s.id}</div>
                </td>
                <td style="color: var(--gold-primary); font-weight: 600;">${formatPrice(s.price)}</td>
                <td>${s.duration} Menit</td>
                <td>
                  <button class="btn btn-outline btn-sm btn-edit" data-item='${JSON.stringify(s).replace(/'/g, "&#39;")}' style="padding: 4px 8px; font-size: 0.75rem;">Edit</button>
                  <button class="btn btn-outline btn-sm btn-delete" data-id="${s.id}" style="padding: 4px 8px; font-size: 0.75rem; border-color: #ef4444; color: #ef4444;">Hapus</button>
                </td>
              </tr>
            `).join('')}
            ${services.length === 0 ? '<tr><td colspan="5" style="text-align:center; padding: var(--space-4);">Belum ada data layanan.</td></tr>' : ''}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setTimeout(() => {
    const formContainer = document.getElementById('service-form-container');
    const form = document.getElementById('service-form');
    let isEditing = false;

    document.getElementById('btn-add-service').addEventListener('click', () => {
      isEditing = false;
      form.reset();
      document.getElementById('service-id').value = '';
      document.getElementById('service-slug').disabled = false;
      document.getElementById('form-title').textContent = 'Tambah Layanan';
      formContainer.style.display = 'block';
    });

    document.getElementById('btn-cancel-service').addEventListener('click', () => {
      formContainer.style.display = 'none';
      form.reset();
    });

    // Edit buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = JSON.parse(e.target.dataset.item);
        isEditing = true;
        document.getElementById('service-id').value = item.id;
        document.getElementById('service-slug').value = item.id;
        document.getElementById('service-slug').disabled = true; // don't change ID
        document.getElementById('service-name').value = item.name;
        document.getElementById('service-price').value = item.price;
        document.getElementById('service-duration').value = item.duration;
        document.getElementById('service-image').value = item.image;
        document.getElementById('service-icon').value = item.icon;
        
        document.getElementById('form-title').textContent = 'Edit Layanan';
        formContainer.style.display = 'block';
        formContainer.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Delete buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (confirm(`Yakin ingin menghapus layanan ${id}?`)) {
          e.target.disabled = true;
          const { error } = await supabase.from('services').delete().eq('id', id);
          if (error) {
            alert("Gagal menghapus: " + error.message);
            e.target.disabled = false;
          } else {
            window.location.reload();
          }
        }
      });
    });

    // Form Submit
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btnSave = document.getElementById('btn-save-service');
      btnSave.disabled = true;
      btnSave.textContent = 'Menyimpan...';

      const payload = {
        id: document.getElementById('service-slug').value,
        name: document.getElementById('service-name').value,
        price: parseInt(document.getElementById('service-price').value),
        duration: parseInt(document.getElementById('service-duration').value),
        image: document.getElementById('service-image').value,
        icon: document.getElementById('service-icon').value
      };

      try {
        let error;
        if (isEditing) {
          const res = await supabase.from('services').update(payload).eq('id', payload.id);
          error = res.error;
        } else {
          const res = await supabase.from('services').insert([payload]);
          error = res.error;
        }

        if (error) throw error;
        window.location.reload();
      } catch (err) {
        alert("Gagal menyimpan: " + err.message);
        btnSave.disabled = false;
        btnSave.textContent = 'Simpan';
      }
    });

  }, 50);

  return AdminLayout(content, 'services');
}
