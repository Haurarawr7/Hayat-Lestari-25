console.log("modal.js berhasil");

 // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  //  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  import {
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
  } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCWdQ39H_2GM50snDLdTMYAVtelSrnt01Y",
    authDomain: "hayatlestari.firebaseapp.com",
    projectId: "hayatlestari",
    storageBucket: "hayatlestari.firebasestorage.app",
    messagingSenderId: "217729489546",
    appId: "1:217729489546:web:d8692bf5b1174cca64eb73",
    measurementId: "G-XETW0GKMN7"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

console.log(" Firebase initialized");

// buat register
function createRegisterModal() {
  if (document.getElementById("registerModal")) return;

  const modalHTML = `
    <div class="modal fade" id="registerModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-person-plus me-2"></i>Buat Akun Baru</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div id="registerAlert"></div>
            
            <form id="registerForm">
              <div class="mb-3">
                <label class="form-label">Nama Lengkap</label>
                <input type="text" id="registerName" class="form-control" required>
              </div>

              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" id="registerEmail" class="form-control" required>
              </div>

              <div class="mb-3">
                <label class="form-label">Password</label>
                <div class="password-wrapper position-relative">
                  <input type="password" class="form-control" id="registerPassword" minlength="8" required>
                  <i class="bi bi-eye password-toggle position-absolute top-50 end-0 translate-middle-y me-3" 
                     style="cursor: pointer;" data-target="registerPassword"></i>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Konfirmasi Password</label>
                <div class="password-wrapper position-relative">
                  <input type="password" class="form-control" id="confirmPassword" required>
                  <i class="bi bi-eye password-toggle position-absolute top-50 end-0 translate-middle-y me-3" 
                     style="cursor: pointer;" data-target="confirmPassword"></i>
                </div>
              </div>

              <button type="submit" class="btn btn-dark text-white w-100 mb-3" id="registerBtn">
                <i class="bi bi-person-plus me-2"></i>Daftar
              </button>
            </form>

            <div class="divider text-center my-3">
              <span class="px-2 bg-white text-muted">atau daftar dengan</span>
            </div>

            <button class="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2" 
                    id="googleRegisterBtn">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Daftar dengan Google
            </button>

            <div class="text-center mt-3">
              Sudah punya akun? <a href="#" id="switchToLoginLink" style="color: #10b981; text-decoration: none;">Masuk di sini</a>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

// buat login
function createLoginModal() {
  if (document.getElementById("loginModal")) return;

  const modalHTML = `
    <div class="modal fade" id="loginModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-box-arrow-in-right me-2"></i>Masuk</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div id="loginAlert"></div>
            
            <form id="loginForm">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" id="loginEmail" class="form-control" required>
              </div>

              <div class="mb-3">
                <label class="form-label">Password</label>
                <div class="password-wrapper position-relative">
                  <input type="password" class="form-control" id="loginPassword" required minlength="8">
                  <i class="bi bi-eye password-toggle position-absolute top-50 end-0 translate-middle-y me-3" 
                     style="cursor: pointer;" data-target="loginPassword"></i>
                </div>
              </div>

              <button type="submit" class="btn btn-dark w-100 mb-3" id="loginBtn">
                <i class="bi bi-box-arrow-in-right me-2"></i>Masuk
              </button>
            </form>

            <div class="divider text-center my-3">
              <span class="px-2 bg-white text-muted">atau masuk dengan</span>
            </div>

            <button class="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2" 
                    id="googleLoginBtn">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Masuk dengan Google
            </button>

            <div class="text-center mt-3">
              Belum punya akun? <a href="#" id="switchToRegisterLink" style="color: #10b981; text-decoration: none;">Daftar di sini</a>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

// munculin register
export function showRegisterModal() {
  if (!document.getElementById("registerModal")) createRegisterModal();
  new bootstrap.Modal(document.getElementById("registerModal")).show();
}

// munculin login
export function showLoginModal() {
  if (!document.getElementById("loginModal")) createLoginModal();
  new bootstrap.Modal(document.getElementById("loginModal")).show();
}

function showAlert(elementId, message, type = 'danger') {
  const alertDiv = document.getElementById(elementId);
  if (alertDiv) {
    alertDiv.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
    
    setTimeout(() => {
      alertDiv.innerHTML = '';
    }, 5000);
  }
}

function setButtonLoading(buttonId, loading = true) {
  const button = document.getElementById(buttonId);
  if (button) {
    if (loading) {
      button.disabled = true;
      button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
    } else {
      button.disabled = false;

      if (buttonId === 'registerBtn') {
        button.innerHTML = '<i class="bi bi-person-plus me-2"></i>Daftar';
      } else if (buttonId === 'loginBtn') {
        button.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Masuk';
      }
    }
  }
}

// ===== GOOGLE SIGN IN =====
async function handleGoogleSignIn() {
  try {
    console.log("Starting Google Sign In...");
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    showAlert('registerAlert', `Selamat datang, ${user.displayName}!`, 'success');
    showAlert('loginAlert', `Selamat datang, ${user.displayName}!`, 'success');
    
    setTimeout(() => {
      window.location.href = "userinterface.html";
    }, 1000);
    
  } catch (error) {
    console.error("Google Sign In Error:", error);
    let errorMessage = 'Terjadi kesalahan saat login dengan Google';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Popup ditutup. Silakan coba lagi.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup diblokir browser. Aktifkan popup untuk website ini.';
    }
    
    showAlert('registerAlert', errorMessage, 'danger');
    showAlert('loginAlert', errorMessage, 'danger');
  }
}

