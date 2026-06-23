import { AdminLayout } from '../../components/AdminLayout.js';
import { supabase } from '../../supabaseClient.js';
import { formatPrice } from '../../data/services.js';
import { getState } from '../../state.js';
import { navigate } from '../../router.js';

export async function AdminProductsPage() {
  const state = getState();
  if (state.user.role !== 'admin') {
    setTimeout(() => navigate('/'), 0);
    return '<div style="padding: 50px; text-align:center;">Access Denied. Redirecting...</div>';
  }

  let products = [];
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    products = data || [];
  } catch (err) {
    console.error("Failed to load products:", err);
  }

  const content = `
    <div class="admin-card" style="margin-bottom: var(--space-6);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
        <h3>Manajemen Produk & Upsell</h3>
        <button class="btn btn-primary btn-sm" id="btn-add-product">+ Tambah Produk</button>
      </div>
      
      <!-- Form Tambah/Edit -->
      <div id="product-form-container" style="display: none; background: var(--bg-primary); padding: var(--space-4); border-radius: var(--radius-md); margin-bottom: var(--space-4); border: 1px solid var(--border-subtle);">
        <h4 id="form-title" style="margin-bottom: var(--space-4);">Tambah Produk</h4>
        <form id="product-form">
          <input type="hidden" id="product-id" />
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
            <div class="input-group">
              <label class="input-label">ID (Slug, misal: pomade-clay)</label>
              <input type="text" class="input-field" id="product-slug" required />
            </div>
            <div class="input-group">
              <label class="input-label">Nama Produk</label>
              <input type="text" class="input-field" id="product-name" required />
            </div>
            <div class="input-group">
              <label class="input-label">Harga (Rp)</label>
              <input type="number" class="input-field" id="product-price" required />
            </div>
            <div class="input-group">
              <label class="input-label">Kategori</label>
              <select class="input-field" id="product-category" required>
                <option value="hair-care">Hair Care (Produk Fisik)</option>
                <option value="upsell">Upsell (Layanan Tambahan)</option>
              </select>
            </div>
            <div class="input-group" style="grid-column: span 2;">
              <label class="input-label">Path Gambar (cth: /Image/Hair product 1.png)</label>
              <input type="text" class="input-field" id="product-image" required />
            </div>
          </div>
          <div class="input-group" style="margin-top: var(--space-4);">
            <label class="input-label">Deskripsi Produk</label>
            <textarea class="input-field" id="product-description" rows="3" required></textarea>
          </div>
          <div style="margin-top: var(--space-4); display: flex; gap: var(--space-2);">
            <button type="submit" class="btn btn-primary" id="btn-save-product">Simpan</button>
            <button type="button" class="btn btn-outline" id="btn-cancel-product">Batal</button>
          </div>
        </form>
      </div>

      <div style="overflow-x: auto;">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Gambar</th>
              <th>Nama Produk</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td><img src="${p.image}" alt="${p.name}" style="width: 40px; height: 40px; object-fit: contain; background: rgba(255,255,255,0.1); border-radius: 4px;" /></td>
                <td>
                  <div style="font-weight: 500;">${p.name}</div>
                  <div style="color: var(--text-muted); font-size: 0.85rem;">ID: ${p.id}</div>
                </td>
                <td>
                  <span style="background: ${p.category === 'hair-care' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(168, 85, 247, 0.1)'}; color: ${p.category === 'hair-care' ? '#3b82f6' : '#a855f7'}; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
                    ${p.category === 'hair-care' ? 'Hair Care' : 'Upsell'}
                  </span>
                </td>
                <td style="color: var(--gold-primary); font-weight: 600;">${formatPrice(p.price)}</td>
                <td>
                  <button class="btn btn-outline btn-sm btn-edit" data-item='${JSON.stringify(p).replace(/'/g, "&#39;")}' style="padding: 4px 8px; font-size: 0.75rem;">Edit</button>
                  <button class="btn btn-outline btn-sm btn-delete" data-id="${p.id}" style="padding: 4px 8px; font-size: 0.75rem; border-color: #ef4444; color: #ef4444;">Hapus</button>
                </td>
              </tr>
            `).join('')}
            ${products.length === 0 ? '<tr><td colspan="5" style="text-align:center; padding: var(--space-4);">Belum ada data produk.</td></tr>' : ''}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setTimeout(() => {
    const formContainer = document.getElementById('product-form-container');
    const form = document.getElementById('product-form');
    let isEditing = false;

    document.getElementById('btn-add-product').addEventListener('click', () => {
      isEditing = false;
      form.reset();
      document.getElementById('product-id').value = '';
      document.getElementById('product-slug').disabled = false;
      document.getElementById('form-title').textContent = 'Tambah Produk';
      formContainer.style.display = 'block';
    });

    document.getElementById('btn-cancel-product').addEventListener('click', () => {
      formContainer.style.display = 'none';
      form.reset();
    });

    // Edit buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = JSON.parse(e.target.dataset.item);
        isEditing = true;
        document.getElementById('product-id').value = item.id;
        document.getElementById('product-slug').value = item.id;
        document.getElementById('product-slug').disabled = true;
        document.getElementById('product-name').value = item.name;
        document.getElementById('product-price').value = item.price;
        document.getElementById('product-category').value = item.category;
        document.getElementById('product-image').value = item.image;
        document.getElementById('product-description').value = item.description;
        
        document.getElementById('form-title').textContent = 'Edit Produk';
        formContainer.style.display = 'block';
        formContainer.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Delete buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (confirm(`Yakin ingin menghapus produk ${id}?`)) {
          e.target.disabled = true;
          const { error } = await supabase.from('products').delete().eq('id', id);
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
      const btnSave = document.getElementById('btn-save-product');
      btnSave.disabled = true;
      btnSave.textContent = 'Menyimpan...';

      const payload = {
        id: document.getElementById('product-slug').value,
        name: document.getElementById('product-name').value,
        price: parseInt(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        image: document.getElementById('product-image').value,
        description: document.getElementById('product-description').value
      };

      try {
        let error;
        if (isEditing) {
          const res = await supabase.from('products').update(payload).eq('id', payload.id);
          error = res.error;
        } else {
          const res = await supabase.from('products').insert([payload]);
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

  return AdminLayout(content, 'products');
}
