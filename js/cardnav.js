// Navigasi card

console.log("cardnav.js berhasil dimuat")

// Fungsi untuk mengubah data hierarki menjadi Array datar
function flattenSpeciesData(data) {
    const flattenedArray = [];

    // Mengiterasi melalui setiap Kingdom (plantae, animalia)
    for (const kingdomKey in data.kingdoms) {
        const kingdom = data.kingdoms[kingdomKey];

        // Mengiterasi melalui setiap Division (magnoliophyta, mammalia)
        for (const divisionKey in kingdom.divisions) {
            const division = kingdom.divisions[divisionKey];

            // Mengiterasi melalui setiap Species
            for (const speciesKey in division.species) {
                const species = division.species[speciesKey];
                
                // Menambahkan objek spesies ke dalam Array datar
                flattenedArray.push(species);
            }
        }
    }

    return flattenedArray;
}

// Fungsi untuk memuat data spesies dari file JSON
async function loadSpeciesData() {
    try {
        const response = await fetch('../json/test.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        allSpecies = flattenSpeciesData(data);
        
        // Debug: check first few items
        console.log('First 3 species:', allSpecies.slice(0, 3));
        console.log('Data spesies berhasil dimuat. Jumlah item:', allSpecies.length); 

    } catch (error) {
        console.error('Gagal memuat data spesies:', error);
    }
}

async function renderSpeciesCards() {
  await loadSpeciesData();
  
  const cardsContainer = document.querySelector('.row.g-5.justify-content-center.align-items-center');
  
  if (!cardsContainer || !allSpecies || allSpecies.length === 0) {
    console.error('Cards container not found or no species data');
    return;
  }
  
  const displaySpecies = allSpecies.slice(0, 4);
  
  displaySpecies.forEach((species, index) => {
    // Validasi dengan field yang benar
    if (!species || !species.nama) {
        console.warn(`Skipping invalid species at index ${index}:`, species);
        return;
    }
    
    const col = document.createElement('div');
    col.className = 'col-12 col-md-4 col-lg-3';
    
    const primaryStatus = species.status && species.status[0] 
      ? species.status[0] 
      : { label: 'Tidak ada data', warna: '#6b7280' };
    
    col.innerHTML = `
      <div class="species-card position-relative rounded overflow-hidden shadow" 
          style="height: 450px; cursor: pointer;"
          onclick="navigateTocontentpage('${species.nama}')">
        <img src="${species.gambar || 'placeholder.jpg'}" 
             class="w-100 h-100" 
             style="object-fit: cover;"
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22450%22%3E%3Crect fill=%22%2310b981%22 width=%22400%22 height=%22450%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2280%22%3E${species.nama.charAt(0)}%3C/text%3E%3C/svg%3E';">
        <div class="position-absolute bottom-0 start-0 w-100 text-white p-3" 
            style="background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);">
          <h3 class="h5 mb-1 fw-bold">${species.nama}</h3>
          <small class="d-block mb-2">${species.namaLatin || ''}</small>
          <span class="badge" style="background-color: ${primaryStatus.warna};">${primaryStatus.label}</span>
        </div>
      </div>
    `;
    
    cardsContainer.appendChild(col);
  });
}

// Fungsi slide left dan right
let currentIndex = 0;
const cardsPerView = 4;

async function slideLeft() {
  if (!allSpecies || allSpecies.length === 0) return;
  
  currentIndex = Math.max(0, currentIndex - cardsPerView);
  await updateCardsView();
}

async function slideRight() {
  if (!allSpecies || allSpecies.length === 0) return;
  
  const maxIndex = Math.max(0, allSpecies.length - cardsPerView);
  currentIndex = Math.min(maxIndex, currentIndex + cardsPerView);
  await updateCardsView();
}

async function updateCardsView() {
  const cardsContainer = document.querySelector('.row.g-5.justify-content-center.align-items-center');
  if (!cardsContainer) return;
  
  const displaySpecies = allSpecies.slice(currentIndex, currentIndex + cardsPerView);
  
  cardsContainer.innerHTML = '';
  
  displaySpecies.forEach(species => {
    if (!species || !species.nama) {
        console.warn('Skipping invalid species data:', species);
        return;
    }
    
    const col = document.createElement('div');
    col.className = 'col-12 col-md-4 col-lg-3';
    
    const primaryStatus = species.status && species.status[0] 
      ? species.status[0] 
      : { label: 'Tidak ada data', warna: '#6b7280' };
    
    col.innerHTML = `
      <div class="species-card position-relative rounded overflow-hidden shadow" 
          style="height: 450px; cursor: pointer;"
          onclick="navigateTocontentpage('${species.nama}')">
        <img src="${species.gambar || 'placeholder.jpg'}" 
             class="w-100 h-100" 
             style="object-fit: cover;"
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22450%22%3E%3Crect fill=%22%2310b981%22 width=%22400%22 height=%22450%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2280%22%3E${species.nama.charAt(0)}%3C/text%3E%3C/svg%3E';">
        <div class="position-absolute bottom-0 start-0 w-100 text-white p-3" 
            style="background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);">
          <h3 class="h5 mb-1 fw-bold">${species.nama}</h3>
          <small class="d-block mb-2">${species.namaLatin || ''}</small>
          <span class="badge" style="background-color: ${primaryStatus.warna};">${primaryStatus.label}</span>
        </div>
      </div>
    `;
    
    cardsContainer.appendChild(col);
  });
}

// Fungsi untuk navigasi ke halaman detail
function navigateTocontentpage(speciesName) {
  
  // Navigasi ke halaman content dengan parameter nama spesies
  window.location.href = `./contentpagednm.html?species=${encodedName}`;
}

// Export ke window agar bisa dipanggil dari onclick
window.navigateTocontentpage = navigateTocontentpage;

document.addEventListener('DOMContentLoaded', async function() {
  // Jika di halaman index, render cards
  if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    await renderSpeciesCards();
  }
});


window.slideLeft = slideLeft;
window.slideRight = slideRight;
window.renderSpeciesCards = renderSpeciesCards;