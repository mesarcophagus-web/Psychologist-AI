// Configuration
const CONFIG = {
    API_ENDPOINT: '/api/chat',
    STORAGE_KEY: 'psychologist_chat_history',
    MAX_HISTORY: 50
};

// State Management
const state = {
    currentCharacter: null,
    messages: [],
    isLoading: false,
    sessionId: generateSessionId(),
    apiKey: null
};

// Characters Configuration
const characters = {
    stoic: {
        icon: '🏛️',
        name: 'Стоик-философ',
        greeting: 'Приветствую. Что привело тебя сюда?',
        personality: 'You are a Stoic philosopher. Respond calmly and philosophically. Be concise but profound. Focus on what is within the person\'s control.',
        language: 'Russian'
    },
    mom: {
        icon: '🤱',
        name: 'Заботливая мама',
        greeting: 'Здравствуй, солнышко. Как ты себя чувствуешь?',
        personality: 'You are a caring mother figure. Be warm, empathetic, and supportive. Listen deeply and validate feelings. Offer comfort and wisdom.',
        language: 'Russian'
    },
    coach: {
        icon: '🔥',
        name: 'Дерзкий коуч',
        greeting: 'Привет! Ну что, готова копнуть глубже? Что у тебя на уме?',
        personality: 'You are a bold coach. Be direct, energetic, and honest. Challenge assumptions. Motivate action and growth.',
        language: 'Russian'
    }
};

// Utility Functions
function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getStorageKey(character) {
    return `${CONFIG.STORAGE_KEY}_${character}`;
}

function saveToLocalStorage() {
    if (!state.currentCharacter) return;
    try {
        const key = getStorageKey(state.currentCharacter);
        localStorage.setItem(key, JSON.stringify(state.messages));
    } catch (e) {
        console.warn('Failed to save to localStorage:', e);
    }
}

function loadFromLocalStorage(character) {
    try {
        const key = getStorageKey(character);
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.warn('Failed to load from localStorage:', e);
        return [];
    }
}

function clearStorageForCharacter(character) {
    try {
        const key = getStorageKey(character);
        localStorage.removeItem(key);
    } catch (e) {
        console.warn('Failed to clear storage:', e);
    }
}

// UI Functions
function openChat(type) {
    state.currentCharacter = type;
    const char = characters[type];

    // Update header
    document.getElementById('chatIcon').textContent = char.icon;
    document.getElementById('chatName').textContent = char.name;

    // Clear messages
    state.messages = [];
    document.getElementById('chatMessages').innerHTML = '';

    // Load history if exists
    const history = loadFromLocalStorage(type);
    if (history.length > 0) {
        state.messages = history;
        state.messages.forEach(msg => {
            addMessageToDOM(msg.text, msg.sender);
        });
    } else {
        // Add greeting
        addMessage(char.greeting, 'bot');
    }

    // Update UI
    document.getElementById('mainScreen').style.display = 'none';
    document.getElementById('chatScreen').classList.add('active');
    document.getElementById('chatInput').focus();
}

function goBack() {
    state.currentCharacter = null;
    document.getElementById('mainScreen').style.display = 'flex';
    document.getElementById('chatScreen').classList.remove('active');
}

function addMessageToDOM(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.textContent = text;
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addMessage(text, sender) {
    state.messages.push({ text, sender, timestamp: Date.now() });
    
    // Keep only last N messages
    if (state.messages.length > CONFIG.MAX_HISTORY) {
        state.messages = state.messages.slice(-CONFIG.MAX_HISTORY);
    }
    
    saveToLocalStorage();
    addMessageToDOM(text, sender);
}

function showLoadingIndicator() {
    const div = document.createElement('div');
    div.id = 'loadingMessage';
    div.className = 'message bot loading';
    div.innerHTML = '<span style="opacity: 0.7;">Думаю...</span>';
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeLoadingIndicator() {
    const loading = document.getElementById('loadingMessage');
    if (loading) {
        loading.remove();
    }
}

// API Integration
async function getAIResponse(userMessage, mode = null) {
    try {
        state.isLoading = true;
        showLoadingIndicator();

        const char = characters[state.currentCharacter];
        
        // Build context from recent messages
        const recentMessages = state.messages.slice(-10);
        const context = recentMessages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
        }));

        const response = await fetch(CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                character: state.currentCharacter,
                message: userMessage,
                mode: mode,
                context: context,
                personality: char.personality,
                sessionId: state.sessionId
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusCode}`);
        }

        const data = await response.json();
        removeLoadingIndicator();
        
        if (data.response) {
            addMessage(data.response, 'bot');
        } else {
            throw new Error('No response from API');
        }

    } catch (error) {
        console.error('Error getting AI response:', error);
        removeLoadingIndicator();
        addMessage('Прости, произошла ошибка. Попробуй ещё раз.', 'bot');
    } finally {
        state.isLoading = false;
    }
}

// Message Handlers
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();

    if (!text || state.isLoading) return;

    addMessage(text, 'user');
    input.value = '';
    input.focus();

    // Get AI response
    await getAIResponse(text);
}

async function sendMode(mode) {
    addMessage(mode, 'user');
    // Wait a bit before getting response
    await new Promise(resolve => setTimeout(resolve, 500));
    await getAIResponse(mode, mode);
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Psychologist AI loaded');
    
    // Check for API key in URL params (for development)
    const urlParams = new URLSearchParams(window.location.search);
    const apiKey = urlParams.get('apiKey');
    if (apiKey) {
        state.apiKey = apiKey;
        // Remove from URL for security
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// Prevent accidental data loss
window.addEventListener('beforeunload', (e) => {
    if (state.messages.length > 0) {
        e.preventDefault();
        e.returnValue = '';
    }
});