# CloudFlare Deployment Guide

Complete step-by-step guide to deploy Твой Психолог to CloudFlare.

## Prerequisites

- CloudFlare account (free tier OK)
- Node.js 16+ installed
- OpenAI API key
- A domain (optional, can use free *.workers.dev domain)

## Step 1: Prepare CloudFlare Account

1. Go to https://dash.cloudflare.com
2. Sign up or log in
3. Note your **Account ID** (bottom right of dashboard)
4. Create API token:
   - Go to Profile → API Tokens
   - Click "Create Token"
   - Use template: "Edit CloudFlare Workers"
   - Grant permissions for workers and zones
   - Copy the token

## Step 2: Prepare OpenAI API

1. Go to https://platform.openai.com/api/keys
2. Create new API key
3. Copy the key (you won't see it again)
4. Set up usage limits in your account

## Step 3: Local Setup

```bash
# Clone repository
git clone https://github.com/mesarcophagus-web/Psychologist-AI.git
cd Psychologist-AI

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit with your values
nano .env.local
```

Add to `.wrangler.toml`:
```toml
account_id = "your_account_id_here"
```

## Step 4: Store Secrets in CloudFlare

Store sensitive data as CloudFlare secrets:

```bash
# Store OpenAI API key
wrangler secret put OPENAI_API_KEY --env production
# Paste your OpenAI key when prompted

# Verify it's stored
wrangler secret list --env production
```

## Step 5: Test Locally

```bash
npm run dev
```

Visit http://localhost:8787 and test:
- Select a character
- Send a message
- Verify responses work

## Step 6: Deploy to CloudFlare

### Option A: Free *.workers.dev Domain

```bash
# Deploy without custom domain
npm run deploy

# Your app will be available at:
# https://psychologist-ai.your-username.workers.dev
```

### Option B: Custom Domain

1. **Add domain to CloudFlare:**
   - Go to CloudFlare dashboard
   - Click "Add site"
   - Enter your domain
   - Follow DNS setup instructions
   - Wait for domain verification

2. **Update wrangler.toml:**
```toml
[env.production]
name = "psychologist-ai-prod"
route = "yourdomain.com/*"
zone_id = "your_zone_id"
```

3. **Deploy:**
```bash
npm run deploy -- --env production
```

## Step 7: Configure CloudFlare Settings

1. **SSL/TLS:**
   - Go to SSL/TLS → Edge Certificates
   - Ensure "Always use HTTPS" is ON
   - Enable "Minimum TLS Version" 1.2

2. **Caching:**
   - Go to Caching → Configuration
   - Set Browser Cache TTL to 1 hour
   - Set Cache Level to "Cache Everything"

3. **Performance:**
   - Go to Speed → Optimization
   - Enable "Brotli compression"
   - Enable "HTTP/2"

4. **Security:**
   - Go to Security → WAF
   - Enable "High" security level
   - Configure rate limiting:
     - 50 requests per 10 seconds per IP

## Step 8: Monitor Deployment

```bash
# View deployment logs
wrangler tail

# Check worker status
wrangler deployments list

# Test API endpoint
curl https://your-domain.com/api/health
# Should return: {"status":"ok"}
```

## Step 9: Environment-Specific Configuration

### Development
```bash
npm run dev
# Run locally with hot reload
```

### Staging
```bash
wrangler deploy --env staging
# Deploy to staging environment
```

### Production
```bash
wrangler deploy --env production
# Full production deployment with monitoring
```

## Updating After Deployment

```bash
# Make changes to files
# e.g., edit src/app.js, functions/index.js, etc.

# Test locally
npm run dev

# Deploy updated version
npm run deploy

# View deployment history
wrangler deployments list
```

## Rollback

```bash
# List previous deployments
wrangler deployments list

# CloudFlare keeps last 10 deployments
# Use dashboard to rollback if needed
# Or redeploy previous commit:
git checkout <commit-hash>
npm run deploy
```

## Troubleshooting

### 401 Error on Deploy
```bash
# Re-authenticate with CloudFlare
wrangler login

# Or use API token:
export CLOUDFLARE_API_TOKEN=your_token
wrangler deploy
```

### Secret not available
```bash
# Verify secret exists
wrangler secret list

# Redeploy after adding secret
wrangler deploy
```

### CORS issues
- Check `corsHeaders` in `functions/index.js`
- Verify request headers in browser DevTools
- Check CloudFlare firewall rules

### Slow responses
- Check OpenAI API status
- Monitor CloudFlare Analytics
- Review Worker logs: `wrangler tail`

### Chat not persisting
- Check localStorage in browser DevTools → Application
- Verify R2 bucket configuration if using R2
- Check for console errors

## Cost Estimates

**CloudFlare (Monthly):**
- Workers: Free tier includes 100,000 requests/day
- Pages: Free
- R2 Storage: First 10GB free, then $0.015/GB
- Typical usage: ~$0

**OpenAI API:**
- gpt-4o-mini: ~$0.00015 per 1K input tokens, $0.0006 per 1K output tokens
- Average message: ~500 tokens = ~$0.0003 per exchange
- 1000 exchanges/month ≈ $0.30

## Security Checklist

- [ ] API keys stored as CloudFlare secrets (not in code)
- [ ] HTTPS enabled for all routes
- [ ] Rate limiting configured
- [ ] CORS headers properly set
- [ ] Environment variables removed from git
- [ ] `.env.local` added to `.gitignore`
- [ ] Regular backups of important data
- [ ] Monitor API usage and costs
- [ ] Enable CloudFlare DDoS protection
- [ ] Review access logs regularly

## Performance Optimization

```javascript
// In wrangler.toml, optimize:
compatibility_date = "2024-01-15"

// Enable minification:
[build]
command = "npm run build"

// Cache headers for static assets:
// Add to functions/index.js for better caching
```

## Monitoring

Set up CloudFlare Analytics:
1. Go to Analytics tab
2. Monitor:
   - Worker requests and errors
   - Performance metrics
   - Cache hit ratio
   - Threats blocked

Set up alerts:
1. Go to Notifications
2. Create alert for:
   - High error rate
   - High latency
   - Unusual traffic patterns

## Support

- CloudFlare Docs: https://developers.cloudflare.com/
- CloudFlare Community: https://community.cloudflare.com/
- OpenAI Support: https://platform.openai.com/account/api-keys

---

**Deployment Complete! 🎉**

Your Психолог app is now live and ready to help!
