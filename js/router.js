/* ========================================
   ROUTER — Hash-based SPA Router
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
 * Berpindah ke halaman lain dengan mengubah hash pada URL.
 * Ini akan memicu event 'hashchange' yang ditangkap oleh router.
 * @param {string} path - Path tujuan (misal: '/checkout').
 */
export function navigate(path) {
  window.location.hash = path;
}

/**
 * Mengambil route/path saat ini dari URL (tanpa tanda #).
 * @returns {string} Path saat ini, defaultnya adalah '/' jika kosong.
 */
export function getCurrentRoute() {
  return window.location.hash.slice(1) || '/';
}

/**
 * Menginisialisasi router. Fungsi ini akan mendengarkan event 'hashchange'
 * dari browser (ketika user klik back/forward atau pindah halaman),
 * lalu merender ulang container dengan komponen yang sesuai.
 */
export function initRouter() {
  const handleRoute = async () => {
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
    const content = handler();
    if (typeof content === 'string') {
      app.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      app.appendChild(content);
    }

    // Page enter animation
    app.classList.add('page-enter');
    setTimeout(() => app.classList.remove('page-enter'), 500);

    currentPage = path;

    // Scroll to top
    window.scrollTo(0, 0);

    // Re-bind event listeners
    const event = new CustomEvent('routeChanged', { detail: { path } });
    document.dispatchEvent(event);
  };

  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // Initial render
}
