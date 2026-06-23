/* ========================================
   CHECKOUT & PAYMENT PAGE
   ======================================== */

import { createLogo, createProgressBar, createBackButton } from '../components/shared.js';
import { getState, setState, calculateTotal, getDiscount, generateBookingId, updateNested } from '../state.js';
import { formatPrice } from '../data/services.js';
import { fetchProducts, upsellProducts } from '../data/products.js';
import { navigate } from '../router.js';

export async function CheckoutPage() {
  await fetchProducts();
  const state = getState();
  const service = state.selectedService;
  const barber = state.selectedBarber;
  const schedule = state.schedule;
  const user = state.user;
  
  // Format date nicely
  const dateObj = schedule.date ? new Date(schedule.date) : new Date();
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const formattedDate = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

  const html = `
    <div class="booking-page">
      <div style="padding: var(--space-4) var(--space-6);">
        ${createBackButton()}
      </div>
      
      <div class="booking-header">
        ${createLogo(60)}
        ${createProgressBar(3)}
        <h2 class="booking-page-title">Detail Pemesanan Booking</h2>
        <p class="booking-page-subtitle">Periksa kembali pesanan Anda sebelum melanjutkan</p>
      </div>

      <div class="booking-content" style="padding-bottom: var(--space-24);">
        <div class="checkout-layout">
          <!-- LEFT: Booking Summary -->
          <div>
            <div class="checkout-summary animate-fade-in-up">
              <h4 style="font-family: var(--font-body); margin-bottom: var(--space-4); font-size: var(--text-lg);">
                📋 Ringkasan Booking
              </h4>
              
              <!-- User Info -->
              <div class="checkout-row">
                <span class="checkout-row-label">Nama</span>
                <span class="checkout-row-value">${user.name || 'Guest'}</span>
              </div>
              <div class="checkout-row">
                <span class="checkout-row-label">Email</span>
                <span class="checkout-row-value">${user.email || '-'}</span>
              </div>
              <div class="checkout-row">
                <span class="checkout-row-label">Gender</span>
                <span class="checkout-row-value" style="text-transform: capitalize;">${user.gender || '-'}</span>
              </div>

              <div style="height: 1px; background: var(--gold-primary); opacity: 0.3; margin: var(--space-2) 0;"></div>

              <!-- Booking Details -->
              <div class="checkout-row">
                <span class="checkout-row-label">Tanggal</span>
                <span class="checkout-row-value">${formattedDate}</span>
              </div>
              <div class="checkout-row">
                <span class="checkout-row-label">Jam</span>
                <span class="checkout-row-value">${schedule.time || '-'}</span>
              </div>
              <div class="checkout-row">
                <span class="checkout-row-label">Service</span>
                <span class="checkout-row-value">${service?.name || '-'}</span>
              </div>
              <div class="checkout-row">
                <span class="checkout-row-label">Staff</span>
                <span class="checkout-row-value">${barber?.name || '-'}</span>
              </div>
              <div class="checkout-row">
                <span class="checkout-row-label">Harga Service</span>
                <span class="checkout-row-value">${service ? formatPrice(service.price) : '-'}</span>
              </div>
              <div class="checkout-row">
                <span class="checkout-row-label">Alamat</span>
                <span class="checkout-row-value" style="max-width: 200px;">Jl. Tanah Merdeka No.6, RT.10/RW.5, Rambutan, Kec. Ciracas</span>
              </div>

              <!-- Addons -->
              <div id="addons-summary"></div>

              <!-- Discount -->
              <div id="discount-row" style="display: none;">
                <div class="checkout-row" style="border-bottom: none;">
                  <span class="checkout-row-label" style="color: #4CAF50;">Diskon Online 5%</span>
                  <span class="checkout-row-value" style="color: #4CAF50;" id="discount-value">- Rp 0</span>
                </div>
              </div>

              <!-- Total -->
              <div class="checkout-total">
                <span class="checkout-total-label">Total</span>
                <span class="checkout-total-value" id="total-price">${service ? formatPrice(service.price) : 'Rp 0'}</span>
              </div>
            </div>
          </div>

          <!-- RIGHT: Payment + Upsell -->
          <div class="checkout-sidebar">
            
            <!-- Payment Method -->
            <div class="card animate-fade-in-up stagger-2" style="padding: var(--space-6);">
              <h4 style="font-family: var(--font-body); margin-bottom: var(--space-4); font-size: var(--text-lg);">
                💳 Metode Pembayaran
              </h4>
              
              <div class="badge badge-discount" style="margin-bottom: var(--space-4); display: block; text-align: center;">
                🎉 Diskon 5% untuk pembayaran Online (QRIS/E-Wallet)
              </div>

              <div class="radio-group" style="flex-direction: column;" id="payment-methods">
                <label class="radio-card ${state.payment.method === 'cash' ? 'radio-card--selected' : ''}" data-payment="cash" id="payment-cash">
                  <input type="radio" name="payment" value="cash" ${state.payment.method === 'cash' ? 'checked' : ''}/>
                  <div class="radio-card__icon">💵</div>
                  <div class="radio-card__label">Bayar di Kasir</div>
                  <div class="radio-card__desc">Pembayaran tunai saat datang</div>
                </label>

                <label class="radio-card ${state.payment.method === 'qris' ? 'radio-card--selected' : ''}" data-payment="qris" id="payment-qris">
                  <input type="radio" name="payment" value="qris" ${state.payment.method === 'qris' ? 'checked' : ''}/>
                  <div class="radio-card__icon">📱</div>
                  <div class="radio-card__label">QRIS</div>
                  <div class="radio-card__desc">Scan QR untuk bayar — Diskon 5%</div>
                </label>

                <label class="radio-card ${state.payment.method === 'ewallet' ? 'radio-card--selected' : ''}" data-payment="ewallet" id="payment-ewallet">
                  <input type="radio" name="payment" value="ewallet" ${state.payment.method === 'ewallet' ? 'checked' : ''}/>
                  <div class="radio-card__icon">💳</div>
                  <div class="radio-card__label">E-Wallet</div>
                  <div class="radio-card__desc">GoPay, OVO, DANA — Diskon 5%</div>
                </label>
              </div>
            </div>

            <!-- Upselling Section -->
            <div class="upsell-section animate-fade-in-up stagger-3">
              <h4 style="font-family: var(--font-body); margin-bottom: var(--space-4); font-size: var(--text-lg);">
                🛍️ Tambahan
              </h4>
              <p style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: var(--space-4);">Frequently bought together — Ambil di kasir</p>
              
              ${upsellProducts.map(product => `
                <div class="upsell-item" id="upsell-${product.id}">
                  <img src="${product.image}" alt="${product.name}" loading="lazy"/>
                  <div class="upsell-item-info">
                    <div class="upsell-item-name">${product.name}</div>
                    <div class="upsell-item-price">${formatPrice(product.price)}</div>
                    <div class="upsell-item-note">${product.note}</div>
                  </div>
                  <button class="btn btn-outline btn-sm upsell-add-btn" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}">
                    Tambah
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Terms & Submit -->
        <div style="max-width: 600px; margin: var(--space-8) auto 0; text-align: center;">
          <div class="checkbox-group" style="justify-content: center; margin-bottom: var(--space-6);">
            <input type="checkbox" id="booking-terms" />
            <label for="booking-terms">Saya menerima <a href="#" style="color: var(--gold-primary);">Terms and Condition</a> Ammar Barbershop</label>
          </div>
          
          <button class="btn btn-primary btn-lg btn-block" id="btn-booking" disabled style="opacity: 0.5;">
            Booking Sekarang
          </button>
        </div>
      </div>
    </div>
  `;

  setTimeout(setupCheckoutInteractions, 50);
  return html;
}

function setupCheckoutInteractions() {
  const totalEl = document.getElementById('total-price');
  const discountRow = document.getElementById('discount-row');
  const discountValue = document.getElementById('discount-value');
  const addonsSummary = document.getElementById('addons-summary');
  const termsCheckbox = document.getElementById('booking-terms');
  const bookingBtn = document.getElementById('btn-booking');

  function updateTotal() {
    const total = calculateTotal();
    const discount = getDiscount();
    if (totalEl) totalEl.textContent = formatPrice(total);
    
    if (discount > 0 && discountRow && discountValue) {
      discountRow.style.display = 'block';
      discountValue.textContent = `- ${formatPrice(discount)}`;
    } else if (discountRow) {
      discountRow.style.display = 'none';
    }

    // Update addons in summary
    const state = getState();
    if (addonsSummary) {
      addonsSummary.innerHTML = state.addons.map(addon => `
        <div class="checkout-row">
          <span class="checkout-row-label">+ ${addon.name}</span>
          <span class="checkout-row-value">${formatPrice(addon.price)}</span>
        </div>
      `).join('');
    }
  }

  // Payment method selection
  const paymentCards = document.querySelectorAll('.radio-card');
  paymentCards.forEach(card => {
    card.addEventListener('click', () => {
      paymentCards.forEach(c => c.classList.remove('radio-card--selected'));
      card.classList.add('radio-card--selected');
      const method = card.dataset.payment;
      updateNested('payment.method', method);
      updateTotal();
    });
  });

  // Upsell add buttons
  document.querySelectorAll('.upsell-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.productId;
      const productName = btn.dataset.productName;
      const productPrice = parseInt(btn.dataset.productPrice);
      
      const state = getState();
      const exists = state.addons.find(a => a.id === productId);
      
      if (exists) {
        // Remove
        setState({ addons: state.addons.filter(a => a.id !== productId) });
        btn.textContent = 'Tambah';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
      } else {
        // Add
        setState({ addons: [...state.addons, { id: productId, name: productName, price: productPrice }] });
        btn.textContent = '✓ Added';
        btn.classList.add('btn-primary');
        btn.classList.remove('btn-outline');
      }
      updateTotal();
    });
  });

  // Terms checkbox
  termsCheckbox?.addEventListener('change', () => {
    if (bookingBtn) {
      bookingBtn.disabled = !termsCheckbox.checked;
      bookingBtn.style.opacity = termsCheckbox.checked ? '1' : '0.5';
    }
  });

  // Booking button
  bookingBtn?.addEventListener('click', () => {
    const state = getState();
    if (!state.payment.method) {
      alert('Silakan pilih metode pembayaran');
      return;
    }
    
    const bookingId = generateBookingId();
    setState({ bookingId });
    navigate('/success');
  });

  // Initial total
  updateTotal();
}
