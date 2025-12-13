
console.log("search.js berhasil dimuat");

let allSpecies = [];
let rawData = null; // Simpan data mentah untuk referensi

// load data json
async function loadSpeciesData() {
  try {
    const response = await fetch('./json/test.json');
    if (!response.ok) {
      throw new Error('Gagal memuat data');
    }
    rawData = await response.json();
  
    
    allSpecies = [];
    
    if (rawData.kingdoms) {
      Object.entries(rawData.kingdoms).forEach(([kingdomKey, kingdom]) => {
        
        if (kingdom.divisions) {
          Object.entries(kingdom.divisions).forEach(([divisionKey, division]) => {
            
            if (division.species) {
              Object.entries(division.species).forEach(([speciesKey, species]) => {
                
                // Transform data ke format yang mudah digunakan
                const transformedSpecies = {
                  id: speciesKey,
                  name: species.nama,
                  scientificName: species.namaLatin,
                  region: species.region,
                  image: species.gambar,
                  description: species.deskripsi,
                  category: division.nama, 
                  kingdom: kingdom.nama,
                  taxonomy: species.taksonomi,
                  location: species.lokasi,
                  status: species.status,
                  recommendations: species.rekomendasi,
                  kingdomKey: kingdomKey,
                  divisionKey: divisionKey
                };
                
                allSpecies.push(transformedSpecies);
              });
            }
          });
        }
      });
    }
    
    console.log(' Data berhasil dimuat:', allSpecies.length, 'spesies');
    console.log('Sample data:', allSpecies[0]);
    return allSpecies;
    
  } catch (error) {
    console.error('Error loading data:', error);
    allSpecies = [];
    return [];
  }
}

function searchSpecies(query) {
  if (!Array.isArray(allSpecies)) {
    console.error("allSpecies bukan Array:", allSpecies);
    return [];
  }
  
  if (!query || query.trim() === '') {
    return [];
  }
  
  const lowerQuery = query.toLowerCase().trim();
  
  // Filter berdasarkan berbagai field
  return allSpecies.filter(species => {
    const nameMatch = species.name?.toLowerCase().includes(lowerQuery);
    const scientificMatch = species.scientificName?.toLowerCase().includes(lowerQuery);
    const categoryMatch = species.category?.toLowerCase().includes(lowerQuery);
    const kingdomMatch = species.kingdom?.toLowerCase().includes(lowerQuery);
    const regionMatch = species.region?.toLowerCase().includes(lowerQuery);
    const descMatch = species.description?.toLowerCase().includes(lowerQuery);
    
    return nameMatch || scientificMatch || categoryMatch || kingdomMatch || regionMatch || descMatch;
  });
}

function displaySearchResults(results, container) {
  if (!container) return;
  
  container.innerHTML = '';
  
  if (results.length === 0) {
    container.innerHTML = `
      <div class="alert alert-info m-3" role="alert">
        <i class="bi bi-info-circle me-2"></i>
        Tidak ada hasil ditemukan. Coba kata kunci lain.
      </div>
    `;
    return;
  }
  
  const resultsList = document.createElement('div');
  resultsList.className = 'list-group';
  
  results.forEach(species => {
    const item = document.createElement('a');
    item.href = '#';
    item.className = 'list-group-item list-group-item-action';
    item.onclick = (e) => {
      e.preventDefault();
      navigateTocontentpage(species.id);
    };
    
    // Ambil status pertama untuk ditampilkan
    const primaryStatus = species.status && species.status[0] 
      ? species.status[0] 
      : { label: 'Tidak ada data', warna: '#6b7280' };
    
    item.innerHTML = `
      <div class="d-flex w-100 justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          ${species.image ? `
            <img src="${species.image}" alt="${species.name}" 
                 class="rounded me-3" 
                 style="width: 60px; height: 60px; object-fit: cover;"
                 onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect fill=%22%2310b981%22 width=%2260%22 height=%2260%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2220%22%3E${species.name.charAt(0)}%3C/text%3E%3C/svg%3E';">
          ` : `
            <div class="bg-success rounded me-3 d-flex align-items-center justify-content-center text-white" 
                 style="width: 60px; height: 60px; font-size: 24px; font-weight: bold;">
              ${species.name.charAt(0)}
            </div>
          `}
          <div>
            <h6 class="mb-1">${species.name}</h6>
            <small class="text-muted">${species.scientificName || ''}</small>
            <br>
            <small>
              <span class="badge" style="background-color: #10b981;">${species.category || 'Flora'}</span>
              <span class="badge" style="background-color: ${primaryStatus.warna};">${primaryStatus.label}</span>
            </small>
          </div>
        </div>
        <i class="bi bi-chevron-right"></i>
      </div>
    `;
    
    resultsList.appendChild(item);
  });
  
  container.appendChild(resultsList);
}

