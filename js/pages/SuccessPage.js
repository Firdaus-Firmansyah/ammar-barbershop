/* ========================================
   SUCCESS & E-TICKET PAGE
   ======================================== */

import { createLogo, generateQRCode } from '../components/shared.js';
import { getState, calculateTotal, resetBooking } from '../state.js';
import { formatPrice } from '../data/services.js';
import { navigate } from '../router.js';

export function SuccessPage() {
  const state = getState();
  const service = state.selectedService;
  const barber = state.selectedBarber;
  const schedule = state.schedule;
  const user = state.user;
  const bookingId = state.bookingId || 'AMR-2026-0001';
  const total = calculateTotal();

  // Format date nicely
  const dateObj = schedule.date ? new Date(schedule.date) : new Date();
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const formattedDate = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

  // Payment method label
  const paymentLabels = {
    'cash': 'Bayar di Kasir',
    'qris': 'QRIS',
    'ewallet': 'E-Wallet',
  };

  const html = `
    <div class="success-page">
      <!-- Animated Gold Checkmark -->
      <div class="success-checkmark">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="42" stroke="#C59D5F" stroke-width="3" fill="none" 
                  stroke-dasharray="300" style="animation: checkmarkCircle 0.8s ease forwards;"/>
          <path d="M30 52 L44 66 L70 36" stroke="#C59D5F" stroke-width="4.5" fill="none" 
                stroke-linecap="round" stroke-linejoin="round"
                stroke-dasharray="100" stroke-dashoffset="100"
                style="animation: checkmarkDraw 0.6s ease 0.5s forwards;"/>
        </svg>
      </div>

      <h2 class="success-title animate-fade-in-up stagger-2">Booking Berhasil!</h2>
      <p class="success-desc animate-fade-in-up stagger-3">
        Konfirmasi Booking di Ammar Barbershop Anda sudah berhasil. 
        Silakan simpan E-Ticket di bawah ini.
      </p>

      <!-- E-TICKET -->
      <div class="eticket animate-fade-in-up stagger-4">
        <div class="eticket-header">
          ${createLogo(50)}
          <div class="eticket-id" style="margin-top: var(--space-3);">BOOKING ID</div>
          <div style="font-family: var(--font-heading); font-size: var(--text-2xl); font-weight: 700; color: var(--text-white); letter-spacing: 0.08em;">
            ${bookingId}
          </div>
        </div>

        <!-- QR Code -->
        <div class="eticket-qr">
          <canvas id="qr-canvas" width="120" height="120"></canvas>
        </div>
        <p style="text-align: center; font-size: var(--text-xs); color: var(--text-muted); margin-bottom: var(--space-6);">
          Tunjukkan QR code ini saat datang
        </p>

        <!-- Booking Details -->
        <div class="eticket-details">
          <div class="eticket-row">
            <span class="eticket-label">Nama</span>
            <span class="eticket-value">${user.name || 'Guest'}</span>
          </div>
          <div class="eticket-row">
            <span class="eticket-label">Tanggal</span>
            <span class="eticket-value">${formattedDate}</span>
          </div>
          <div class="eticket-row">
            <span class="eticket-label">Jam</span>
            <span class="eticket-value">${schedule.time || '-'}</span>
          </div>
          <div class="eticket-row">
            <span class="eticket-label">Gender</span>
            <span class="eticket-value" style="text-transform: capitalize;">${user.gender || '-'}</span>
          </div>
          <div class="eticket-row">
            <span class="eticket-label">Service</span>
            <span class="eticket-value">${service?.name || '-'}</span>
          </div>
          <div class="eticket-row">
            <span class="eticket-label">Staff</span>
            <span class="eticket-value">${barber?.name || '-'}</span>
          </div>
          <div class="eticket-row">
            <span class="eticket-label">Pembayaran</span>
            <span class="eticket-value">${paymentLabels[state.payment.method] || '-'}</span>
          </div>
          ${state.addons.length > 0 ? `
            <div class="eticket-row">
              <span class="eticket-label">Tambahan</span>
              <span class="eticket-value">${state.addons.map(a => a.name).join(', ')}</span>
            </div>
          ` : ''}
          <div class="eticket-row" style="border-bottom: none;">
            <span class="eticket-label" style="font-size: var(--text-base);">Total</span>
            <span class="eticket-value" style="font-size: var(--text-lg); font-weight: 700; color: var(--gold-primary);">${formatPrice(total)}</span>
          </div>
        </div>

        <!-- Barbershop Address -->
        <div style="margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px dashed var(--border-subtle); text-align: center;">
          <p style="font-size: var(--text-xs); color: var(--text-muted);">
            📍 Jl. Tanah Merdeka No.6, RT.10/RW.5, Rambutan, Kec. Ciracas, Jakarta Timur
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="success-actions animate-fade-in-up stagger-5">
        <button class="btn btn-primary btn-lg btn-block" id="btn-download">
          📥 Download Bukti Pesanan
        </button>
        <button class="btn btn-outline btn-lg btn-block" id="btn-calendar">
          📅 Tambahkan ke Google Calendar
        </button>
        <button class="btn btn-secondary btn-lg btn-block" id="btn-home">
          🏠 Kembali ke Beranda
        </button>
      </div>
    </div>
  `;

  setTimeout(() => {
    generateQRCode('qr-canvas', bookingId);
    setupSuccessInteractions();
  }, 50);

  return html;
}

