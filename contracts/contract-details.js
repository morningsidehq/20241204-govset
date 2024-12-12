document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const contractId = urlParams.get('id');

    if (!contractId) {
        window.location.href = 'contracts.html';
        return;
    }

    try {
        const response = await fetch('data.json');
        const contracts = await response.json();
        const contract = contracts.find(c => c.id === parseInt(contractId));

        if (!contract) {
            window.location.href = 'contracts.html';
            return;
        }

        renderContractDetails(contract);
    } catch (error) {
        console.error('Error loading contract details:', error);
    }
});

function renderContractDetails(contract) {
    const detailsContainer = document.getElementById('contractDetails');
    
    detailsContainer.innerHTML = `
        <div class="contract-details-card">
            <div class="contract-header">
                <div>
                    <h1 class="contract-title">${contract.title}</h1>
                    <p style="margin-top: 0.5rem; opacity: 0.7">${contract.contractor}</p>
                </div>
                <span class="status-badge status-${contract.status.toLowerCase()}">${contract.status}</span>
            </div>

            <div class="contract-section">
                <h2 class="section-title">Contract Details</h2>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Contract Value</span>
                        <span class="detail-value">$${contract.value.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Start Date</span>
                        <span class="detail-value">${new Date(contract.startDate).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">End Date</span>
                        <span class="detail-value">${new Date(contract.endDate).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Duration</span>
                        <span class="detail-value">${calculateDuration(contract.startDate, contract.endDate)}</span>
                    </div>
                </div>
            </div>

            <div class="contract-section">
                <h2 class="section-title">Related Documents</h2>
                <div class="documents-list">
                    <a href="#" class="document-link">
                        <span>Original Contract</span>
                        <span style="opacity: 0.7">PDF • 2.3MB</span>
                    </a>
                    <a href="#" class="document-link">
                        <span>Amendment 1</span>
                        <span style="opacity: 0.7">PDF • 1.1MB</span>
                    </a>
                    <a href="#" class="document-link">
                        <span>Insurance Certificate</span>
                        <span style="opacity: 0.7">PDF • 856KB</span>
                    </a>
                </div>
            </div>
        </div>
    `;
}

function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
    return `${months} months`;
} 