// navigasi ke content
function navigateTocontentpage(speciesId) {
  const species = allSpecies.find(s => s.id === speciesId);
  if (species) {
    sessionStorage.setItem('selectedSpecies', JSON.stringify(species));
    window.location.href = `./contentpagednm.html?id=${speciesId}`;
  } else {
    console.error('Species not found:', speciesId);
  }
}

// ===== SETUP SEARCH INPUT =====
function setupSearchInput(inputElement, resultsContainer) {
  if (!inputElement) return;
  
  let searchTimeout;
  
  if (!resultsContainer) {
    resultsContainer = document.createElement('div');
    resultsContainer.id = 'searchResults';
    resultsContainer.className = 'position-absolute bg-white shadow rounded w-100';
    
    resultsContainer.style.cssText = `
      z-index: 1050;
      max-height: 400px;
      overflow-y: auto;
      display: none;
      top: 100%;
      left: 0;
      margin-top: 8px;
    `;
    
    const searchWrapper = inputElement.closest('.search-box');
    if (searchWrapper) {
      searchWrapper.parentElement.style.position = 'relative';
      searchWrapper.parentElement.appendChild(resultsContainer);
    } else {
      inputElement.parentElement.style.position = 'relative';
      inputElement.parentElement.appendChild(resultsContainer);
    }
  }
  
  // Event: Input typing
  inputElement.addEventListener('input', function(e) {
    const query = e.target.value;
    
    clearTimeout(searchTimeout);
    
    if (query.trim() === '') {
      resultsContainer.style.display = 'none';
      return;
    }
    
    searchTimeout = setTimeout(() => {
      const results = searchSpecies(query);
      displaySearchResults(results, resultsContainer);
      resultsContainer.style.display = 'block';
    }, 300);
  });
  
  // Event: Click outside to close
  document.addEventListener('click', function(e) {
    if (!inputElement.contains(e.target) && !resultsContainer.contains(e.target)) {
      resultsContainer.style.display = 'none';
    }
  });
}

// 
function loadSpeciescontentpage() {
  const urlParams = new URLSearchParams(window.location.search);
  const speciesId = urlParams.get('id');
  
  if (!speciesId) {
    console.error('No species ID provided');
    return null;
  }
  
  // Cek sessionStorage dulu
  let species = null;
  const storedSpecies = sessionStorage.getItem('selectedSpecies');
  if (storedSpecies) {
    species = JSON.parse(storedSpecies);
  }
  
  // Kalau tidak ada, cari di allSpecies
  if (!species && allSpecies.length > 0) {
    species = allSpecies.find(s => s.id === speciesId);
  }
  
  return species;
}

