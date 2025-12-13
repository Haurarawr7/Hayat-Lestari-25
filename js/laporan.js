
console.log(" laporan.js berhasil dimuat");

// URL Google Apps Script
const DRIVE_UPLOAD_URL = 'https://script.google.com/macros/s/AKfycbxy9H7hOb2dGJDLmp0X2dOCSoa_Ytnam4L2lglxMydVLeHjh-RFBFSYQv1XaCQtWL0O/exec';


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


async function uploadToDrive(file, reportData) {
    try {
        console.log(' Memulai upload ke Drive:', file.name);
        console.log(' Ukuran file:', (file.size / 1024 / 1024).toFixed(2), 'MB');

        // Validate file size
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Ukuran file terlalu besar. Maksimal 5MB');
        }

        // Convert file to base64
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        console.log(' File berhasil dikonversi ke base64');

        // Prepare payload
        const payload = {
            filename: file.name,
            mimeType: file.type,
            base64Data: base64,
            reportData: reportData
        };

        console.log(' Mengirim data ke Google Apps Script...');

        // Upload to Google Drive via Apps Script
        const response = await fetch(DRIVE_UPLOAD_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();
        console.log(' Response dari server:', result);

        if (result.success) {
            console.log('Upload berhasil!');
            console.log('File URL:', result.fileUrl);
            return {
                success: true,
                fileId: result.fileId,
                fileUrl: result.fileUrl
            };
        } else {
            throw new Error(result.message || 'Upload gagal');
        }
    } catch (error) {
        console.error('Error uploading to Drive:', error);
        return {
            success: false,
            error: error.message
        };
    }
}


async function handleReportSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Check authentication if localStorage is being used
    const user = getCurrentUser();
    let userData = null;

    if (user) {
        console.log('User:', user.username);
        userData = user;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Mengirim...';

    try {
        const formData = new FormData(form);
        const fileInput = form.querySelector('input[type="file"]');

        // Validate file
        if (!fileInput.files[0]) {
            throw new Error('Mohon upload foto bukti terlebih dahulu');
        }

        // Validate file size
        if (fileInput.files[0].size > 5 * 1024 * 1024) {
            throw new Error('Ukuran file terlalu besar. Maksimal 5MB');
        }

        // Prepare report data
        const reportData = {
            type: formData.get('type'),
            name: formData.get('name'),
            email: formData.get('email') || '-',
            description: formData.get('description'),
            location: formData.get('location'),
            date: formData.get('date'),
            contact: formData.get('contact') || '-',
            submittedAt: new Date().toISOString(),
            submittedBy: userData ? userData.username : formData.get('name'),
            userId: userData ? userData.id : null
        };

        console.log('Data laporan:', reportData);

        // Update button text
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Mengupload foto...';

        // Upload to Google Drive
        const uploadResult = await uploadToDrive(fileInput.files[0], reportData);

        if (uploadResult.success) {
            console.log(' Laporan berhasil dikirim!');

            // Save to localStorage if user is logged in
            if (userData) {
                const reports = JSON.parse(localStorage.getItem('reports') || '[]');
                const newReport = {
                    id: Date.now(),
                    ...reportData,
                    photoUrl: uploadResult.fileUrl,
                    photoId: uploadResult.fileId,
                    status: 'pending'
                };
                reports.push(newReport);
                localStorage.setItem('reports', JSON.stringify(reports));
                console.log(' Laporan disimpan ke localStorage');
            }

            // Show success message
            if (typeof showAlert === 'function') {
                showAlert(`
                    <strong><i class="bi bi-check-circle"></i> Laporan Berhasil Dikirim!</strong><br>
                    Terima kasih atas kontribusi Anda dalam menjaga kelestarian alam Indonesia.
                `, 'success');
            } else {
                alert('Laporan berhasil dikirim!\n\nTerima kasih atas kontribusi Anda dalam menjaga kelestarian alam Indonesia.');
            }

            // Reset form
            form.reset();

            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = userData ? 'userinterface.html' : 'index.html';
            }, 2000);

        } else {
            throw new Error(uploadResult.error || 'Upload gagal');
        }

    } catch (error) {
        console.error('Error:', error);
        
        if (typeof showAlert === 'function') {
            showAlert(`
                <strong><i class="bi bi-exclamation-triangle"></i> Gagal mengirim laporan</strong><br>
                ${error.message}
            `, 'danger');
        } else {
            alert('Gagal mengirim laporan:\n' + error.message);
        }

    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }

    return false;
}

document.addEventListener('ContentLoaded', function() {

    const form = document.getElementById('reportForm');
    if (form) {
        form.addEventListener('submit', handleReportSubmit);
    } else {
        console.error(' gagal, tidak ditemukan!');
    }

});