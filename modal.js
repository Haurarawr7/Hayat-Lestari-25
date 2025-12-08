// modalRegister.js - Script untuk membuat dan mengelola modal register secara dinamis

// Fungsi untuk membuat dan menyisipkan modal register ke dalam DOM
function createRegisterModal() {
    // Cek apakah modal sudah ada
    if (document.getElementById('registerModal')) {
        return; // Jika sudah ada, jangan buat lagi
    }

    // HTML untuk modal register
    const modalHTML = `
        <!-- REGISTER MODAL -->
        <div class="modal fade" id="registerModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-person-plus me-2"></i>
                            Buat Akun Baru
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form onsubmit="handleRegister(event)">
                            <div class="mb-3">
                                <label class="form-label">Nama Lengkap</label>
                                <input type="text" class="form-control" placeholder="Masukkan nama lengkap" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" placeholder="nama@email.com" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <div class="password-wrapper">
                                    <input type="password" class="form-control" id="registerPassword" placeholder="Minimal 8 karakter" required minlength="8">
                                    <i class="bi bi-eye password-toggle" onclick="togglePassword('registerPassword', this)"></i>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Konfirmasi Password</label>
                                <div class="password-wrapper">
                                    <input type="password" class="form-control" id="confirmPassword" placeholder="Masukkan password lagi" required>
                                    <i class="bi bi-eye password-toggle" onclick="togglePassword('confirmPassword', this)"></i>
                                </div>
                            </div>

                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="agreeTerms" required>
                                <label class="form-check-label" for="agreeTerms">
                                    Saya setuju dengan <a href="#" style="color: #10b981;">Syarat & Ketentuan</a>
                                </label>
                            </div>

                            <button type="submit" class="btn btn-primary-custom text-white w-100 mb-3">
                                <i class="bi bi-person-plus me-2"></i>Daftar
                            </button>
                        </form>

                        <div class="divider">
                            <span>atau daftar dengan</span>
                        </div>

                        <button class="btn btn-google w-100" onclick="googleRegister()">
                            <svg width="20" height="20" viewBox="0 0 20 20">
                                <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"/>
                                <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"/>
                                <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"/>
                                <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"/>
                            </svg>
                            Daftar dengan Google
                        </button>

                        <div class="switch-auth">
                            Sudah punya akun? <a onclick="switchToLogin()">Masuk di sini</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Sisipkan modal ke dalam body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Tambahkan CSS untuk styling tambahan jika diperlukan
    const style = document.createElement('style');
    style.textContent = `
        .password-wrapper {
            position: relative;
        }
        .password-toggle {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #6c757d;
        }
        .password-toggle:hover {
            color: #495057;
        }
        .btn-primary-custom {
            background-color: #10b981;
            border-color: #10b981;
        }
        .btn-primary-custom:hover {
            background-color: #059669;
            border-color: #059669;
        }
        .btn-google {
            background-color: #ffffff;
            border: 1px solid #dadce0;
            color: #3c4043;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .btn-google:hover {
            background-color: #f8f9fa;
        }
        .divider {
            display: flex;
            align-items: center;
            text-align: center;
            margin: 20px 0;
        }
        .divider::before,
        .divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background-color: #dee2e6;
        }
        .divider span {
            padding: 0 10px;
            color: #6c757d;
            font-size: 0.875rem;
        }
        .switch-auth {
            text-align: center;
            margin-top: 15px;
            font-size: 0.875rem;
        }
        .switch-auth a {
            color: #10b981;
            cursor: pointer;
            text-decoration: none;
        }
        .switch-auth a:hover {
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);
}

// Fungsi untuk menampilkan modal register
function showRegisterModal() {
    // Pastikan modal sudah dibuat
    if (!document.getElementById('registerModal')) {
        createRegisterModal();
    }
    
    // Tampilkan modal menggunakan Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('registerModal'));
    modal.show();
}

// Fungsi untuk menangani registrasi
function handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const nama = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('#registerPassword').value;
    const confirmPassword = form.querySelector('#confirmPassword').value;
    const agreeTerms = form.querySelector('#agreeTerms').checked;

    // Validasi sederhana
    if (password !== confirmPassword) {
        alert('Password dan konfirmasi password tidak cocok!');
        return;
    }

    if (!agreeTerms) {
        alert('Anda harus menyetujui syarat dan ketentuan!');
        return;
    }

    // Simulasi registrasi (ganti dengan logika sebenarnya)
    console.log('Registrasi:', { nama, email, password });
    alert('Registrasi berhasil! Selamat datang di HayatLestari.');
    
    // Tutup modal
    bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
    
    // Reset form
    form.reset();
}

// Fungsi untuk toggle visibility password
function togglePassword(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        iconElement.classList.remove('bi-eye');
        iconElement.classList.add('bi-eye-slash');
    } else {
        input.type = 'password';
        iconElement.classList.remove('bi-eye-slash');
        iconElement.classList.add('bi-eye');
    }
}

// Fungsi untuk registrasi dengan Google (placeholder)
function googleRegister() {
    // Implementasi registrasi Google di sini
    alert('Fitur registrasi dengan Google akan segera hadir!');
}

// Fungsi untuk switch ke login (placeholder - asumsikan ada modal login terpisah)
function switchToLogin() {
    // Tutup modal register
    bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
    
    // Tampilkan modal login (asumsikan ada fungsi showLoginModal)
    if (typeof showLoginModal === 'function') {
        showLoginModal();
    } else {
        alert('Modal login belum tersedia. Silakan implementasikan showLoginModal().');
    }
}

// Ekspor fungsi untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createRegisterModal, showRegisterModal };
}

// Inisialisasi otomatis saat script dimuat (opsional)
document.addEventListener('DOMContentLoaded', function() {
    // Buat modal saat DOM siap, tapi jangan tampilkan otomatis
    createRegisterModal();
});
