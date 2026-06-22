/* ========================================
   STATE MANAGEMENT — Ammar Barbershop
   ======================================== */

const initialState = {
  user: {
    name: '',
    email: '',
    phone: '',
    gender: '',
    isLoggedIn: false,
  },
  selectedService: null,
  selectedBarber: null,
  schedule: {
    date: null,
    time: null,
  },
  payment: {
    method: null,  // 'cash', 'qris', 'ewallet'
  },
  addons: [],
  bookingId: null,
};

let state = JSON.parse(JSON.stringify(initialState));
const listeners = new Set();

export function getState() {
  return state;
}

export function setState(updates) {
  if (typeof updates === 'function') {
    state = { ...state, ...updates(state) };
  } else {
    state = { ...state, ...updates };
  }
  notify();
}

export function updateNested(path, value) {
  const keys = path.split('.');
  const newState = JSON.parse(JSON.stringify(state));
  let obj = newState;
  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]];
  }
  obj[keys[keys.length - 1]] = value;
  state = newState;
  notify();
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach(fn => fn(state));
}

export function resetBooking() {
  state = {
    ...state,
    selectedService: null,
    selectedBarber: null,
    schedule: { date: null, time: null },
    payment: { method: null },
    addons: [],
    bookingId: null,
  };
  notify();
}

export function generateBookingId() {
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
  return `AMR-${year}-${rand}`;
}

export function calculateTotal() {
  let total = 0;
  if (state.selectedService) {
    total += state.selectedService.price;
  }
  state.addons.forEach(addon => {
    total += addon.price;
  });
  // 5% discount for online payment
  if (state.payment.method === 'qris' || state.payment.method === 'ewallet') {
    total = Math.round(total * 0.95);
  }
  return total;
}

export function getDiscount() {
  if (state.payment.method !== 'qris' && state.payment.method !== 'ewallet') return 0;
  let total = 0;
  if (state.selectedService) total += state.selectedService.price;
  state.addons.forEach(addon => total += addon.price);
  return Math.round(total * 0.05);
}
