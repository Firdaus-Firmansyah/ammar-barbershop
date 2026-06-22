/* ========================================
   SCHEDULE PICKER PAGE (NEW)
   ======================================== */

import { createLogo, createProgressBar, createBackButton } from '../components/shared.js';
import { getState, updateNested } from '../state.js';
import { navigate } from '../router.js';

const DAYS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function getNext7Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date,
      dayName: DAYS_ID[date.getDay()],
      dayNum: date.getDate(),
      month: MONTHS_ID[date.getMonth()],
      fullDate: date.toISOString().split('T')[0],
      isToday: i === 0,
    });
  }
  return days;
}

function getTimeSlots() {
  const slots = [];
  // Random unavailable slots for demo
  const unavailable = new Set(['12:00', '15:00', '18:00']);
  for (let h = 9; h <= 21; h++) {
    const time = `${String(h).padStart(2, '0')}:00`;
    slots.push({
      time,
      available: !unavailable.has(time),
    });
  }
  return slots;
}

export function SchedulePage() {
  const state = getState();
  const days = getNext7Days();
  const timeSlots = getTimeSlots();
  const barberName = state.selectedBarber?.name || 'Barber';
  const serviceName = state.selectedService?.name || 'Service';

  const html = `
    <div class="booking-page">
      <div style="padding: var(--space-4) var(--space-6);">
        ${createBackButton()}
      </div>
      
      <div class="booking-header">
        ${createLogo(60)}
        ${createProgressBar(2)}
        <h2 class="booking-page-title">Pilih Jadwal</h2>
        <p class="booking-page-subtitle">
          ${serviceName} dengan <span style="color: var(--gold-primary); font-weight: 600;">${barberName}</span>
        </p>
      </div>

      <div class="booking-content" style="max-width: 700px; margin: 0 auto;">
        
        <!-- Date Selection -->
        <div style="margin-bottom: var(--space-8);">
          <h4 style="font-family: var(--font-body); font-size: var(--text-lg); margin-bottom: var(--space-4); color: var(--text-white);">
            📅 Pilih Tanggal
          </h4>
          <div class="date-strip" id="date-strip">
            ${days.map((day, i) => `
              <div class="date-chip animate-fade-in-up stagger-${i + 1} ${state.schedule.date === day.fullDate ? 'date-chip--selected' : ''}" 
                   data-date="${day.fullDate}" 
                   id="date-${day.fullDate}">
                <div class="date-chip-day">${day.isToday ? 'Hari ini' : day.dayName}</div>
                <div class="date-chip-num">${day.dayNum}</div>
                <div class="date-chip-month">${day.month}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Time Selection -->
        <div style="margin-bottom: var(--space-8);">
          <h4 style="font-family: var(--font-body); font-size: var(--text-lg); margin-bottom: var(--space-4); color: var(--text-white);">
            🕐 Pilih Waktu
          </h4>
          <div class="time-grid" id="time-grid">
            ${timeSlots.map((slot, i) => `
              <div class="chip animate-fade-in-up stagger-${Math.min(i + 1, 10)} ${!slot.available ? 'chip--disabled' : ''} ${state.schedule.time === slot.time ? 'chip--selected' : ''}" 
                   data-time="${slot.time}"
                   ${!slot.available ? 'aria-disabled="true"' : ''}>
                ${slot.time}
              </div>
            `).join('')}
          </div>
          <p style="font-size: var(--text-xs); color: var(--text-muted); margin-top: var(--space-3);">
            <span style="display: inline-block; width: 12px; height: 12px; background: var(--disabled); border-radius: 3px; margin-right: 4px; vertical-align: middle; opacity: 0.5;"></span>
            Waktu yang dicoret tidak tersedia
          </p>
        </div>

        <!-- Selection Summary -->
        <div class="card" id="schedule-summary" style="display: ${state.schedule.date && state.schedule.time ? 'block' : 'none'}; border-color: var(--gold-primary); margin-bottom: var(--space-6);">
          <div style="display: flex; align-items: center; gap: var(--space-4); flex-wrap: wrap;">
            <div>
              <span style="color: var(--text-muted); font-size: var(--text-sm);">Jadwal dipilih:</span>
            </div>
            <div style="display: flex; gap: var(--space-4); flex-wrap: wrap;">
              <span class="badge badge-gold" id="summary-date">📅 ${state.schedule.date || '—'}</span>
              <span class="badge badge-gold" id="summary-time">🕐 ${state.schedule.time || '—'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Fixed bottom bar -->
      <div class="booking-footer" id="schedule-footer" style="display: ${state.schedule.date && state.schedule.time ? 'block' : 'none'};">
        <div class="booking-footer-inner">
          <div>
            <span style="color: var(--text-muted); font-size: var(--text-sm);" id="footer-schedule-text">
              ${state.schedule.date && state.schedule.time ? `${state.schedule.date} • ${state.schedule.time}` : ''}
            </span>
          </div>
          <button class="btn btn-primary" id="btn-next-schedule">
            Lanjutkan →
          </button>
        </div>
      </div>
    </div>
  `;

  setTimeout(setupScheduleInteractions, 50);
  return html;
}

function setupScheduleInteractions() {
  let selectedDate = getState().schedule.date;
  let selectedTime = getState().schedule.time;

  const footer = document.getElementById('schedule-footer');
  const summary = document.getElementById('schedule-summary');
  const summaryDate = document.getElementById('summary-date');
  const summaryTime = document.getElementById('summary-time');
  const footerText = document.getElementById('footer-schedule-text');

  function updateUI() {
    if (selectedDate && selectedTime) {
      if (footer) footer.style.display = 'block';
      if (summary) summary.style.display = 'block';
      if (summaryDate) summaryDate.textContent = `📅 ${selectedDate}`;
      if (summaryTime) summaryTime.textContent = `🕐 ${selectedTime}`;
      if (footerText) footerText.textContent = `${selectedDate} • ${selectedTime}`;
    } else {
      if (footer) footer.style.display = 'none';
      if (summary) summary.style.display = 'none';
    }
  }

  // Date selection
  document.querySelectorAll('.date-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.date-chip').forEach(c => c.classList.remove('date-chip--selected'));
      chip.classList.add('date-chip--selected');
      selectedDate = chip.dataset.date;
      updateNested('schedule.date', selectedDate);
      updateUI();
    });
  });

  // Time selection
  document.querySelectorAll('.chip:not(.chip--disabled)').forEach(chip => {
    if (!chip.dataset.time) return;
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip[data-time]').forEach(c => c.classList.remove('chip--selected'));
      chip.classList.add('chip--selected');
      selectedTime = chip.dataset.time;
      updateNested('schedule.time', selectedTime);
      updateUI();
    });
  });

  // Next button
  document.getElementById('btn-next-schedule')?.addEventListener('click', () => {
    const state = getState();
    if (!state.schedule.date || !state.schedule.time) {
      alert('Silakan pilih tanggal dan waktu');
      return;
    }
    navigate('/checkout');
  });
}
