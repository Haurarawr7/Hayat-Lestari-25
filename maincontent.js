console.log("File js berhasil dimuat")

let allSpeciesData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 5;
let currentFilter = 'all';

// Load data dari file JSON
async function loadData() {
    try {
        // Fetch data dari file JSON (ganti 'test.json' dengan nama file JSON Anda)
        const response = await fetch('test.json');
        if (!response.ok) throw new Error('Gagal memuat data');
        
        const jsonData = await response.json();
        
        // Proses data
        allSpeciesData = [];
        
        for (const kingdomKey in jsonData.kingdoms) {
            const kingdom = jsonData.kingdoms[kingdomKey];
            
            for (const divisionKey in kingdom.divisions) {
                const division = kingdom.divisions[divisionKey];
                
                for (const speciesKey in division.species) {
                    const species = division.species[speciesKey];
                    allSpeciesData.push({
                        id: speciesKey,
                        ...species,
                        kingdom: kingdom.nama,
                        kingdomKey: kingdomKey,
                        division: division.nama
                    });
                }
            }
        }

        filteredData = [...allSpeciesData];
        renderTable();
        document.getElementById('tableContent').style.display = 'block';
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loading').innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i> 
                Gagal memuat data: ${error.message}
            </div>
        `;
    }
}

// Render tabel
function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredData.slice(start, end);

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    if (pageData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <i class="bi bi-search" style="font-size: 3rem; color: #ccc;"></i>
                    <p class="mt-2 text-muted">Tidak ada data ditemukan</p>
                </td>
            </tr>
        `;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    pageData.forEach(species => {
        const row = document.createElement('tr');
        row.onclick = () => window.location.href = `contentpagednm.html?id=${species.id}`;
        
        const statusBadge = species.status && species.status[0] 
            ? `<span class="badge badge-custom" style="background: ${species.status[0].warna};">
                ${species.status[0].label}
               </span>`
            : '-';

        row.innerHTML = `
            <td><strong>${species.nama}</strong></td>
            <td><em>${species.namaLatin}</em></td>
            <td>${species.kingdom}</td>
            <td>${species.division}</td>
            <td>${statusBadge}</td>
        `;
        tbody.appendChild(row);
    });

    renderPagination();
    updatePageInfo();
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">
        <i class="bi bi-chevron-left"></i>
    </a>`;
    pagination.appendChild(prevLi);

    // Page numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>`;
        pagination.appendChild(li);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">
        <i class="bi bi-chevron-right"></i>
    </a>`;
    pagination.appendChild(nextLi);
}

// Update page info
function updatePageInfo() {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredData.length);
    const total = filteredData.length;

    document.getElementById('startItem').textContent = start;
    document.getElementById('endItem').textContent = end;
    document.getElementById('totalItems').textContent = total;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderTable();
    
    // Scroll to table
    document.getElementById('tableContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Search species
function searchSpecies() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredData = allSpeciesData.filter(species => {
        const matchesSearch = 
            species.nama.toLowerCase().includes(searchTerm) ||
            species.namaLatin.toLowerCase().includes(searchTerm) ||
            species.kingdom.toLowerCase().includes(searchTerm) ||
            species.division.toLowerCase().includes(searchTerm);
        
        const matchesFilter = currentFilter === 'all' || species.kingdomKey === currentFilter;
        
        return matchesSearch && matchesFilter;
    });

    currentPage = 1;
    renderTable();
}

// Filter by kingdom
function filterByKingdom(kingdom) {
    currentFilter = kingdom;
    currentPage = 1;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.filter-btn').classList.add('active');

    // Apply filter
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredData = allSpeciesData.filter(species => {
        const matchesSearch = 
            species.nama.toLowerCase().includes(searchTerm) ||
            species.namaLatin.toLowerCase().includes(searchTerm) ||
            species.kingdom.toLowerCase().includes(searchTerm) ||
            species.division.toLowerCase().includes(searchTerm);
        
        const matchesFilter = kingdom === 'all' || species.kingdomKey === kingdom;
        
        return matchesSearch && matchesFilter;
    });

    renderTable();
}

// Load data saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadData);