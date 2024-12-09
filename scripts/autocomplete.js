const SUPABASE_URL = 'https://apzyykplpafkatrlsklz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwenl5a3BscGFma2F0cmxza2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0NDIwNDMsImV4cCI6MjA0NTAxODA0M30.9SO4NP8G_Lh64Y54bgmHN0GSARaLGIO3beV7FmZidug';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const searchInput = document.getElementById('searchInput');
const suggestionsDiv = document.getElementById('suggestions');
const resultDiv = document.getElementById('result');

let debounceTimer;

searchInput.addEventListener('input', async (e) => {
    clearTimeout(debounceTimer);
    const searchTerm = e.target.value;
    
    if (searchTerm.length < 2) {
        suggestionsDiv.classList.add('hidden');
        return;
    }

    debounceTimer = setTimeout(async () => {
        const { data, error } = await supabase
            .from('agencies')
            .select('*')
            .ilike('name', `%${searchTerm}%`)
            .limit(10);

        if (error) {
            console.error('Error:', error);
            return;
        }

        displaySuggestions(data);
    }, 300);
});

function displaySuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';
    
    if (suggestions.length > 0) {
        suggestionsContainer.classList.remove('hidden');
        suggestions.forEach(suggestion => {
            const div = document.createElement('div');
            div.className = 'px-6 py-3 hover:bg-gray-50 cursor-pointer transition duration-150 font-["Inter"]';
            div.textContent = suggestion.name;
            div.onclick = () => selectSuggestion(suggestion);
            suggestionsContainer.appendChild(div);
        });
    } else {
        suggestionsContainer.classList.add('hidden');
    }
}

function displayResult(result) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = `
        <div class="result-card">
            <h2>${result.name}</h2>
            
            <div class="result-section">
                <a href="${result.emergency_url}" 
                   class="result-link" 
                   target="_blank">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
                    </svg>
                    Emergency Information
                </a>
            </div>

            <div class="result-section">
                ${result.youtube_url || result.facebook_url ? `
                    <div class="social-links">
                        ${result.youtube_url ? `
                        <a href="${result.youtube_url}" class="result-link" target="_blank">
                            <svg fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                            </svg>
                            YouTube Channel
                        </a>
                        ` : ''}
                        
                        ${result.facebook_url ? `
                        <a href="${result.facebook_url}" class="result-link" target="_blank">
                            <svg fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Facebook Page
                        </a>
                        ` : ''}
                    </div>
                ` : ''}
            </div>

            ${result.url_elected ? `
            <div class="result-section">
                <a href="${result.url_elected}" class="result-link" target="_blank">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H6v-.99c.2-.72 3.3-2.01 6-2.01s5.8 1.29 6 2v1z"/>
                    </svg>
                    View Elected Officials
                </a>
            </div>
            ` : ''}

            ${result.website ? `
            <div class="result-section">
                <a href="${result.website}" class="result-link" target="_blank">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    Official Website
                </a>
            </div>
            ` : ''}
        </div>
    `;
}

function selectSuggestion(agency) {
    searchInput.value = agency.name;
    displayResult(agency);
    document.getElementById('suggestions').classList.add('hidden');
}

// Add event listener to hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    const suggestionsContainer = document.getElementById('suggestions');
    const searchInput = document.getElementById('searchInput');
    
    if (!suggestionsContainer.contains(e.target) && e.target !== searchInput) {
        suggestionsContainer.classList.add('hidden');
    }
});
