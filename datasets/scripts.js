// Initialize Supabase client (to be configured later)
// const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY')

document.addEventListener('DOMContentLoaded', function() {
    const filterInput = document.querySelector('.filter-input');
    const filterButton = document.querySelector('.filter-button');
    
    // Filter functionality
    function filterDatasets(searchTerm) {
        const rows = document.querySelectorAll('#datasetTableBody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const match = text.includes(searchTerm.toLowerCase());
            row.style.display = match ? '' : 'none';
        });
    }

    // Event listeners
    filterButton.addEventListener('click', () => {
        filterDatasets(filterInput.value);
    });

    filterInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            filterDatasets(filterInput.value);
        }
    });

    // Future Supabase integration function
    async function fetchDatasets() {
        try {
            // const { data, error } = await supabase
            //     .from('datasets')
            //     .select('*')
            
            // if (error) throw error;
            
            // Render the datasets
            // renderDatasets(data);
        } catch (error) {
            console.error('Error fetching datasets:', error);
        }
    }

    // Function to render datasets to the table
    function renderDatasets(datasets) {
        const tableBody = document.getElementById('datasetTableBody');
        tableBody.innerHTML = '';

        datasets.forEach(dataset => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dataset.name}</td>
                <td>${dataset.description}</td>
                <td>${dataset.lastUpdated}</td>
                <td>${dataset.format}</td>
                <td>${dataset.size}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Uncomment when ready to fetch real data
    // fetchDatasets();
});
