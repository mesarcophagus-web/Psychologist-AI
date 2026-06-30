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

// Static files
router.get('/', () => {
    return fetch('file:///src/index.html');
});

router.get('/styles.css', () => {
    return fetch('file:///src/styles.css');
});

router.get('/app.js', () => {
    return fetch('file:///src/app.js');
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

        // Store conversation if R2 is available
        if (env.CHAT_HISTORY) {
            try {
                const timestamp = new Date().toISOString();
                const logEntry = {
                    timestamp,
                    character,
                    userMessage: message,
                    aiResponse: aiResponse
                };
                await env.CHAT_HISTORY.put(
                    `${Date.now()}_${Math.random()}`,
                    JSON.stringify(logEntry)
                );
            } catch (e) {
                console.warn('Failed to store chat history:', e);
            }
        }

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