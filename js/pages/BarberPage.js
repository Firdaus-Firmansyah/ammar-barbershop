/* ========================================
   BARBER SELECTION PAGE
   ======================================== */

import { createLogo, createProgressBar, createBackButton, createStars } from '../components/shared.js';
import { fetchBarbers, barbers } from '../data/barbers.js';
import { formatPrice } from '../data/services.js';
import { getState, setState } from '../state.js';
import { navigate } from '../router.js';

export async function BarberPage() {
  await fetchBarbers();
  const state = getState();
  const serviceName = state.selectedService?.name || 'Service';
  
  const html = `
    <div class="booking-page">
      <div style="padding: var(--space-4) var(--space-6);">
        ${createBackButton()}
      </div>
      
      <div class="booking-header">
        ${createLogo(60)}
        ${createProgressBar(1)}
        <h2 class="booking-page-title">Silahkan pilih Barber Anda</h2>
        <p class="booking-page-subtitle">Pilihan: <span style="color: var(--gold-primary); font-weight: 600;">${serviceName}</span></p>
      </div>

      <div class="booking-content">
        <div class="barber-grid" id="barber-grid">
          ${barbers.map((barber, i) => `
            <div class="barber-card animate-fade-in-up stagger-${i + 1} ${state.selectedBarber?.id === barber.id ? 'barber-card--selected' : ''}" 
                 data-barber-id="${barber.id}"
                 id="barber-${barber.id}">
              <img src="${barber.image}" alt="${barber.name}" loading="lazy"/>
              <div class="barber-card-body">
                <h4>${barber.name}</h4>
                <div class="barber-card-specialization">${barber.specialization}</div>
                <div style="display: flex; align-items: center; gap: var(--space-2);">
                  ${createStars(barber.rating)}
                  <span style="color: var(--text-muted); font-size: var(--text-xs);">${barber.rating}</span>
                </div>
              </div>
              <div class="barber-card-actions">
                <button class="btn btn-primary btn-sm btn-block barber-select-btn" data-barber-id="${barber.id}">Pilih</button>
                <button class="btn btn-outline btn-sm btn-block barber-profile-btn" data-barber-id="${barber.id}">Lihat Profile</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Fixed bottom bar -->
      <div class="booking-footer" id="barber-footer" style="display: ${state.selectedBarber ? 'block' : 'none'};">
        <div class="booking-footer-inner">
          <div>
            <span style="color: var(--text-muted); font-size: var(--text-sm);">Barber dipilih:</span>
            <strong style="color: var(--text-white); margin-left: var(--space-2);" id="selected-barber-name">${state.selectedBarber?.name || ''}</strong>
          </div>
          <button class="btn btn-primary" id="btn-next-barber">
            Lanjutkan →
          </button>
        </div>
      </div>

      <!-- Profile Modal -->
      <div class="modal-overlay" id="profile-modal" style="display: none;"></div>
    </div>
  `;

  setTimeout(setupBarberInteractions, 50);
  return html;
}

function showProfileModal(barber) {
  const modal = document.getElementById('profile-modal');
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 600px;">
      <button class="modal-close" id="modal-close-btn">✕</button>
      
      <img src="${barber.image}" alt="${barber.name}" class="profile-modal-img" />
      
      <h3 class="profile-modal-name">${barber.name}</h3>
      
      <div class="profile-modal-meta">
        <div class="profile-modal-meta-item">
          <span class="profile-modal-meta-label">Spesialisasi:</span>
          <span class="profile-modal-meta-value">${barber.specialization}</span>
        </div>
        <div class="profile-modal-meta-item">
          <span class="profile-modal-meta-label">Pengalaman:</span>
          <span class="profile-modal-meta-value">${barber.experience}</span>
        </div>
        <div class="profile-modal-meta-item">
          <span class="profile-modal-meta-label">Usia:</span>
          <span class="profile-modal-meta-value">${barber.age} Tahun</span>
        </div>
      </div>
      
      <p style="color: var(--text-muted); font-size: var(--text-sm); line-height: 1.7; margin: var(--space-4) 0;">
        ${barber.description}
      </p>

      <div class="profile-services-grid">
        ${barber.services.map(service => `
          <div class="profile-service-card">
            <h5>Biaya service ${service.name.toLowerCase()}</h5>
            <div class="profile-service-price">${formatPrice(service.price)}</div>
            <div class="profile-rating">
              <span class="profile-rating-number">${service.rating}</span>
              <div>
                ${createStars(service.rating)}
                <span class="profile-rating-count">${service.reviewCount} reviews</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: var(--space-6);">
        <button class="btn btn-primary btn-block" id="modal-select-btn">Pilih ${barber.name}</button>
      </div>
    </div>
  `;

  modal.style.display = 'flex';

  // Close handlers
  document.getElementById('modal-close-btn')?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Select from modal
  document.getElementById('modal-select-btn')?.addEventListener('click', () => {
    selectBarber(barber);
    modal.style.display = 'none';
  });
}

function selectBarber(barber) {
  setState({ selectedBarber: barber });

  // Update visuals
  document.querySelectorAll('.barber-card').forEach(c => c.classList.remove('barber-card--selected'));
  const card = document.getElementById(`barber-${barber.id}`);
  if (card) card.classList.add('barber-card--selected');

  const footer = document.getElementById('barber-footer');
  const nameEl = document.getElementById('selected-barber-name');
  if (footer) footer.style.display = 'block';
  if (nameEl) nameEl.textContent = barber.name;
}

function setupBarberInteractions() {
  // Select buttons
  document.querySelectorAll('.barber-select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const barberId = btn.dataset.barberId;
      const barber = barbers.find(b => b.id === barberId);
      if (barber) selectBarber(barber);
    });
  });

  // Profile buttons
  document.querySelectorAll('.barber-profile-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const barberId = btn.dataset.barberId;
      const barber = barbers.find(b => b.id === barberId);
      if (barber) showProfileModal(barber);
    });
  });

  // Card click = select
  document.querySelectorAll('.barber-card').forEach(card => {
    card.addEventListener('click', () => {
      const barberId = card.dataset.barberId;
      const barber = barbers.find(b => b.id === barberId);
      if (barber) selectBarber(barber);
    });
  });

  // Next button
  document.getElementById('btn-next-barber')?.addEventListener('click', () => {
    const state = getState();
    if (!state.selectedBarber) {
      alert('Silakan pilih barber terlebih dahulu');
      return;
    }
    navigate('/schedule');
  });
}
