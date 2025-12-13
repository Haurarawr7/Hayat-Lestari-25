console.log("konten.js berhasil dimuat")

// Fungsi untuk mendapatkan parameter dari URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Fungsi untuk mencari data berdasarkan ID
function findSpeciesById(jsonData, speciesId) {
    console.log('Mencari species dengan ID:', speciesId);
    
    // kingdom
    for (const kingdomKey in jsonData.kingdoms) {
        const kingdom = jsonData.kingdoms[kingdomKey];
        
        // divisi
        for (const divisionKey in kingdom.divisions) {
            const division = kingdom.divisions[divisionKey];
            
            // spesies
            for (const speciesKey in division.species) {
                console.log(`Memeriksa species key: ${speciesKey}`);
                
                // Cek berdasarkan key (ID)
                if (speciesKey === speciesId) {
                    return division.species[speciesKey];
                }
            }
        }
    }
    return null;
}

// Fungsi untuk memuat data dari JSON
async function loadData() {
    try {
        // ambil ID dari URL parameter
        const id = getUrlParameter('id');
        
        if (!id) {
            throw new Error('Parameter ID tidak ditemukan di URL');
        }
        
        console.log('ID dari URL:', id);
        
        // fetch data dari file JSON
        const response = await fetch('./json/test.json');
        if (!response.ok) throw new Error('Gagal memuat data');
        
        const jsonData = await response.json();
        console.log('Data JSON berhasil dimuat');
        
        // cari data species berdasarkan ID
        const data = findSpeciesById(jsonData, id);
        
        if (!data) {
            throw new Error(`Data dengan ID "${id}" tidak ditemukan`);
        }
        
        console.log('Data ditemukan:', data);
        
        // Update halaman dengan data
        document.getElementById('mainImage').src = data.gambar;
        document.getElementById('mainImage').alt = data.nama;
        document.getElementById('namaUtama').textContent = data.nama;
        document.getElementById('namaLatin').textContent = `${data.namaLatin} - ${data.region}`;
        document.getElementById('deskripsi').innerHTML = `<b style="font-size: 32px;">${data.nama}</b> ${data.deskripsi.replace(data.nama, '')}`;
        
        const taksonomiDiv = document.getElementById('taksonomi');
        taksonomiDiv.innerHTML = '';
        for (const [key, value] of Object.entries(data.taksonomi)) {
            taksonomiDiv.innerHTML += `
                <div class="col-6 mb-2">
                    <div class="fw-bold text-dark text-capitalize">${key}</div>
                    <div class="text-muted">${value}</div>
                </div>
            `;
        }
        
        document.getElementById('petaLokasi').src = data.lokasi.gambarPeta;
        document.getElementById('namaLokasi').textContent = data.lokasi.nama;
         
        const statusDiv = document.getElementById('statusBadges');
        statusDiv.innerHTML = '';
        data.status.forEach(status => {
            statusDiv.innerHTML += `
                <span class="badge px-3 py-2" style="background: ${status.warna}; font-size: 0.9rem; border-radius: 20px;">
                    <b>${status.label}</b>
                </span>
            `;
        });
        
        const rekomendasiList = document.getElementById('rekomendasiList');
        rekomendasiList.innerHTML = '';
        data.rekomendasi.forEach(item => {
            rekomendasiList.innerHTML += `
                <li class="mb-1">
                    <a href="?id=${item.toLowerCase().replace(/ /g, '-')}" class="text-decoration-none text-muted">• ${item}</a>
                </li>
            `;
        });
        
        document.getElementById('loading').classList.add('d-none');
        document.getElementById('content').classList.remove('d-none');
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loading').classList.add('d-none');
        document.getElementById('error').classList.remove('d-none');
        document.getElementById('errorMessage').textContent = error.message;
    }
}

// Load data saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadData);