
consolelog("Kasus.js berhasil dimuat")

let casesData = [];

// Fungsi untuk memuat data dari JSON
async function loadCasesData() {
    try {
        const response = await fetch('./json/kasus.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        casesData = data.kasus;
        
        console.log('Data kasus berhasil dimuat:', casesData.length, 'kasus');
        
        // Render setelah data dimuat
        renderCases();
        updateStats();
    } catch (error) {
        console.error('Gagal memuat data kasus:', error);
        // Tampilkan error ke user
        const container = document.getElementById('casesContainer');
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-exclamation-triangle text-danger" style="font-size: 4rem;"></i>
                    <p class="text-danger mt-3">Gagal memuat data kasus. Silakan refresh halaman.</p>
                </div>
            `;
        }
    }
}

// Fungsi untuk render kartu kasus
function renderCases(filter = 'all') {
    const container = document.getElementById('casesContainer');
    if (!container) return;
    
    container.innerHTML = '';

    const filteredCases = filter === 'all' 
        ? casesData 
        : casesData.filter(c => c.status === filter);

    if (filteredCases.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-inbox text-muted" style="font-size: 4rem;"></i>
                <p class="text-muted mt-3">Tidak ada kasus dengan status ini</p>
            </div>
        `;
        return;
    }

    filteredCases.forEach(kasus => {
        const statusClass = `status-${kasus.status}`;
        const statusText = {
            'pengajuan': 'Pengajuan',
            'penyelidikan': 'Penyelidikan',
            'selesai': 'Selesai',
            'ditolak': 'Ditolak'
        }[kasus.status];

        const priorityIcon = {
            'critical': '<i class="bi bi-exclamation-circle-fill text-danger ms-2" title="Prioritas Kritis"></i>',
            'high': '<i class="bi bi-exclamation-triangle-fill text-warning ms-2" title="Prioritas Tinggi"></i>',
            'medium': '<i class="bi bi-info-circle-fill text-info ms-2" title="Prioritas Sedang"></i>',
            'low': '<i class="bi bi-dash-circle text-muted ms-2" title="Prioritas Rendah"></i>'
        }[kasus.priority] || '';

        const card = `
            <div class="col-md-6 col-lg-4">
                <div class="case-card h-100">
                    <img src="${kasus.image}" class="case-image" alt="${kasus.species}"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22%3E%3Crect fill=%22%2310b981%22 width=%22400%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2260%22%3E${kasus.species.charAt(0)}%3C/text%3E%3C/svg%3E';">
                    <div class="p-4">
                        <div class="mb-2 d-flex align-items-center">
                            <span class="status-badge ${statusClass}">${statusText}</span>
                            ${priorityIcon}
                        </div>
                        <h5 class="fw-bold mb-2">${kasus.title}</h5>
                        <p class="text-muted small mb-2">
                            <i class="bi bi-geo-alt me-1"></i>${kasus.location}
                        </p>
                        <p class="text-muted small mb-3">
                            <i class="bi bi-calendar me-1"></i>${kasus.date}
                        </p>
                        <p class="mb-3">${kasus.description.substring(0, 100)}...</p>
                        <button class="btn btn-outline-success w-100" onclick="showCaseDetail(${kasus.id})">
                            <i class="bi bi-eye me-2"></i>Lihat Detail
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Fungsi untuk menampilkan detail kasus
function showCaseDetail(id) {
    const kasus = casesData.find(c => c.id === id);
    if (!kasus) return;

    const statusText = {
        'pengajuan': 'Pengajuan',
        'penyelidikan': 'Penyelidikan',
        'selesai': 'Selesai',
        'ditolak': 'Ditolak'
    }[kasus.status];

    const statusClass = `status-${kasus.status}`;

    const priorityBadge = {
        'critical': '<span class="badge bg-danger ms-2">Prioritas Kritis</span>',
        'high': '<span class="badge bg-warning text-dark ms-2">Prioritas Tinggi</span>',
        'medium': '<span class="badge bg-info ms-2">Prioritas Sedang</span>',
        'low': '<span class="badge bg-secondary ms-2">Prioritas Rendah</span>'
    }[kasus.priority] || '';

    const timeline = kasus.updates.map(update => `
        <div class="progress-step ${update.status}">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <strong>${update.text}</strong>
                    <div class="text-muted small">${update.date}</div>
                </div>
                ${update.status === 'completed' ? '<i class="bi bi-check-circle-fill text-success"></i>' : ''}
                ${update.status === 'current' ? '<i class="bi bi-arrow-right-circle-fill text-warning"></i>' : ''}
            </div>
        </div>
    `).join('');

    document.getElementById('modalTitle').textContent = kasus.title;
    document.getElementById('modalBody').innerHTML = `
        <img src="${kasus.image}" class="w-100 rounded mb-4" style="max-height: 300px; object-fit: cover;"
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%2310b981%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2280%22%3E${kasus.species.charAt(0)}%3C/text%3E%3C/svg%3E';">
        
        <div class="mb-3">
            <span class="status-badge ${statusClass}">${statusText}</span>
            ${priorityBadge}
        </div>

        <div class="row mb-4">
            <div class="col-md-6 mb-3">
                <strong><i class="bi bi-geo-alt me-2 text-danger"></i>Lokasi:</strong>
                <p class="mb-0">${kasus.location}</p>
            </div>
            <div class="col-md-6 mb-3">
                <strong><i class="bi bi-calendar me-2 text-primary"></i>Tanggal:</strong>
                <p class="mb-0">${kasus.date}</p>
            </div>
            <div class="col-md-6 mb-3">
                <strong><i class="bi bi-flower1 me-2 text-success"></i>Spesies:</strong>
                <p class="mb-0">${kasus.species}</p>
            </div>
            <div class="col-md-6 mb-3">
                <strong><i class="bi bi-person me-2 text-info"></i>Pelapor:</strong>
                <p class="mb-0">${kasus.reporter}</p>
            </div>
        </div>

        <div class="mb-4">
            <strong><i class="bi bi-file-text me-2"></i>Deskripsi Lengkap:</strong>
            <p class="mt-2">${kasus.description}</p>
        </div>

        <div>
            <strong class="mb-3 d-block"><i class="bi bi-clock-history me-2"></i>Timeline Penanganan:</strong>
            <div class="progress-timeline">
                ${timeline}
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('caseDetailModal'));
    modal.show();
}

function updateStats() {
    const totalKasus = casesData.length;
    const pengajuanCount = casesData.filter(c => c.status === 'pengajuan').length;
    const penyelidikanCount = casesData.filter(c => c.status === 'penyelidikan').length;
    const selesaiCount = casesData.filter(c => c.status === 'selesai').length;

    document.getElementById('totalKasus').textContent = totalKasus;
    document.getElementById('pengajuanCount').textContent = pengajuanCount;
    document.getElementById('penyelidikanCount').textContent = penyelidikanCount;
    document.getElementById('selesaiCount').textContent = selesaiCount;
}


window.showCaseDetail = showCaseDetail;
window.loadCasesData = loadCasesData;

document.addEventListener('DOMContentLoaded', async function() {
    await loadCasesData();
});