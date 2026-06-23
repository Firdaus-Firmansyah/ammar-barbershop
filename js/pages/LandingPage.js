/* ========================================
   LANDING PAGE — Ammar Barbershop
   ======================================== */

import { createNavbar, createFooter, createLogo, createStars, setupMobileMenu } from '../components/shared.js';
import { fetchServices, formatPrice, services } from '../data/services.js';
import { fetchBarbers, barbers } from '../data/barbers.js';
import { fetchProducts, products } from '../data/products.js';

export async function LandingPage() {
  await Promise.all([fetchServices(), fetchBarbers(), fetchProducts()]);
  const html = `
    ${createNavbar()}
    
    <!-- HERO SECTION -->
    <section class="hero" id="hero">
      <div class="hero-bg" style="background-image: url('/Image/1-Hero section.png');"></div>
      <div class="hero-content container">
        <h1 class="hero-title animate-fade-in-up">
          SELAMAT DATANG<br/>
          DI <span>AMMAR BARBERSHOP</span>
        </h1>
        <p class="hero-desc animate-fade-in-up stagger-2">
          Setiap langkah dalam perjalanan Anda di Barber kami adalah bagian dari pengalaman yang memuaskan. 
          Memberikan layanan yang ramah, profesional, dan berkualitas tinggi.
        </p>
        <div class="hero-buttons animate-fade-in-up stagger-3">
          <a href="/auth" class="btn btn-primary btn-lg">Booking Sekarang</a>
          <a href="javascript:void(0)" onclick="scrollToSection('products-section')" class="btn btn-outline btn-lg">Beli Produk</a>
        </div>
      </div>
    </section>

    <!-- ABOUT US SECTION -->
    <section class="section" id="about" style="background: var(--bg-secondary);">
      <div class="container">
        <div class="about-grid">
          <div class="about-images">
            <img src="/Image/2-about us.png" alt="Barbershop interior" class="animate-fade-in-up stagger-1" loading="lazy"/>
            <img src="/Image/2-about us 2.png" alt="Haircut in progress" class="animate-fade-in-up stagger-2" loading="lazy"/>
            <img src="/Image/2-about us 3.png" alt="Barber tools" class="animate-fade-in-up stagger-3" loading="lazy"/>
            <img src="/Image/2-about us 4.png" alt="Premium service" class="animate-fade-in-up stagger-4" loading="lazy"/>
          </div>
          <div class="about-text">
            <h2 class="animate-fade-in-up">About Us</h2>
            <p class="animate-fade-in-up stagger-2">
              Di Ammar Barbershop, kami percaya bahwa rambut adalah cerminan kepribadian dan gaya hidup Anda. 
              Dengan motto <strong style="color: var(--gold-primary);">"Transformasi Diri, Dimulai dari Rambut Anda"</strong>, 
              kami berdedikasi untuk memberikan layanan terbaik dalam perawatan dan penataan rambut, membantu setiap 
              pelanggan mengekspresikan diri mereka dengan percaya diri dan gaya.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- STAFF PROFILES SECTION -->
    <section class="section" id="staff">
      <div class="container">
        <div style="display:flex; align-items:center; justify-content:center; gap: var(--space-4); margin-bottom: var(--space-8);">
          <div style="font-size: 2rem;">💈</div>
          <h2 class="section-title" style="margin-bottom: 0;">Staff Profiles</h2>
          <div style="font-size: 2rem;">💈</div>
        </div>
        <div class="staff-carousel" id="staff-carousel">
          ${barbers.map((barber, i) => `
            <div class="staff-card-landing animate-fade-in-up stagger-${i + 1}">
              <img src="${barber.image}" alt="${barber.name}" loading="lazy"/>
              <h4>${barber.name}</h4>
              <div class="staff-meta">
                <span>Usia: ${barber.age} Tahun</span><br/>
                <span>Spesialisasi: ${barber.specialization}</span><br/>
                <span>Pengalaman: ${barber.experience}</span>
              </div>
              <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: 1.6;">${barber.description}</p>
              <div style="margin-top: var(--space-3);">
                ${createStars(barber.rating)}
                <span style="color: var(--text-muted); font-size: var(--text-xs); margin-left: var(--space-2);">${barber.review_count || 0} reviews</span>
              </div>
            </div>
          `).join('')}
        </div>
        <!-- Carousel navigation -->
        <div style="text-align: center; margin-top: var(--space-4);">
          <button class="btn btn-icon btn-secondary" onclick="document.getElementById('staff-carousel').scrollBy({left: -300, behavior: 'smooth'})" aria-label="Previous">‹</button>
          <button class="btn btn-icon btn-secondary" onclick="document.getElementById('staff-carousel').scrollBy({left: 300, behavior: 'smooth'})" aria-label="Next" style="margin-left: var(--space-2);">›</button>
        </div>
      </div>
    </section>

    <!-- SERVICES SECTION -->
    <section class="section" id="services-section" style="background: var(--bg-secondary);">
      <div class="container">
        <div style="display:flex; align-items:center; justify-content:center; gap: var(--space-4); margin-bottom: var(--space-8);">
          <div style="font-size: 2rem;">💈</div>
          <h2 class="section-title" style="margin-bottom: 0;">Service</h2>
          <div style="font-size: 2rem;">💈</div>
        </div>
        <div class="services-landing-grid">
          ${services.map((service, i) => `
            <div class="service-landing-item animate-fade-in-up stagger-${i + 1}">
              <div class="service-landing-icon" style="padding: 0; background: transparent; border: none; font-size: initial;">
                <img src="${service.image || '/Image/Haircut.png'}" alt="${service.name}" style="width: 80px; height: 80px; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));" />
              </div>
              <span class="service-landing-label">${service.name}</span>
            </div>
          `).join('')}
        </div>
        <div style="text-align: center; margin-top: var(--space-8); display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap;">
          <a href="/auth" class="btn btn-primary">Booking Sekarang</a>
          <a href="/booking-history" class="btn btn-outline">Jadwal Booking Saya</a>
        </div>
      </div>
    </section>

    <!-- HAIR PRODUCTS SECTION -->
    <section class="section" id="products-section">
      <div class="container">
        <h2 class="section-title">Hair Products</h2>
        <p class="section-subtitle">Produk perawatan rambut premium dari Ammar Barbershop</p>
        <div class="products-grid">
          ${products.map((product, i) => `
            <div class="product-card animate-fade-in-up stagger-${i + 1}">
              <img src="${product.image}" alt="${product.name}" loading="lazy"/>
              <div class="product-card-body">
                <h4>${product.name}</h4>
                <p style="font-size: var(--text-sm); margin-bottom: var(--space-2);">${product.description}</p>
                <div class="product-card-price">${formatPrice(product.price)}</div>
              </div>
              <div class="product-card-footer">
                <button class="btn btn-primary btn-sm">Beli Sekarang</button>
                <button class="btn btn-icon btn-secondary btn-sm" aria-label="View Details">👁</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- CTA BANNER -->
    <section class="cta-banner">
      <div class="container">
        <h3>Ready to get started?</h3>
        <a href="/auth" class="btn btn-primary btn-lg">Get Started</a>
      </div>
    </section>

    ${createFooter()}
  `;

  // Setup after render
  setTimeout(() => {
    setupMobileMenu();
    setupNavbarScroll();
  }, 50);

  return html;
}

function setupNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.style.background = 'rgba(26, 26, 26, 0.98)';
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
    } else {
      navbar.style.background = 'rgba(26, 26, 26, 0.92)';
      navbar.style.boxShadow = 'none';
    }
    lastScroll = currentScroll;
  });
}
