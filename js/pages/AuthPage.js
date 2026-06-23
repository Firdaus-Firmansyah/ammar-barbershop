/* ========================================
   AUTH PAGE — Login / Sign Up
   Terhubung dengan Supabase Auth API
   ======================================== */

import { createLogo, createBackButton } from '../components/shared.js';
import { getState, updateNested } from '../state.js';
import { navigate } from '../router.js';
import { supabase } from '../supabaseClient.js';

/**
 * Halaman Autentikasi (Login & Sign Up).
 * Menggunakan Supabase Auth untuk register dan login dengan Email + Password.
 * Setelah berhasil login, user diarahkan ke halaman pemilihan service.
 */
export function AuthPage() {
  const state = getState();

  // Jika user sudah login, langsung arahkan ke services
  if (state.user.isLoggedIn) {
    setTimeout(() => navigate('/services'), 0);
    return '<div style="min-height:100vh; display:flex; align-items:center; justify-content:center; color: var(--text-muted);">Redirecting...</div>';
  }

  const html = `
    <div class="auth-page">
      <div style="position: absolute; top: var(--space-6); left: var(--space-6);">
        ${createBackButton()}
      </div>
      
      <div class="auth-card">
        <div class="auth-logo">
          ${createLogo(80)}
        </div>
        
        <h2 class="auth-title">Sign Up</h2>
        <p class="auth-subtitle">Masukkan detail Anda untuk membuat akun Anda</p>

        <!-- Error/Success Message -->
        <div id="auth-message" style="display:none; padding: var(--space-3); border-radius: var(--radius-md); margin-bottom: var(--space-4); font-size: var(--text-sm); text-align:center;"></div>

        <!-- Auth Tabs -->
        <div class="auth-tabs">
          <button class="auth-tab auth-tab--active" id="tab-signup" data-tab="signup">Sign Up</button>
          <button class="auth-tab" id="tab-login" data-tab="login">Login</button>
        </div>

        <!-- Sign Up Form -->
        <form id="auth-form" autocomplete="off">
          <div id="form-content">
            <!-- Sign Up Fields -->
            <div class="input-group" id="name-group">
              <input type="text" class="input-field" id="input-name" placeholder="Masukkan nama lengkap" required />
            </div>
            
            <div class="input-group">
              <input type="email" class="input-field" id="input-email" placeholder="Masukkan email" required />
            </div>
            
            <div class="input-group">
              <input type="password" class="input-field" id="input-password" placeholder="Kata sandi (min. 6 karakter)" required minlength="6" />
            </div>
            
            <div class="input-group" id="confirm-password-group">
              <input type="password" class="input-field" id="input-confirm-password" placeholder="Konfirmasi kata sandi" />
            </div>

            <!-- Phone Number -->
            <div class="input-group" id="phone-group">
              <input type="tel" class="input-field" id="input-phone" placeholder="Nomor WhatsApp (08xxxxxxxxxx)" />
            </div>

            <!-- Gender Selection (INLINE - UX FIX) -->
            <div class="input-group" id="gender-group">
              <label class="input-label">Gender</label>
              <div class="gender-select">
                <div class="gender-option" data-gender="pria" id="gender-pria">
                  <span>👨</span>
                  Pria
                </div>
                <div class="gender-option" data-gender="wanita" id="gender-wanita">
                  <span>👩</span>
                  Wanita
                </div>
              </div>
            </div>
          </div>

          <!-- Terms -->
          <div class="checkbox-group" style="margin: var(--space-6) 0;">
            <input type="checkbox" id="terms-checkbox" />
            <label for="terms-checkbox">Saya menyetujui <a href="#" style="color: var(--gold-primary);">syarat dan ketentuan</a></label>
          </div>

          <!-- Buttons (GOLD CTA - UX FIX) -->
          <div class="auth-buttons">
            <button type="submit" class="btn btn-primary btn-block" id="btn-submit">Daftar</button>
            <button type="button" class="btn btn-outline btn-block" id="btn-cancel">Batal</button>
          </div>
        </form>

        <!-- Social Login -->
        <div class="separator">Or Sign in with</div>
        
        <div style="display: flex; gap: var(--space-3);">
          <button class="social-btn" id="btn-google">
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            With Google
          </button>
          <button class="social-btn" id="btn-facebook">
            <svg width="20" height="20" viewBox="0 0 48 48">
              <rect width="48" height="48" rx="8" fill="#1877F2"/>
              <path fill="#FFFFFF" d="M26.5 25.5H31l1-5h-5.5V18c0-1.4.5-2.5 2.7-2.5H32V11.1c-.5-.1-2.1-.3-4.1-.3-4.1 0-7 2.5-7 7.1v2.6h-4.5v5H21V37h5.5V25.5z"/>
            </svg>
            With Facebook
          </button>
        </div>

        <div class="auth-footer">
          <span id="auth-toggle-text">Sudah memiliki akun? <a href="#" id="auth-toggle-link" style="color: var(--gold-primary); font-weight: 600;">Masuk</a></span>
        </div>
      </div>
    </div>
  `;

  // Setup after render
  setTimeout(setupAuthInteractions, 50);

  return html;
}

