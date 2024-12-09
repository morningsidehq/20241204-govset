// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Chat state
let chatState = {
    stage: 'agency', // Stages: agency, request, generating
    agency: '',
    request: '',
    messages: []
};

// Initial message
addMessage({
    role: 'assistant',
    content: "Hello! I'll help you draft a FOIA request. First, what agency or locality would you like to submit a request to?"
});

// Event Listeners
document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessage({
        role: 'user',
        content: message
    });
    
    input.value = '';
    
    // Handle different stages
    if (chatState.stage === 'agency') {
        chatState.agency = message;
        chatState.stage = 'request';
        addMessage({
            role: 'assistant',
            content: "Great! Now, what information are you requesting? Please be as specific as possible."
        });
    } else if (chatState.stage === 'request') {
        chatState.request = message;
        chatState.stage = 'generating';
        await generateFOIARequest();
    }
});

// Functions
async function generateFOIARequest() {
    addMessage({
        role: 'assistant',
        content: "I'm drafting your FOIA request now..."
    });

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a FOIA request expert. Generate a professional FOIA request letter."
                    },
                    {
                        role: "user",
                        content: `Please write a FOIA request letter to ${chatState.agency} requesting the following information: ${chatState.request}`
                    }
                ]
            })
        });

        const data = await response.json();
        const generatedRequest = data.choices[0].message.content;

        // Show the generated request
        document.getElementById('foia-preview').classList.remove('hidden');
        document.getElementById('foia-text').value = generatedRequest;

        addMessage({
            role: 'assistant',
            content: "I've generated your FOIA request. You can review it below, copy it to your clipboard, or download it as a PDF."
        });

    } catch (error) {
        console.error('Error:', error);
        addMessage({
            role: 'assistant',
            content: "I apologize, but I encountered an error while generating your request. Please try again."
        });
    }
}

function addMessage({ role, content }) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${role === 'assistant' ? 'justify-start' : 'justify-end'}`;
    
    messageDiv.innerHTML = `
        <div class="max-w-3/4 ${role === 'assistant' ? 'bg-gray-100' : 'bg-blue-500 text-white'} rounded-lg px-4 py-2">
            ${content}
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    chatState.messages.push({ role, content });
}

function copyToClipboard() {
    const foiaText = document.getElementById('foia-text');
    foiaText.select();
    document.execCommand('copy');
    alert('Copied to clipboard!');
}

async function downloadAsPDF() {
    // Implement PDF download functionality
    // You might want to use a library like jsPDF here
    alert('PDF download functionality coming soon!');
} 