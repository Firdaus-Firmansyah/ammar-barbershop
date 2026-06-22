/* ========================================
   ROUTER — Hash-based SPA Router
   ======================================== */

const routes = {};
let currentPage = null;

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(path) {
  window.location.hash = path;
}

export function getCurrentRoute() {
  return window.location.hash.slice(1) || '/';
}

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
