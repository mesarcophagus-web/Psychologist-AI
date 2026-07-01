// Production API URL - your Cloudflare Workers endpoint
const PRODUCTION_API_URL = 'https://psychologistai.mi-emaehf.workers.dev';

// Development API URL (only used in dev mode)
const DEVELOPMENT_API_URL = 'http://localhost:8081';

// Determine if we're in production
const IS_PRODUCTION = !__DEV__;

export const API_CONFIG = {
  baseUrl: IS_PRODUCTION ? PRODUCTION_API_URL : DEVELOPMENT_API_URL,
  endpoints: {
    chat: '/chat',
    message: '/message',
    // Add more endpoints as needed
  }
};

export default API_CONFIG;