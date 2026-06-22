/* ========================================
   AUTH PAGE — Login / Sign Up
   ======================================== */

import { createLogo, createBackButton } from '../components/shared.js';
import { getState, updateNested } from '../state.js';
import { navigate } from '../router.js';

export function AuthPage() {
  const state = getState();
  
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

        <!-- Auth Tabs -->
        <div class="auth-tabs">
          <button class="auth-tab auth-tab--active" id="tab-signup" data-tab="signup">Sign Up</button>
          <button class="auth-tab" id="tab-login" data-tab="login">Login</button>
        </div>

        <!-- Sign Up Form -->
        <form id="auth-form" autocomplete="off">
          <div id="form-content">
            <!-- Sign Up Fields -->
            <div class="input-group">
              <input type="text" class="input-field" id="input-name" placeholder="Masukkan nama lengkap" required />
            </div>
            
            <div class="input-group">
              <input type="email" class="input-field" id="input-email" placeholder="Masukkan email" required />
            </div>
            
            <div class="input-group">
              <input type="password" class="input-field" id="input-password" placeholder="Kata sandi" required />
            </div>
            
            <div class="input-group" id="confirm-password-group">
              <input type="password" class="input-field" id="input-confirm-password" placeholder="Konfirmasi kata sandi" />
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
            <button type="submit" class="btn btn-primary btn-block" id="btn-submit">Kirim</button>
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

function setupAuthInteractions() {
  let isSignUp = true;
  let selectedGender = '';

  // Tab switching
  const tabSignup = document.getElementById('tab-signup');
  const tabLogin = document.getElementById('tab-login');
  const confirmGroup = document.getElementById('confirm-password-group');
  const genderGroup = document.getElementById('gender-group');
  const authTitle = document.querySelector('.auth-title');
  const authSubtitle = document.querySelector('.auth-subtitle');
  const toggleText = document.getElementById('auth-toggle-text');
  const btnSubmit = document.getElementById('btn-submit');

  function switchToSignUp() {
    isSignUp = true;
    tabSignup?.classList.add('auth-tab--active');
    tabLogin?.classList.remove('auth-tab--active');
    if (confirmGroup) confirmGroup.style.display = '';
    if (genderGroup) genderGroup.style.display = '';
    if (authTitle) authTitle.textContent = 'Sign Up';
    if (authSubtitle) authSubtitle.textContent = 'Masukkan detail Anda untuk membuat akun Anda';
    if (toggleText) toggleText.innerHTML = 'Sudah memiliki akun? <a href="#" id="auth-toggle-link" style="color: var(--gold-primary); font-weight: 600;">Masuk</a>';
    if (btnSubmit) btnSubmit.textContent = 'Kirim';
    rebindToggle();
  }

  function switchToLogin() {
    isSignUp = false;
    tabLogin?.classList.add('auth-tab--active');
    tabSignup?.classList.remove('auth-tab--active');
    if (confirmGroup) confirmGroup.style.display = 'none';
    if (genderGroup) genderGroup.style.display = 'none';
    if (authTitle) authTitle.textContent = 'Login';
    if (authSubtitle) authSubtitle.textContent = 'Masuk ke akun Anda';
    if (toggleText) toggleText.innerHTML = 'Belum punya akun? <a href="#" id="auth-toggle-link" style="color: var(--gold-primary); font-weight: 600;">Daftar</a>';
    if (btnSubmit) btnSubmit.textContent = 'Masuk';
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

  // Form submit
  const form = document.getElementById('auth-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('input-name')?.value || '';
    const email = document.getElementById('input-email')?.value || '';

    if (isSignUp && !selectedGender) {
      alert('Silakan pilih gender Anda');
      return;
    }

    updateNested('user.name', name);
    updateNested('user.email', email);
    updateNested('user.gender', selectedGender);
    updateNested('user.isLoggedIn', true);

    navigate('/services');
  });

  // Cancel button
  document.getElementById('btn-cancel')?.addEventListener('click', () => {
    navigate('/');
  });
}