// 
async function handleEmailRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPass = document.getElementById('confirmPassword').value;
  const agreed = document.getElementById('agreeRegister').checked;
  
  // Validation
  
  if (password !== confirmPass) {
    showAlert('registerAlert', 'Password dan konfirmasi password tidak sama', 'warning');
    return;
  }
  
  if (password.length < 8) {
    showAlert('registerAlert', 'Password minimal 8 karakter', 'warning');
    return;
  }
  
  setButtonLoading('registerBtn', true);
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(userCredential.user, {
      displayName: name
    });
    
    console.log("Registration Success:", userCredential.user);
    showAlert('registerAlert', `Pendaftaran berhasil! Selamat datang, ${name}!`, 'success');
    
    setTimeout(() => {
      window.location.href = "userinterface.html";
    }, 1000);
    
  } catch (error) {
    console.error("Registration Error:", error);
    let errorMessage = 'Terjadi kesalahan saat mendaftar';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Email sudah terdaftar. Gunakan email lain atau login.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password terlalu lemah. Gunakan kombinasi huruf, angka, dan simbol.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Format email tidak valid.';
    }
    
    showAlert('registerAlert', errorMessage, 'danger');
  } finally {
    setButtonLoading('registerBtn', false);
  }
}

//
async function handleEmailLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  setButtonLoading('loginBtn', true);
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log("Login Success:", user);
    showAlert('loginAlert', `Selamat datang kembali, ${user.displayName || 'User'}!`, 'success');
  
    setTimeout(() => {
      window.location.href = "userinterface.html";
    }, 1000);
    
  } catch (error) {
    console.error("Login Error:", error);
    let errorMessage = 'Email atau password salah';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'Email tidak terdaftar. Silakan daftar terlebih dahulu.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Password salah. Silakan coba lagi.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Format email tidak valid.';
    }
    
    showAlert('loginAlert', errorMessage, 'danger');
  } finally {
    setButtonLoading('loginBtn', false);
  }
}

document.addEventListener("click", (e) => {
  const toggle = e.target.closest(".password-toggle");
  if (!toggle) return;

  const id = toggle.dataset.target;
  const input = document.getElementById(id);

  if (input) {
    input.type = input.type === "password" ? "text" : "password";
    toggle.classList.toggle("bi-eye");
    toggle.classList.toggle("bi-eye-slash");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  
  createRegisterModal();
  createLoginModal();

  // submit form
  document.body.addEventListener("submit", (e) => {
    if (e.target.id === "registerForm") {
      handleEmailRegister(e);
    }
    if (e.target.id === "loginForm") {
      handleEmailLogin(e);
    }
  });

  // pindah login register
  document.body.addEventListener("click", (e) => {
    if (e.target.id === "switchToLoginLink") {
      e.preventDefault();
      const registerModal = bootstrap.Modal.getInstance(document.getElementById("registerModal"));
      if (registerModal) registerModal.hide();
      setTimeout(() => showLoginModal(), 300);
    }
    if (e.target.id === "switchToRegisterLink") {
      e.preventDefault();
      const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
      if (loginModal) loginModal.hide();
      setTimeout(() => showRegisterModal(), 300);
    }
  });

  // Google buttons
  document.body.addEventListener("click", (e) => {
    if (e.target.id === "googleRegisterBtn" || e.target.id === "googleLoginBtn") {
      e.preventDefault();
      handleGoogleSignIn();
    }
  });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(" User login:", user.email);
  } else {
    console.log("No user");
  }
});

window.showRegisterModal = showRegisterModal;
window.showLoginModal = showLoginModal;
window.auth = auth;