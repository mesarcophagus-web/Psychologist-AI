import { Router } from 'itty-router';

const router = Router();

// CORS Headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle CORS preflight
router.options('*', () => new Response(null, { headers: corsHeaders }));

// Simple HTML page
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Psychologist AI - Chat with Your Virtual Therapist</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container { width: 100%; max-width: 800px; }
        .chat-container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            height: 90vh;
            max-height: 800px;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 24px;
            text-align: center;
            border-radius: 16px 16px 0 0;
        }
        .header h1 { font-size: 28px; margin-bottom: 8px; }
        .header p { font-size: 14px; opacity: 0.9; }
        .psychologist-selector, .mode-selector {
            padding: 16px 24px;
            border-bottom: 1px solid #eee;
        }
        .psychologist-selector label, .mode-selector label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
            font-size: 14px;
        }
        .psychologist-selector select, .mode-selector select {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            background-color: #f8f9fa;
            cursor: pointer;
        }
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            background: #f9fafb;
        }
        .message { margin-bottom: 16px; display: flex; }
        .user-message { justify-content: flex-end; }
        .user-message p {
            background: #667eea;
            color: white;
            padding: 12px 16px;
            border-radius: 12px;
            max-width: 70%;
            word-wrap: break-word;
        }
        .ai-message p {
            background: #e8eef7;
            color: #333;
            padding: 12px 16px;
            border-radius: 12px;
            max-width: 70%;
            word-wrap: break-word;
            border-left: 4px solid #667eea;
        }
        .chat-input-area { padding: 20px 24px; border-top: 1px solid #eee; background: white; }
        #userMessage {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            font-family: inherit;
            resize: vertical;
        }
        .send-btn {
            width: 100%;
            margin-top: 12px;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
        }
        .info {
            padding: 16px 24px;
            background: #f0f4ff;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="chat-container">
            <div class="header">
                <h1>🌙 Psychologist AI</h1>
                <p>Chat with your virtual therapist</p>
            </div>

            <div class="psychologist-selector">
                <label for="character">Choose Your Therapist:</label>
                <select id="character">
                    <option value="Dr. Sofia">Dr. Sofia - Compassionate Counselor</option>
                    <option value="Dr. Marcus">Dr. Marcus - Pragmatic Advisor</option>
                    <option value="Dr. Elena">Dr. Elena - Empathetic Listener</option>
                </select>
            </div>

            <div class="mode-selector">
                <label for="mode">Session Mode:</label>
                <select id="mode">
                    <option value="supportive">Supportive</option>
                    <option value="analytical">Analytical</option>
                    <option value="reflective">Reflective</option>
                </select>
            </div>

            <div class="chat-messages" id="chatMessages">
                <div class="message ai-message">
                    <p>Hello! I'm here to listen and support you. What's on your mind today?</p>
                </div>
            </div>

            <div class="chat-input-area">
                <textarea 
                    id="userMessage" 
                    placeholder="Type your message here..." 
                    rows="3"
                    onkeypress="handleKeyPress(event)"
                ></textarea>
                <button onclick="sendMessage()" class="send-btn">Send Message</button>
            </div>

            <div class="info">
                <p>💬 All conversations are processed in real-time using AI</p>
                <p>🔒 Your privacy is important to us</p>
            </div>
        </div>
    </div>

    <script>
        let conversationContext = [];

        async function sendMessage() {
            const userMessage = document.getElementById('userMessage').value.trim();
            const character = document.getElementById('character').value;
            const mode = document.getElementById('mode').value;

            if (!userMessage) return;

            document.getElementById('userMessage').value = '';
            displayMessage(userMessage, 'user');
            showLoadingIndicator();

            try {
                const personalities = {
                    'Dr. Sofia': 'You are compassionate, empathetic, and create a safe space for sharing.',
                    'Dr. Marcus': 'You are pragmatic, solution-focused, and direct in your approach.',
                    'Dr. Elena': 'You are an empathetic listener, reflective, and thoughtful in your responses.'
                };

                const personality = personalities[character] || personalities['Dr. Sofia'];

                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        character: character,
                        message: userMessage,
                        context: conversationContext,
                        personality: personality,
                        mode: mode
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to get response from AI');
                }

                const data = await response.json();
                const aiResponse = data.response;

                conversationContext.push(
                    { role: 'user', content: userMessage },
                    { role: 'assistant', content: aiResponse }
                );

                if (conversationContext.length > 20) {
                    conversationContext = conversationContext.slice(-20);
                }

                removeLoadingIndicator();
                displayMessage(aiResponse, 'ai');

            } catch (error) {
                removeLoadingIndicator();
                console.error('Error:', error);
                displayMessage('Sorry, I encountered an error. Please check that your OpenAI API key is configured correctly.', 'ai');
            }
        }

        function displayMessage(message, sender) {
            const chatMessages = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + sender + '-message';

            const messageContent = document.createElement('p');
            messageContent.textContent = message;

            messageDiv.appendChild(messageContent);
            chatMessages.appendChild(messageDiv);

            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function showLoadingIndicator() {
            const chatMessages = document.getElementById('chatMessages');
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message ai-message';
            loadingDiv.id = 'loadingIndicator';
            loadingDiv.innerHTML = '<p>...</p>';
            chatMessages.appendChild(loadingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function removeLoadingIndicator() {
            const loadingIndicator = document.getElementById('loadingIndicator');
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter' && event.ctrlKey) {
                sendMessage();
            }
        }

        document.getElementById('userMessage').focus();
    </script>
</body>
</html>`;

// Home route - serve HTML
router.get('/', () => {
    return new Response(htmlContent, {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
    });
});

// API Routes
router.post('/api/chat', async (request, env) => {
    try {
        const body = await request.json();
        const { character, message, context, personality, mode } = body;

        // Get API key from environment
        const apiKey = env.OPENAI_API_KEY;
        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: 'API key not configured' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Build system prompt
        const systemPrompt = `You are a psychological counselor named "${character}". ${personality}
        
Respond in Russian. Keep responses concise (1-3 sentences). Be genuine and thoughtful.
${mode ? `Mode requested: ${mode}` : ''}`;

        // Prepare messages for OpenAI
        const messages = [
            { role: 'system', content: systemPrompt },
            ...context,
            { role: 'user', content: message }
        ];

        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages,
                max_tokens: 500,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            console.error('OpenAI API error:', response.statusText);
            return new Response(
                JSON.stringify({ error: 'Failed to get response from AI' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content.trim();

        return new Response(
            JSON.stringify({ response: aiResponse }),
            { 
                status: 200, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );

    } catch (error) {
        console.error('Chat API error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});

// Health check
router.get('/api/health', () => {
    return new Response(
        JSON.stringify({ status: 'ok' }),
        { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
    );
});

// 404 handler
router.all('*', () => {
    return new Response('Not Found', { status: 404 });
});

// Export for CloudFlare Workers
export default {
    fetch: router.handle
};
