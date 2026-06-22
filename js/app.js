/* ========================================
   APP — Main Entry Point
   Ammar Barbershop SPA
   ======================================== */

import { registerRoute, initRouter } from './router.js';
import { LandingPage } from './pages/LandingPage.js';
import { AuthPage } from './pages/AuthPage.js';
import { ServicePage } from './pages/ServicePage.js';
import { BarberPage } from './pages/BarberPage.js';
import { SchedulePage } from './pages/SchedulePage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { SuccessPage } from './pages/SuccessPage.js';

// Register all routes
registerRoute('/', LandingPage);
registerRoute('/auth', AuthPage);
registerRoute('/services', ServicePage);
registerRoute('/barbers', BarberPage);
registerRoute('/schedule', SchedulePage);
registerRoute('/checkout', CheckoutPage);
registerRoute('/success', SuccessPage);

// Initialize the router
initRouter();

// Log startup
console.log('%c✂️ Ammar Barbershop', 'color: #C59D5F; font-size: 20px; font-weight: bold;');
console.log('%cApp initialized successfully', 'color: #9CA3AF; font-size: 12px;');
