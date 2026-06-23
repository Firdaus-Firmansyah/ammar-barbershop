/* ========================================
   SHARED COMPONENTS — Ammar Barbershop
   ======================================== */

import { getState } from '../state.js';

/**
 * Menghasilkan elemen gambar Logo Ammar Barbershop.
 * @param {number} height - Tinggi logo dalam pixel.
 * @returns {string} String HTML untuk logo.
 */
export function createLogo(height = 60) {
  return `
    <img src="/Image/Logo ammar barbershop.png" alt="Ammar Barbershop Logo" height="${height}" style="height: ${height}px; object-fit: contain;" />
  `;
}

/**
 * Menghasilkan UI Progress Bar untuk menunjukkan langkah booking.
 * @param {number} currentStep - Indeks langkah saat ini (0: Service, 1: Barber, 2: Jadwal, 3: Checkout).
 * @returns {string} String HTML progress bar.
 */
export function createProgressBar(currentStep) {
  const steps = ['Service', 'Barber', 'Jadwal', 'Checkout'];
  return `
    <div class="progress-bar">
      ${steps.map((step, i) => `
        <div class="progress-step">
          <div class="progress-dot ${i < currentStep ? 'progress-dot--completed' : ''} ${i === currentStep ? 'progress-dot--active' : ''}">
            ${i < currentStep ? '✓' : i + 1}
          </div>
          ${i < steps.length - 1 ? `<div class="progress-line ${i < currentStep ? 'progress-line--active' : ''}"></div>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Menghasilkan tombol "Kembali" yang menggunakan History API browser.
 * @param {string} text - Teks pada tombol (default: 'Kembali').
 * @returns {string} String HTML button.
 */
export function createBackButton(text = 'Kembali') {
  return `
    <button class="back-btn" onclick="history.back()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      ${text}
    </button>
  `;
}

/**
 * Menghasilkan komponen Bintang Rating berdasarkan nilai rating.
 * @param {number} rating - Nilai rating (contoh: 4.5).
 * @param {string} size - Ukuran bintang ('sm' atau 'lg').
 * @returns {string} String HTML komponen rating bintang.
 */
export function createStars(rating, size = 'sm') {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const sizeClass = size === 'lg' ? 'font-size: 1.3rem;' : '';
  return `
    <div class="stars" style="${sizeClass}">
      ${'<span class="star">★</span>'.repeat(full)}
      ${half ? '<span class="star">★</span>' : ''}
      ${'<span class="star star--empty">★</span>'.repeat(empty)}
    </div>
  `;
}

/**
 * Menghasilkan komponen navigasi (Navbar) untuk website.
 * Mencakup link menu dan logo.
 * @returns {string} String HTML navbar.
 */
export function createNavbar() {
  const state = getState();
  const isLoggedIn = state.user?.isLoggedIn;
  const userName = state.user?.name || '';

  const authBtn = isLoggedIn
    ? `<span style="color: var(--gold-primary); font-size: var(--text-sm); margin-right: var(--space-2);">👤 ${userName}</span>
       <button class="btn btn-outline btn-sm" id="navbar-logout-btn" style="font-size: var(--text-xs);">Logout</button>`
    : `<a href="#/auth" class="btn btn-primary btn-sm" id="navbar-auth-btn">Login</a>`;

  return `
    <nav class="navbar" id="navbar">
      <div class="navbar-inner">
        <a href="#/" class="navbar-logo">
          ${createLogo(42)}
          <span class="navbar-logo-text">AMMAR</span>
        </a>
        <div class="navbar-links" id="navbar-links">
          <a href="#/" class="navbar-link navbar-link--active" data-nav="home">Home</a>
          <a href="javascript:void(0)" class="navbar-link" data-nav="about" onclick="scrollToSection('about')">About Us</a>
          <a href="javascript:void(0)" class="navbar-link" data-nav="staff" onclick="scrollToSection('staff')">Staff Profiles</a>
          <a href="javascript:void(0)" class="navbar-link" data-nav="service" onclick="scrollToSection('services-section')">Service</a>
          <a href="javascript:void(0)" class="navbar-link" data-nav="products" onclick="scrollToSection('products-section')">Hair Products</a>
          <a href="javascript:void(0)" class="navbar-link" data-nav="contact" onclick="scrollToSection('contact')">Contact Us</a>
        </div>
        <div class="navbar-actions">
          ${authBtn}
          <button class="navbar-mobile-toggle" id="mobile-toggle" aria-label="Menu">☰</button>
        </div>
      </div>
      <!-- Mobile menu -->
      <div class="navbar-mobile-menu" id="mobile-menu" style="display:none; background: var(--bg-secondary); padding: var(--space-4) var(--space-6); border-top: 1px solid var(--border-subtle);">
        <div style="display:flex; flex-direction:column; gap: var(--space-3);">
          <a href="#/" class="navbar-link" onclick="closeMobileMenu()">Home</a>
          <a href="javascript:void(0)" class="navbar-link" onclick="scrollToSection('about'); closeMobileMenu()">About Us</a>
          <a href="javascript:void(0)" class="navbar-link" onclick="scrollToSection('staff'); closeMobileMenu()">Staff Profiles</a>
          <a href="javascript:void(0)" class="navbar-link" onclick="scrollToSection('services-section'); closeMobileMenu()">Service</a>
          <a href="javascript:void(0)" class="navbar-link" onclick="scrollToSection('products-section'); closeMobileMenu()">Hair Products</a>
          <a href="javascript:void(0)" class="navbar-link" onclick="scrollToSection('contact'); closeMobileMenu()">Contact Us</a>
        </div>
      </div>
    </nav>
  `;
}

/**
 * Menginisialisasi event listener untuk hamburger menu (mobile).
 * Ini dieksekusi setiap kali Navbar di-render.
 */
export function setupMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });
  }
  // Expose globally for onclick
  window.closeMobileMenu = () => {
    if (menu) menu.style.display = 'none';
  };
  // Global scroll-to-section helper
  window.scrollToSection = (sectionId) => {
    // If we're not on the landing page, navigate there first
    const currentRoute = window.location.hash.slice(1) || '/';
    if (currentRoute !== '/') {
      window.location.hash = '/';
      // Wait for page to render, then scroll
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Logout button handler
  const logoutBtn = document.getElementById('navbar-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const { supabase } = await import('../supabaseClient.js');
      const { updateNested, resetBooking } = await import('../state.js');
      await supabase.auth.signOut();
      updateNested('user.name', '');
      updateNested('user.email', '');
      updateNested('user.phone', '');
      updateNested('user.gender', '');
      updateNested('user.isLoggedIn', false);
      updateNested('user.id', null);
      resetBooking();
      localStorage.removeItem('ammar_barbershop_state');
      window.location.hash = '/';
      window.location.reload();
    });
  }
}

/**
 * Menghasilkan komponen Footer.
 * @returns {string} String HTML footer.
 */
export function createFooter() {
  return `
    <footer class="footer" id="contact">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            ${createLogo(50)}
            <p>Jl. Tanah Merdeka No.6, RT.10/RW.5, Rambutan, Kec. Ciracas, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13830.</p>
            <div style="margin-top: var(--space-6);">
              <p style="color: var(--text-white); font-weight: 600; margin-bottom: var(--space-2);">Subscribe to our newsletter</p>
              <div class="footer-newsletter">
                <input type="email" placeholder="Email address" />
                <button>→</button>
              </div>
            </div>
          </div>
          <div>
            <h4 class="footer-title">Services</h4>
            <div class="footer-links">
              <a href="#">Haircut</a>
              <a href="#">Coloring</a>
              <a href="#">Perm & Smoothing</a>
              <a href="#">Shave</a>
            </div>
          </div>
          <div>
            <h4 class="footer-title">About</h4>
            <div class="footer-links">
              <a href="#">Our Story</a>
              <a href="#">Benefits</a>
              <a href="#">Team</a>
              <a href="#">Careers</a>
            </div>
          </div>
          <div>
            <h4 class="footer-title">Help</h4>
            <div class="footer-links">
              <a href="#">FAQs</a>
              <a href="#">Contact Us</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="footer-social">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Facebook">f</a>
          </div>
          <div class="footer-legal">
            <a href="#">Terms & Conditions</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

/**
 * Menghasilkan simulasi grafis QR Code pada elemen canvas HTML.
 * Menggunakan jeda (setTimeout) untuk memastikan canvas sudah di-render.
 * @param {string} canvasId - ID elemen `<canvas>`.
 * @param {string} text - Teks/Data yang ingin dibuat QR (sebagai seed randomizer).
 */
export function generateQRCode(canvasId, text) {
  setTimeout(() => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 120;
    canvas.width = size;
    canvas.height = size;
    
    // Simple pattern that looks like QR
    const cellSize = 4;
    const grid = size / cellSize;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = '#1a1a1a';
    
    // Fixed position squares (QR-like corners)
    const drawFinderPattern = (x, y) => {
      // Outer
      for (let i = 0; i < 7; i++) {
        ctx.fillRect((x + i) * cellSize, y * cellSize, cellSize, cellSize);
        ctx.fillRect((x + i) * cellSize, (y + 6) * cellSize, cellSize, cellSize);
        ctx.fillRect(x * cellSize, (y + i) * cellSize, cellSize, cellSize);
        ctx.fillRect((x + 6) * cellSize, (y + i) * cellSize, cellSize, cellSize);
      }
      // Inner
      for (let i = 2; i < 5; i++) {
        for (let j = 2; j < 5; j++) {
          ctx.fillRect((x + i) * cellSize, (y + j) * cellSize, cellSize, cellSize);
        }
      }
    };
    
    drawFinderPattern(1, 1);
    drawFinderPattern(grid - 9, 1);
    drawFinderPattern(1, grid - 9);
    
    // Random data pattern
    const hash = text.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
    let seed = Math.abs(hash);
    for (let y = 9; y < grid - 1; y++) {
      for (let x = 9; x < grid - 1; x++) {
        seed = (seed * 16807) % 2147483647;
        if (seed % 3 !== 0) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
    // Fill some cells between finder patterns
    for (let y = 1; y < 9; y++) {
      for (let x = 9; x < grid - 9; x++) {
        seed = (seed * 16807) % 2147483647;
        if (seed % 3 === 0) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
    for (let y = 9; y < grid - 1; y++) {
      for (let x = 1; x < 9; x++) {
        seed = (seed * 16807) % 2147483647;
        if (seed % 3 === 0) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
  }, 100);
}
