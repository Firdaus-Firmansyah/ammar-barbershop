import { getState } from '../state.js';
import { supabase } from '../supabaseClient.js';
import { updateNested, resetBooking } from '../state.js';

export function AdminLayout(content, activeTab = 'dashboard') {
  const state = getState();
  const userName = state.user?.name || 'Admin';

  // Logout handler needs to be attached after render
  setTimeout(() => {
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        updateNested('user.name', '');
        updateNested('user.email', '');
        updateNested('user.phone', '');
        updateNested('user.gender', '');
        updateNested('user.role', 'user');
        updateNested('user.isLoggedIn', false);
        updateNested('user.id', null);
        resetBooking();
        localStorage.removeItem('ammar_barbershop_state');
        window.location.hash = '/auth';
        window.location.reload();
      });
    }

    // Mobile Sidebar Toggle
    const mobileToggle = document.getElementById('admin-mobile-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    const overlay = document.getElementById('admin-overlay');

    if (mobileToggle && sidebar && overlay) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('admin-sidebar--open');
        overlay.classList.toggle('admin-overlay--visible');
      });

      overlay.addEventListener('click', () => {
        sidebar.classList.remove('admin-sidebar--open');
        overlay.classList.remove('admin-overlay--visible');
      });
    }
  }, 50);

  return `
    <style>
      .admin-container {
        display: flex;
        min-height: 100vh;
        background: var(--bg-primary);
        color: var(--text-white);
        font-family: 'Inter', sans-serif;
      }
      .admin-sidebar {
        width: 250px;
        background: var(--bg-secondary);
        border-right: 1px solid var(--border-subtle);
        display: flex;
        flex-direction: column;
        transition: transform 0.3s ease;
      }
      .admin-sidebar-header {
        padding: var(--space-6);
        border-bottom: 1px solid var(--border-subtle);
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }
      .admin-sidebar-nav {
        flex: 1;
        padding: var(--space-4) 0;
      }
      .admin-nav-item {
        display: flex;
        align-items: center;
        padding: var(--space-3) var(--space-6);
        color: var(--text-muted);
        text-decoration: none;
        transition: all 0.2s;
        gap: var(--space-3);
      }
      .admin-nav-item:hover {
        color: var(--gold-primary);
        background: rgba(204, 163, 85, 0.05);
      }
      .admin-nav-item--active {
        color: var(--gold-primary);
        background: rgba(204, 163, 85, 0.1);
        border-right: 3px solid var(--gold-primary);
      }
      .admin-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        height: 100vh;
      }
      .admin-header {
        height: 70px;
        border-bottom: 1px solid var(--border-subtle);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 var(--space-6);
        background: var(--bg-primary);
        position: sticky;
        top: 0;
        z-index: 10;
      }
      .admin-content {
        padding: var(--space-6);
        flex: 1;
      }
      
      /* Mobile responsiveness */
      .admin-mobile-toggle {
        display: none;
        background: none;
        border: none;
        color: var(--text-white);
        font-size: 1.5rem;
        cursor: pointer;
      }
      .admin-overlay {
        display: none;
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 40;
        opacity: 0;
        transition: opacity 0.3s;
      }
      .admin-overlay--visible {
        display: block;
        opacity: 1;
      }

      @media (max-width: 768px) {
        .admin-sidebar {
          position: fixed;
          top: 0; bottom: 0; left: 0;
          z-index: 50;
          transform: translateX(-100%);
        }
        .admin-sidebar--open {
          transform: translateX(0);
        }
        .admin-mobile-toggle {
          display: block;
        }
      }
      
      /* Admin Tables and Cards shared styles */
      .admin-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
        padding: var(--space-5);
      }
      .admin-table {
        width: 100%;
        border-collapse: collapse;
      }
      .admin-table th, .admin-table td {
        padding: var(--space-3) var(--space-4);
        text-align: left;
        border-bottom: 1px solid var(--border-subtle);
      }
      .admin-table th {
        color: var(--text-muted);
        font-weight: 500;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    </style>

    <div class="admin-container">
      <div class="admin-overlay" id="admin-overlay"></div>
      
      <!-- Sidebar -->
      <aside class="admin-sidebar" id="admin-sidebar">
        <div class="admin-sidebar-header">
          <div style="font-size: 1.5rem;">💈</div>
          <div>
            <strong style="color: var(--gold-primary); font-size: 1.1rem;">Ammar Admin</strong>
          </div>
        </div>
        
        <nav class="admin-sidebar-nav">
          <a href="#/admin" class="admin-nav-item ${activeTab === 'dashboard' ? 'admin-nav-item--active' : ''}">
            📊 Dashboard
          </a>
          <a href="#/admin/bookings" class="admin-nav-item ${activeTab === 'bookings' ? 'admin-nav-item--active' : ''}">
            📅 Bookings
          </a>
          <a href="#/admin/services" class="admin-nav-item ${activeTab === 'services' ? 'admin-nav-item--active' : ''}">
            ✂️ Services
          </a>
          <a href="#/admin/barbers" class="admin-nav-item ${activeTab === 'barbers' ? 'admin-nav-item--active' : ''}">
            👨‍💼 Barbers
          </a>
          <a href="#/admin/products" class="admin-nav-item ${activeTab === 'products' ? 'admin-nav-item--active' : ''}">
            🧴 Products
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="admin-main">
        <header class="admin-header">
          <div style="display: flex; align-items: center; gap: var(--space-4);">
            <button class="admin-mobile-toggle" id="admin-mobile-toggle">☰</button>
            <h2 style="font-size: 1.25rem; font-weight: 600; text-transform: capitalize;">${activeTab}</h2>
          </div>
          
          <div style="display: flex; align-items: center; gap: var(--space-4);">
            <span style="font-size: 0.9rem; color: var(--text-muted);">Halo, <strong style="color: var(--text-white);">${userName}</strong></span>
            <button class="btn btn-outline btn-sm" id="admin-logout-btn" style="border-color: var(--border-subtle);">Logout</button>
          </div>
        </header>

        <div class="admin-content">
          ${content}
        </div>
      </main>
    </div>
  `;
}