function setupSuccessInteractions() {
  const state = getState();
  
  // Download button - creates a simple text receipt
  document.getElementById('btn-download')?.addEventListener('click', () => {
    const s = getState();
    const dateObj = s.schedule.date ? new Date(s.schedule.date) : new Date();
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const formattedDate = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    
    const receipt = `
════════════════════════════════════
     AMMAR BARBERSHOP
     Bukti Pemesanan Booking
════════════════════════════════════

Booking ID  : ${s.bookingId}
Nama        : ${s.user.name || 'Guest'}
Email       : ${s.user.email || '-'}
Tanggal     : ${formattedDate}
Jam         : ${s.schedule.time || '-'}
Service     : ${s.selectedService?.name || '-'}
Staff       : ${s.selectedBarber?.name || '-'}
Pembayaran  : ${s.payment.method || '-'}
Total       : ${formatPrice(calculateTotal())}

════════════════════════════════════
Alamat: Jl. Tanah Merdeka No.6,
RT.10/RW.5, Rambutan, Kec. Ciracas,
Jakarta Timur, 13830
════════════════════════════════════

Terima kasih telah memilih
Ammar Barbershop!
    `.trim();
    
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${s.bookingId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Google Calendar button
  document.getElementById('btn-calendar')?.addEventListener('click', () => {
    const s = getState();
    const dateStr = s.schedule.date || new Date().toISOString().split('T')[0];
    const timeStr = s.schedule.time || '10:00';
    const [hour, min] = timeStr.split(':');
    
    const start = new Date(`${dateStr}T${timeStr}:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour
    
    const formatGCal = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    
    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Booking Ammar Barbershop - ${s.selectedService?.name || 'Haircut'}`)}&dates=${formatGCal(start)}/${formatGCal(end)}&details=${encodeURIComponent(`Booking ID: ${s.bookingId}\nService: ${s.selectedService?.name}\nBarber: ${s.selectedBarber?.name}\n\nAmmar Barbershop`)}&location=${encodeURIComponent('Jl. Tanah Merdeka No.6, RT.10/RW.5, Rambutan, Kec. Ciracas, Jakarta Timur')}`;
    
    window.open(calUrl, '_blank');
  });

  // Home button
  document.getElementById('btn-home')?.addEventListener('click', () => {
    resetBooking();
    navigate('/');
  });
}
