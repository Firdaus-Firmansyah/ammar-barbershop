/* ========================================
   ROUTER — HTML5 History API Router
   ======================================== */

const routes = {};
let currentPage = null;

/**
 * Mendaftarkan sebuah route baru beserta fungsi handler-nya.
 * @param {string} path - URL path (misal: '/auth', '/services').
 * @param {Function} handler - Fungsi yang merender komponen/halaman untuk route tersebut.
 */
export function registerRoute(path, handler) {
  routes[path] = handler;
}

/**
 * Berpindah ke halaman lain dengan HTML5 History API.
 * @param {string} path - Path tujuan (misal: '/checkout').
 */
export function navigate(path) {
  window.history.pushState({}, '', path);
  handleRoute();
}

/**
 * Mengambil route/path saat ini dari URL.
 * @returns {string} Path saat ini, defaultnya adalah '/' jika kosong.
 */
export function getCurrentRoute() {
  return window.location.pathname || '/';
}

/**
 * Handle perubahan route (render halaman).
 */
export async function handleRoute() {
  const path = getCurrentRoute();
  const handler = routes[path] || routes['/'];

  if (!handler) return;

  const app = document.getElementById('app');

  // Page exit animation
  if (currentPage) {
    app.classList.add('page-exit');
    await new Promise(r => setTimeout(r, 200));
    app.classList.remove('page-exit');
  }

  // Clear and render new page
  app.innerHTML = '';
  const content = await handler();
  if (typeof content === 'string') {
    app.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    app.appendChild(content);
  }

  // Page enter animation
  app.classList.add('page-enter');
  requestAnimationFrame(() => {
    app.classList.remove('page-enter');
    app.classList.add('page-enter-active');
  });

  setTimeout(() => {
    app.classList.remove('page-enter-active');
  }, 300);

  currentPage = path;
  window.scrollTo(0, 0);
}

/**
 * Menginisialisasi router. Fungsi ini mendengarkan event 'popstate'
 * dan melakukan intercept pada semua klik link (tag <a>).
 */
export function initRouter() {
  window.addEventListener('popstate', handleRoute);
  window.addEventListener('load', handleRoute);

  // Global click listener to intercept internal links
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    
    // Ignore external links, or hash-only links for sections (e.g. href="#about")
    if (!href || href.startsWith('http') || href.startsWith('javascript:')) return;

    // Internal links that start with '/' (used to be '#/')
    if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
    }
  });
}
