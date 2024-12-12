document.addEventListener('DOMContentLoaded', function() {
    let contracts = [];
    const contractsGrid = document.getElementById('contractsGrid');
    const searchInput = document.querySelector('.search-input');
    const addContractBtn = document.getElementById('addContractBtn');
    const modal = document.getElementById('addContractModal');
    const modalClose = document.querySelector('.modal-close');
    const addContractForm = document.getElementById('addContractForm');

    // Fetch and load contracts
    async function loadContracts() {
        try {
            const response = await fetch('http://localhost:8000/api/contracts');
            const contracts = await response.json();
            
            const contractsGrid = document.getElementById('contractsGrid');
            contractsGrid.innerHTML = '';
            
            contracts.forEach(contract => {
                const card = document.createElement('div');
                card.className = 'contract-card';
                card.style.cursor = 'pointer';
                
                card.innerHTML = `
                    <div>
                        <h3 style="margin: 0 0 0.5rem 0">${contract.title}</h3>
                        <p style="margin: 0; opacity: 0.7">${contract.contractor_name}</p>
                    </div>
                    <div style="text-align: right">
                        <span class="status-badge status-${contract.status.toLowerCase()}">${contract.status}</span>
                        <p style="margin: 0.5rem 0 0 0; opacity: 0.7">Value: ${contract.value}</p>
                    </div>
                `;
                
                card.addEventListener('click', () => {
                    window.location.href = `contract-details.html?id=${contract.id}`;
                });
                
                contractsGrid.appendChild(card);
            });
        } catch (error) {
            console.error('Error loading contracts:', error);
        }
    }

    // Filter contracts
    function filterContracts(searchTerm) {
        const filtered = contracts.filter(contract => 
            contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.contractor.toLowerCase().includes(searchTerm.toLowerCase())
        );
        renderContracts(filtered);
    }

    // Event Listeners
    searchInput.addEventListener('input', (e) => {
        filterContracts(e.target.value);
    });

    addContractBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    addContractForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const newContract = {
            id: contracts.length + 1,
            title: formData.get('title'),
            contractor: formData.get('contractor'),
            value: Number(formData.get('value')),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            status: formData.get('status')
        };

        contracts.unshift(newContract);
        renderContracts(contracts);
        modal.style.display = 'none';
        e.target.reset();
    });

    // Initial load
    loadContracts();
}); 