// 
function displaySpeciescontentpage(species) {
  if (!species) {
    console.error('No species data to display');
    return;
  }
  
  // Update page title
  document.title = `${species.name} - HayatLestari`;
  
  // Update konten utama
  const titleElement = document.getElementById('speciesName');
  if (titleElement) titleElement.textContent = species.name;
  
  const scientificNameElement = document.getElementById('speciesScientificName');
  if (scientificNameElement) scientificNameElement.textContent = species.scientificName || '';
  
  const imageElement = document.getElementById('speciesImage');
  if (imageElement && species.image) {
    imageElement.src = species.image;
    imageElement.alt = species.name;
  }
  
  const categoryElement = document.getElementById('speciesCategory');
  if (categoryElement) categoryElement.textContent = species.category || '';
  
  // Display multiple status badges
  const statusContainer = document.getElementById('speciesStatus');
  if (statusContainer && species.status) {
    statusContainer.innerHTML = species.status.map(s => 
      `<span class="badge me-1" style="background-color: ${s.warna};">${s.label}</span>`
    ).join('');
  }
  
  const descriptionElement = document.getElementById('speciesDescription');
  if (descriptionElement) descriptionElement.textContent = species.description || '';
  
  const habitatElement = document.getElementById('speciesHabitat');
  if (habitatElement) habitatElement.textContent = species.location?.nama || '';
  
  const regionElement = document.getElementById('speciesRegion');
  if (regionElement) regionElement.textContent = species.region || '';
  
  // Display taxonomy
  const taxonomyElement = document.getElementById('speciesTaxonomy');
  if (taxonomyElement && species.taxonomy) {
    taxonomyElement.innerHTML = Object.entries(species.taxonomy)
      .map(([key, value]) => `<div><strong>${key}:</strong> ${value}</div>`)
      .join('');
  }
}

// 
function getRelatedSpecies(currentSpecies, limit = 3) {
  if (!currentSpecies) return [];
  
  // Filter species dengan kategori yang sama
  const related = allSpecies.filter(s => 
    s.id !== currentSpecies.id && 
    (s.category === currentSpecies.category || s.kingdom === currentSpecies.kingdom)
  );
  
  // Shuffle dan ambil sejumlah limit
  return related.sort(() => 0.5 - Math.random()).slice(0, limit);
}

// 
function displayRelatedSpecies(relatedSpecies, container) {
  if (!container || relatedSpecies.length === 0) return;
  
  container.innerHTML = relatedSpecies.map(species => {
    const primaryStatus = species.status && species.status[0] 
      ? species.status[0] 
      : { label: 'Tidak ada data', warna: '#6b7280' };
    
    return `
      <div class="col-md-4">
        <div class="card h-100" onclick="navigateTocontentpage('${species.id}')" style="cursor: pointer;">
          ${species.image ? `
            <img src="${species.image}" class="card-img-top" alt="${species.name}" 
                 style="height: 200px; object-fit: cover;"
                 onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'bg-success d-flex align-items-center justify-content-center text-white\\' style=\\'height: 200px;\\'><i class=\\'bi bi-image\\' style=\\'font-size: 3rem;\\'></i></div>';">
          ` : `
            <div class="bg-success d-flex align-items-center justify-content-center text-white" 
                 style="height: 200px;">
              <i class="bi bi-image" style="font-size: 3rem;"></i>
            </div>
          `}
          <div class="card-body">
            <h5 class="card-title">${species.name}</h5>
            <p class="card-text text-muted small">${species.scientificName || ''}</p>
            <span class="badge" style="background-color: #10b981;">${species.category || 'Flora'}</span>
            <span class="badge" style="background-color: ${primaryStatus.warna};">${primaryStatus.label}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}


document.addEventListener('DOMContentLoaded', async function() {
  
  // Load species data
  await loadSpeciesData();
  
  // Setup search pada halaman index
  const searchInput = document.querySelector('.search-box input[type="text"]');
  if (searchInput) {
    console.log(' Search input found, setting up...');
    setupSearchInput(searchInput);
  }
  
  // Jika di halaman content, load contentpage
  if (window.location.pathname.includes('contentpage.html')) {
    const species = loadSpeciescontentpage();
    if (species) {
      displaySpeciescontentpage(species);
      
      // Display related species
      const relatedContainer = document.getElementById('relatedSpecies');
      if (relatedContainer) {
        const related = getRelatedSpecies(species);
        displayRelatedSpecies(related, relatedContainer);
      }
    }
  }
});


window.searchSpecies = searchSpecies;
window.navigateTocontentpage = navigateTocontentpage;
window.loadSpeciesData = loadSpeciesData;
window.loadSpeciescontentpage = loadSpeciescontentpage;
window.displaySpeciescontentpage = displaySpeciescontentpage;
window.getRelatedSpecies = getRelatedSpecies;