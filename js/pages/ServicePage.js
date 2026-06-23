/* ========================================
   SERVICE SELECTION PAGE
   ======================================== */

import { createLogo, createProgressBar, createBackButton } from '../components/shared.js';
import { fetchServices, services, formatPrice } from '../data/services.js';
import { getState, setState } from '../state.js';
import { navigate } from '../router.js';

export async function ServicePage() {
  await fetchServices();
  const state = getState();
  
  const html = `
    <div class="booking-page">
      <div style="padding: var(--space-4) var(--space-6);">
        ${createBackButton()}
      </div>
      
      <div class="booking-header">
        ${createLogo(60)}
        ${createProgressBar(0)}
        <h2 class="booking-page-title">Silahkan pilih service Anda</h2>
        <p class="booking-page-subtitle">Pilih layanan yang Anda inginkan</p>
      </div>

      <div class="booking-content">
        <div class="service-grid" id="service-grid">
          ${services.map((service, i) => `
            <div class="service-card animate-fade-in-up stagger-${i + 1} ${state.selectedService?.id === service.id ? 'service-card--selected' : ''}" 
                 data-service-id="${service.id}" 
                 id="service-${service.id}">
              <div class="service-card-icon">${service.icon}</div>
              <h4>${service.name}</h4>
              <div class="service-card-price">${formatPrice(service.price)}</div>
              
              <button class="service-card-toggle" data-toggle="${service.id}" onclick="event.stopPropagation()">
                <span>ℹ️</span> Info layanan
                <span class="toggle-arrow" style="transition: transform 0.3s;">▼</span>
              </button>
              
              <div class="accordion" id="accordion-${service.id}">
                <div class="accordion-content">
                  <p>${service.description}</p>
                  <p style="margin-top: var(--space-2); color: var(--gold-primary); font-weight: 600;">
                    ⏱ Durasi: ${service.duration}
                  </p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Fixed bottom bar -->
      <div class="booking-footer" id="service-footer" style="display: ${state.selectedService ? 'block' : 'none'};">
        <div class="booking-footer-inner">
          <div>
            <span style="color: var(--text-muted); font-size: var(--text-sm);">Layanan dipilih:</span>
            <strong style="color: var(--text-white); margin-left: var(--space-2);" id="selected-service-name">${state.selectedService?.name || ''}</strong>
            <strong style="color: var(--gold-primary); margin-left: var(--space-2);" id="selected-service-price">${state.selectedService ? formatPrice(state.selectedService.price) : ''}</strong>
          </div>
          <button class="btn btn-primary" id="btn-next-service">
            Lanjutkan →
          </button>
        </div>
      </div>
    </div>
  `;

  setTimeout(setupServiceInteractions, 50);
  return html;
}

function setupServiceInteractions() {
  const serviceCards = document.querySelectorAll('.service-card');
  const footer = document.getElementById('service-footer');
  const nameEl = document.getElementById('selected-service-name');
  const priceEl = document.getElementById('selected-service-price');

  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const serviceId = card.dataset.serviceId;
      const service = services.find(s => s.id === serviceId);
      if (!service) return;

      // Update selection visuals
      serviceCards.forEach(c => c.classList.remove('service-card--selected'));
      card.classList.add('service-card--selected');

      // Update state
      setState({ selectedService: service });

      // Update footer
      if (footer) footer.style.display = 'block';
      if (nameEl) nameEl.textContent = service.name;
      if (priceEl) priceEl.textContent = formatPrice(service.price);
    });
  });

  // Accordion toggles
  const toggles = document.querySelectorAll('.service-card-toggle');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const serviceId = toggle.dataset.toggle;
      const accordion = document.getElementById(`accordion-${serviceId}`);
      const arrow = toggle.querySelector('.toggle-arrow');
      
      if (accordion) {
        const isOpen = accordion.classList.contains('accordion--open');
        // Close all accordions first
        document.querySelectorAll('.accordion').forEach(a => a.classList.remove('accordion--open'));
        document.querySelectorAll('.toggle-arrow').forEach(a => a.style.transform = '');
        
        if (!isOpen) {
          accordion.classList.add('accordion--open');
          if (arrow) arrow.style.transform = 'rotate(180deg)';
        }
      }
    });
  });

  // Next button
  document.getElementById('btn-next-service')?.addEventListener('click', () => {
    const state = getState();
    if (!state.selectedService) {
      alert('Silakan pilih service terlebih dahulu');
      return;
    }
    navigate('/barbers');
  });
}
