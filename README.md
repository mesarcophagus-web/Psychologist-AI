<!-- trunk-ignore(prettier) -->
# 🌙 Твой Психолог - AI Psychologist

A modern, dynamic web application providing personalized psychological guidance through AI characters. Built with vanilla JavaScript and deployed on CloudFlare Workers.

## Features

✨ **Three Unique Characters**
- **🏛️ Стоик-философ** (Stoic Philosopher) - Calm, clear, imperturbable
- **🤱 Заботливая мама** (Caring Mother) - Warm, accepting, attentive
- **🔥 Дерзкий коуч** (Bold Coach) - Direct, energetic, honest

🤖 **AI-Powered Responses**
- Powered by OpenAI GPT-4o-mini
- Character-specific personalities
- Contextual conversation history
- Multiple interaction modes

💾 **Persistent Storage**
- Local browser storage for chat history
- CloudFlare R2 backend storage (optional)
- Session tracking

📱 **Responsive Design**
- Mobile-first approach
- Dark/light mode support
- Smooth animations and transitions
- Touch-friendly interface

⚡ **Performance**
- Minimal dependencies
- Fast CloudFlare deployment
- Optimized CSS and JavaScript
- Instant loading

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: CloudFlare Workers
- **AI**: OpenAI API (GPT-4o-mini)
- **Storage**: LocalStorage + CloudFlare R2
- **Deployment**: CloudFlare Pages/Workers

## Project Structure

```
.
├── src/
│   ├── index.html          # Main HTML
│   ├── styles.css          # Styling
│   └── app.js              # Frontend logic
├── functions/
│   └── index.js            # CloudFlare Workers backend
├── wrangler.toml           # CloudFlare configuration
├── package.json            # Dependencies
├── .env.example            # Environment variables template
└── README.md              # This file
```

## Quick Start

### Prerequisites
- Node.js 16+
- CloudFlare account
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mesarcophagus-web/Psychologist-AI.git
cd Psychologist-AI
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

4. **Local development**
```bash
npm run dev
```
Visit `http://localhost:8787`

### Deployment to CloudFlare

1. **Update wrangler.toml**
```toml
account_id = "your_account_id"
zone_id = "your_zone_id"
route = "yourdomain.com/*"
```

2. **Set environment secrets**
```bash
wrangler secret put OPENAI_API_KEY
# Paste your OpenAI API key when prompted
```

3. **Deploy**
```bash
npm run deploy
```

### Custom Domain Setup

1. Go to CloudFlare Dashboard
2. Add your domain
3. Update DNS records as instructed
4. Configure SSL/TLS settings
5. Deploy your worker to the domain

## API Reference

### `/api/chat` (POST)

Send a message and receive AI response.

**Request:**
```json
{
  "character": "stoic|mom|coach",
  "message": "Your message here",
  "mode": "optional_interaction_mode",
  "context": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Response" }
  ],
  "sessionId": "session_identifier"
}
```

**Response:**
```json
{
  "response": "AI character's response message"
}
```

### `/api/health` (GET)

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Interaction Modes

Users can select from 5 modes:
- **Побудь рядом** - Just be here with me
- **Разбери глубоко** - Analyze deeply
- **Дай взгляд со стороны** - Give an outside perspective
- **Помоги увидеть слепые зоны** - Help me see blind spots
- **Мне нужен только вопрос** - Just ask me a question

## Configuration

### Characters
Edit character definitions in `src/app.js`:
```javascript
const characters = {
    stoic: {
        icon: '🏛️',
        name: 'Стоик-философ',
        greeting: 'Приветствую. Что привело тебя сюда?',
        personality: 'You are a Stoic philosopher...',
        language: 'Russian'
    },
    // ...
};
```

### API Model
Change the model in `functions/index.js`:
```javascript
model: 'gpt-4o-mini'  // or 'gpt-4', 'gpt-3.5-turbo', etc.
```

### Storage
- **LocalStorage**: Browser-side chat history (auto-saved)
- **R2**: CloudFlare object storage for server-side logs (optional)

## Security

🔒 **Best Practices:**
- Never commit `.env` files with real keys
- Use CloudFlare Secret Manager for sensitive data
- OpenAI API key stored as CloudFlare secret
- CORS headers properly configured
- No sensitive data logged to console in production

⚠️ **Important:**
- Remove the demo API key from HTML/JavaScript
- Use environment variables for all secrets
- Enable CloudFlare rate limiting
- Monitor API usage and costs

## Performance Optimization

- CSS animations use GPU acceleration
- Lazy loading of character data
- Message caching with IndexedDB ready
- Worker response times: <100ms average
- Static asset caching headers configured

## Browser Support

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### "API key not configured"
- Set `OPENAI_API_KEY` in CloudFlare secrets
- Run: `wrangler secret put OPENAI_API_KEY`

### CORS errors
- Verify `corsHeaders` configuration in `functions/index.js`
- Check CloudFlare firewall rules

### Chat not saving
- Check browser localStorage is enabled
- Verify storage quota not exceeded
- Check browser console for errors

### Slow responses
- Check OpenAI API status
- Verify network connectivity
- Monitor CloudFlare analytics

## Performance Metrics

- **Load time**: <1s (CloudFlare CDN)
- **API response**: 1-3s (OpenAI)
- **UI interactions**: <100ms
- **Storage**: ~5KB per 50 messages

## Future Enhancements

🚀 Planned features:
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] User authentication
- [ ] Export chat history
- [ ] Analytics dashboard
- [ ] Additional characters
- [ ] Image support
- [ ] Therapy mode suggestions
- [ ] Mood tracking
- [ ] Integration with mental health resources

## License

MIT License - feel free to use and modify

## Support

Need help? 
- Check CloudFlare docs: https://developers.cloudflare.com/
- OpenAI API docs: https://platform.openai.com/docs
- Create an issue on GitHub

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

**Made with ❤️ for better mental health support**

v1.0.0 - Powered by CloudFlare & OpenAI
