import { AdminLayout } from '../../components/AdminLayout.js';
import { supabase } from '../../supabaseClient.js';
import { getState } from '../../state.js';
import { navigate } from '../../router.js';

export async function AdminBarbersPage() {
  const state = getState();
  if (state.user.role !== 'admin') {
    setTimeout(() => navigate('/'), 0);
    return '<div style="padding: 50px; text-align:center;">Access Denied. Redirecting...</div>';
  }

  let barbers = [];
  try {
    const { data, error } = await supabase.from('barbers').select('*').order('name', { ascending: true });
    if (error) throw error;
    barbers = data || [];
  } catch (err) {
    console.error("Failed to load barbers:", err);
  }

  const content = `
    <div class="admin-card" style="margin-bottom: var(--space-6);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
        <h3>Manajemen Staff (Barbers)</h3>
        <button class="btn btn-primary btn-sm" id="btn-add-barber">+ Tambah Barber</button>
      </div>
      
      <!-- Form Tambah/Edit -->
      <div id="barber-form-container" style="display: none; background: var(--bg-primary); padding: var(--space-4); border-radius: var(--radius-md); margin-bottom: var(--space-4); border: 1px solid var(--border-subtle);">
        <h4 id="form-title" style="margin-bottom: var(--space-4);">Tambah Barber</h4>
        <form id="barber-form">
          <input type="hidden" id="barber-id" />
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
            <div class="input-group">
              <label class="input-label">ID (Slug, misal: joko-susilo)</label>
              <input type="text" class="input-field" id="barber-slug" required />
            </div>
            <div class="input-group">
              <label class="input-label">Nama Barber</label>
              <input type="text" class="input-field" id="barber-name" required />
            </div>
            <div class="input-group">
              <label class="input-label">Usia (Tahun)</label>
              <input type="number" class="input-field" id="barber-age" required />
            </div>
            <div class="input-group">
              <label class="input-label">Spesialisasi</label>
              <input type="text" class="input-field" id="barber-specialization" required />
            </div>
            <div class="input-group">
              <label class="input-label">Pengalaman (cth: 5 Tahun)</label>
              <input type="text" class="input-field" id="barber-experience" required />
            </div>
            <div class="input-group">
              <label class="input-label">Path Gambar (cth: /Image/Staff 1.png)</label>
              <input type="text" class="input-field" id="barber-image" required />
            </div>
          </div>
          <div class="input-group" style="margin-top: var(--space-4);">
            <label class="input-label">Deskripsi / Profil Singkat</label>
            <textarea class="input-field" id="barber-description" rows="3" required></textarea>
          </div>
          <div style="margin-top: var(--space-4); display: flex; gap: var(--space-2);">
            <button type="submit" class="btn btn-primary" id="btn-save-barber">Simpan</button>
            <button type="button" class="btn btn-outline" id="btn-cancel-barber">Batal</button>
          </div>
        </form>
      </div>

      <div style="overflow-x: auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nama Barber</th>
              <th>Usia / Pengalaman</th>
              <th>Spesialisasi</th>
              <th>Rating</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${barbers.map(b => `
              <tr>
                <td><img src="${b.image}" alt="${b.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm);" /></td>
                <td>
                  <div style="font-weight: 500;">${b.name}</div>
                  <div style="color: var(--text-muted); font-size: 0.85rem;">ID: ${b.id}</div>
                </td>
                <td>
                  <div>${b.age} Tahun</div>
                  <div style="color: var(--text-muted); font-size: 0.85rem;">${b.experience}</div>
                </td>
                <td>${b.specialization}</td>
                <td style="color: var(--gold-primary); font-weight: 600;">⭐ ${b.rating} <span style="font-size: 0.8rem; color: var(--text-muted);">(${b.review_count || 0})</span></td>
                <td>
                  <button class="btn btn-outline btn-sm btn-edit" data-item='${JSON.stringify(b).replace(/'/g, "&#39;")}' style="padding: 4px 8px; font-size: 0.75rem;">Edit</button>
                  <button class="btn btn-outline btn-sm btn-delete" data-id="${b.id}" style="padding: 4px 8px; font-size: 0.75rem; border-color: #ef4444; color: #ef4444;">Hapus</button>
                </td>
              </tr>
            `).join('')}
            ${barbers.length === 0 ? '<tr><td colspan="6" style="text-align:center; padding: var(--space-4);">Belum ada data staff.</td></tr>' : ''}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setTimeout(() => {
    const formContainer = document.getElementById('barber-form-container');
    const form = document.getElementById('barber-form');
    let isEditing = false;

    document.getElementById('btn-add-barber').addEventListener('click', () => {
      isEditing = false;
      form.reset();
      document.getElementById('barber-id').value = '';
      document.getElementById('barber-slug').disabled = false;
      document.getElementById('form-title').textContent = 'Tambah Barber';
      formContainer.style.display = 'block';
    });

    document.getElementById('btn-cancel-barber').addEventListener('click', () => {
      formContainer.style.display = 'none';
      form.reset();
    });

    // Edit buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = JSON.parse(e.target.dataset.item);
        isEditing = true;
        document.getElementById('barber-id').value = item.id;
        document.getElementById('barber-slug').value = item.id;
        document.getElementById('barber-slug').disabled = true;
        document.getElementById('barber-name').value = item.name;
        document.getElementById('barber-age').value = item.age;
        document.getElementById('barber-specialization').value = item.specialization;
        document.getElementById('barber-experience').value = item.experience;
        document.getElementById('barber-image').value = item.image;
        document.getElementById('barber-description').value = item.description;
        
        document.getElementById('form-title').textContent = 'Edit Barber';
        formContainer.style.display = 'block';
        formContainer.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Delete buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (confirm(`Yakin ingin menghapus barber ${id}?`)) {
          e.target.disabled = true;
          const { error } = await supabase.from('barbers').delete().eq('id', id);
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
      const btnSave = document.getElementById('btn-save-barber');
      btnSave.disabled = true;
      btnSave.textContent = 'Menyimpan...';

      const payload = {
        id: document.getElementById('barber-slug').value,
        name: document.getElementById('barber-name').value,
        age: parseInt(document.getElementById('barber-age').value),
        specialization: document.getElementById('barber-specialization').value,
        experience: document.getElementById('barber-experience').value,
        image: document.getElementById('barber-image').value,
        description: document.getElementById('barber-description').value
      };

      try {
        let error;
        if (isEditing) {
          const res = await supabase.from('barbers').update(payload).eq('id', payload.id);
          error = res.error;
        } else {
          // If inserting new, set default rating
          payload.rating = 5.0;
          payload.review_count = 0;
          const res = await supabase.from('barbers').insert([payload]);
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

  return AdminLayout(content, 'barbers');
}
