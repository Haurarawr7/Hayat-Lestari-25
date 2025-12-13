console.log(" laporan.js berhasil dimuat");

const WHATSAPP_NUMBER = '082121018455'; 


function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
        console.warn(' User tidak login');
        alert('Silakan login terlebih dahulu!');
        window.location.href = 'index.html';
        return false;
    }

    return true;
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}


function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) {
        console.error(' Alert container tidak ditemukan');
        return;
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-custom`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    alertContainer.appendChild(alertDiv);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}


async function handleReportSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    const user = getCurrentUser();
    let userData = null;

    if (user) {
        console.log('User:', user.username);
        userData = user;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Membuat pesan WA...';

    try {
        const formData = new FormData(form);

        // --- HAPUS VALIDASI FILE DI SINI ---
        
        // Prepare report data
        const reportData = {
            type: formData.get('type'),
            name: formData.get('name'),
            email: formData.get('email') || '-',
            description: formData.get('description'),
            location: formData.get('location'),
            date: formData.get('date'),
            contact: formData.get('contact') || '-',
            submittedAt: new Date().toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            submittedBy: userData ? userData.username : formData.get('name'),
            userId: userData ? userData.id : 'Anonim'
        };

        console.log('Data laporan:', reportData);

        // 1. Buat Teks Laporan
        let whatsappMessage = `*LAPORAN BARU HayatLestari*\n\n`;
        whatsappMessage += `*Jenis Laporan:* ${reportData.type}\n`;
        whatsappMessage += `*Pelapor (Nama/Akun):* ${reportData.submittedBy} (${reportData.userId})\n`;
        whatsappMessage += `*Nama Kontak:* ${reportData.name}\n`;
        whatsappMessage += `*Kontak Lain:* ${reportData.contact}\n`;
        whatsappMessage += `*Lokasi:* ${reportData.location}\n`;
        whatsappMessage += `*Tanggal Kejadian:* ${reportData.date}\n`;
        whatsappMessage += `*Deskripsi Kejadian:*\n${reportData.description}\n\n`;
        whatsappMessage += `_Dikirim pada: ${reportData.submittedAt}_`;


        // 2. Encode Teks untuk URL
        const encodedMessage = encodeURIComponent(whatsappMessage);

        // 3. Buat URL WhatsApp
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        
        console.log('URL WhatsApp:', whatsappUrl);

        // 4. Buka URL WhatsApp
        window.open(whatsappUrl, '_blank');
        
        console.log(' Laporan berhasil diformat dan diarahkan ke WA!');

        // Show success message
        if (typeof showAlert === 'function') {
            showAlert(`
                <strong><i class="bi bi-check-circle"></i> Pesan Laporan Berhasil Dibuat!</strong><br>
                Anda akan diarahkan ke WhatsApp untuk mengirimkan pesan.
            `, 'success');
        } else {
            alert('Pesan laporan berhasil dibuat. Anda akan diarahkan ke WhatsApp untuk mengirimkan pesan.');
        }

        // Reset form
        form.reset();
    } catch (error) {
        console.error('Error:', error);

        if (typeof showAlert === 'function') {
            showAlert(`
                <strong><i class="bi bi-exclamation-triangle"></i> Gagal memproses laporan</strong><br>
                ${error.message}
            `, 'danger');
        } else {
            alert('Gagal memproses laporan:\n' + error.message);
        }

    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }

    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reportForm');
    if (form) {
        form.addEventListener('submit', handleReportSubmit);
    } else {
        console.error(' gagal, tidak ditemukan!');
    }
});