function showMessage(text, isError = true) {
  const msgEl = document.getElementById('auth-message');
  if (!msgEl) return;
  msgEl.textContent = text;
  msgEl.style.display = 'block';
  msgEl.style.background = isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)';
  msgEl.style.color = isError ? '#ef4444' : '#22c55e';
  msgEl.style.border = isError ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)';
}

function setLoading(isLoading) {
  const btn = document.getElementById('btn-submit');
  if (!btn) return;
  btn.disabled = isLoading;
  btn.style.opacity = isLoading ? '0.6' : '1';
  btn.textContent = isLoading ? 'Loading...' : (btn.dataset.mode === 'login' ? 'Masuk' : 'Daftar');
}

function setupAuthInteractions() {
  let isSignUp = true;
  let selectedGender = '';

  // Tab switching
  const tabSignup = document.getElementById('tab-signup');
  const tabLogin = document.getElementById('tab-login');
  const confirmGroup = document.getElementById('confirm-password-group');
  const genderGroup = document.getElementById('gender-group');
  const nameGroup = document.getElementById('name-group');
  const phoneGroup = document.getElementById('phone-group');
  const authTitle = document.querySelector('.auth-title');
  const authSubtitle = document.querySelector('.auth-subtitle');
  const toggleText = document.getElementById('auth-toggle-text');
  const btnSubmit = document.getElementById('btn-submit');
  const msgEl = document.getElementById('auth-message');

  function switchToSignUp() {
    isSignUp = true;
    tabSignup?.classList.add('auth-tab--active');
    tabLogin?.classList.remove('auth-tab--active');
    if (nameGroup) nameGroup.style.display = '';
    if (confirmGroup) confirmGroup.style.display = '';
    if (genderGroup) genderGroup.style.display = '';
    if (phoneGroup) phoneGroup.style.display = '';
    if (authTitle) authTitle.textContent = 'Sign Up';
    if (authSubtitle) authSubtitle.textContent = 'Masukkan detail Anda untuk membuat akun Anda';
    if (toggleText) toggleText.innerHTML = 'Sudah memiliki akun? <a href="#" id="auth-toggle-link" style="color: var(--gold-primary); font-weight: 600;">Masuk</a>';
    if (btnSubmit) { btnSubmit.textContent = 'Daftar'; btnSubmit.dataset.mode = 'signup'; }
    if (msgEl) msgEl.style.display = 'none';
    rebindToggle();
  }

  function switchToLogin() {
    isSignUp = false;
    tabLogin?.classList.add('auth-tab--active');
    tabSignup?.classList.remove('auth-tab--active');
    if (nameGroup) nameGroup.style.display = 'none';
    if (confirmGroup) confirmGroup.style.display = 'none';
    if (genderGroup) genderGroup.style.display = 'none';
    if (phoneGroup) phoneGroup.style.display = 'none';
    if (authTitle) authTitle.textContent = 'Login';
    if (authSubtitle) authSubtitle.textContent = 'Masuk ke akun Anda';
    if (toggleText) toggleText.innerHTML = 'Belum punya akun? <a href="#" id="auth-toggle-link" style="color: var(--gold-primary); font-weight: 600;">Daftar</a>';
    if (btnSubmit) { btnSubmit.textContent = 'Masuk'; btnSubmit.dataset.mode = 'login'; }
    if (msgEl) msgEl.style.display = 'none';
    rebindToggle();
  }

  function rebindToggle() {
    const link = document.getElementById('auth-toggle-link');
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (isSignUp) switchToLogin();
        else switchToSignUp();
      });
    }
  }

  tabSignup?.addEventListener('click', switchToSignUp);
  tabLogin?.addEventListener('click', switchToLogin);
  rebindToggle();

  // Gender selection
  const genderOptions = document.querySelectorAll('.gender-option');
  genderOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      genderOptions.forEach(o => o.classList.remove('gender-option--selected'));
      opt.classList.add('gender-option--selected');
      selectedGender = opt.dataset.gender;
    });
  });

  // Form submit — Connected to Supabase Auth
  const form = document.getElementById('auth-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('input-email')?.value?.trim() || '';
    const password = document.getElementById('input-password')?.value || '';

    if (!email || !password) {
      showMessage('Email dan password wajib diisi.');
      return;
    }

    setLoading(true);

    if (isSignUp) {
      // ========== SIGN UP ==========
      const name = document.getElementById('input-name')?.value?.trim() || '';
      const phone = document.getElementById('input-phone')?.value?.trim() || '';
      const confirmPassword = document.getElementById('input-confirm-password')?.value || '';

      if (!name) { showMessage('Nama lengkap wajib diisi.'); setLoading(false); return; }
      if (!selectedGender) { showMessage('Silakan pilih gender Anda.'); setLoading(false); return; }
      if (password !== confirmPassword) { showMessage('Password dan konfirmasi password tidak sama.'); setLoading(false); return; }
      if (password.length < 6) { showMessage('Password minimal 6 karakter.'); setLoading(false); return; }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone_number: phone,
            gender: selectedGender
          }
        }
      });

      if (error) {
        showMessage(error.message);
        setLoading(false);
        return;
      }

      // Cek apakah Supabase mengirim email konfirmasi atau langsung confirmed
      if (data.user && !data.user.confirmed_at && data.user.identities?.length === 0) {
        showMessage('Email sudah terdaftar. Silakan login.', true);
        setLoading(false);
        return;
      }

      // Simpan profil ke tabel profiles
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: name,
          phone_number: phone,
          gender: selectedGender === 'pria' ? 'Male' : 'Female'
        });
      }

      // Update local state
      updateNested('user.name', name);
      updateNested('user.email', email);
      updateNested('user.phone', phone);
      updateNested('user.gender', selectedGender);
      updateNested('user.role', 'user');
      updateNested('user.isLoggedIn', true);
      if (data.user) updateNested('user.id', data.user.id);

      showMessage('Registrasi berhasil! Mengarahkan...', false);
      setTimeout(() => navigate('/services'), 1000);

    } else {
      // ========== LOGIN ==========
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        showMessage(error.message === 'Invalid login credentials' ? 'Email atau password salah.' : error.message);
        setLoading(false);
        return;
      }

      // Ambil data profil
      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      // Jika user belum memiliki profil (misal daftar sebelum fitur ini ada)
      if (!profile) {
        const newProfile = {
          id: data.user.id,
          full_name: data.user.user_metadata?.full_name || data.user.email.split('@')[0],
          role: 'user'
        };
        const { error: upsertErr } = await supabase.from('profiles').upsert(newProfile);
        if (!upsertErr) profile = newProfile;
      }

      updateNested('user.name', profile?.full_name || data.user.user_metadata?.full_name || '');
      updateNested('user.email', data.user.email || '');
      updateNested('user.phone', profile?.phone_number || data.user.user_metadata?.phone_number || '');
      updateNested('user.gender', profile?.gender?.toLowerCase() === 'male' ? 'pria' : (profile?.gender?.toLowerCase() === 'female' ? 'wanita' : data.user.user_metadata?.gender || ''));
      updateNested('user.role', profile?.role || 'user');
      updateNested('user.isLoggedIn', true);
      updateNested('user.id', data.user.id);

      showMessage('Login berhasil! Mengarahkan...', false);
      
      // If admin, navigate to admin panel
      if (profile?.role === 'admin') {
        setTimeout(() => navigate('/admin'), 1000);
      } else {
        setTimeout(() => navigate('/services'), 1000);
      }
    }
  });

  // Google Sign-In
  document.getElementById('btn-google')?.addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) showMessage(error.message);
  });

  // Cancel button
  document.getElementById('btn-cancel')?.addEventListener('click', () => {
    navigate('/');
  });
}
