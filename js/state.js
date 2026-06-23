/* ========================================
   STATE MANAGEMENT — Ammar Barbershop
   ======================================== */

const initialState = {
  user: {
    id: null,
    name: '',
    email: '',
    phone: '',
    gender: '',
    role: 'user',
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

// Load state from localStorage if exists
try {
  const savedState = localStorage.getItem('ammar_barbershop_state');
  if (savedState) {
    state = { ...state, ...JSON.parse(savedState) };
  }
} catch (e) {
  console.error("Failed to load state from localStorage:", e);
}

const listeners = new Set();

/**
 * Mengambil state (data global) aplikasi saat ini secara utuh.
 * @returns {Object} Object state aplikasi.
 */
export function getState() {
  return state;
}

/**
 * Memperbarui state secara dangkal (shallow merge) dan memicu pembaruan ke semua subscriber.
 * @param {Object|Function} updates - Object state baru atau fungsi yang mengembalikan state baru.
 */
export function setState(updates) {
  if (typeof updates === 'function') {
    state = { ...state, ...updates(state) };
  } else {
    state = { ...state, ...updates };
  }
  notify();
}

/**
 * Memperbarui data state secara mendalam (nested) berdasarkan jalur (path).
 * Contoh: updateNested('schedule.time', '10:00')
 * @param {string} path - Jalur properti yang dipisahkan oleh titik (misal: 'user.name').
 * @param {any} value - Nilai baru yang ingin disimpan.
 */
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

/**
 * Mendaftarkan sebuah fungsi yang akan dipanggil setiap kali ada perubahan state.
 * Digunakan agar komponen UI bisa melakukan render ulang otomatis.
 * @param {Function} listener - Callback function.
 * @returns {Function} Fungsi untuk berhenti berlangganan (unsubscribe).
 */
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  try {
    localStorage.setItem('ammar_barbershop_state', JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state to localStorage:", e);
  }
  listeners.forEach(fn => fn(state));
}

/**
 * Mengatur ulang status booking ke awal, biasanya dilakukan setelah 
 * checkout berhasil untuk membersihkan keranjang.
 */
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

/**
 * Menghasilkan ID Booking acak yang unik (misal: AMR-2024-1234).
 * @returns {string} String Booking ID.
 */
export function generateBookingId() {
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
  return `AMR-${year}-${rand}`;
}

/**
 * Menghitung total harga keseluruhan (Layanan Utama + Produk Tambahan/Addons).
 * Akan memberikan diskon 5% otomatis jika pembayaran secara online.
 * @returns {number} Total harga akhir.
 */
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

/**
 * Menghitung besarnya nominal diskon yang didapat.
 * @returns {number} Nominal diskon (0 jika menggunakan cash).
 */
export function getDiscount() {
  if (state.payment.method !== 'qris' && state.payment.method !== 'ewallet') return 0;
  let total = 0;
  if (state.selectedService) total += state.selectedService.price;
  state.addons.forEach(addon => total += addon.price);
  return Math.round(total * 0.05);
}
