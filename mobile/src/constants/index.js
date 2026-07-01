export const APP_CONFIG = {
  name: 'Psychologist AI',
  version: '1.0.0',
  apiUrl: !__DEV__ 
    ? 'https://psychologistai.mi-emaehf.workers.dev'
    : 'http://localhost:8081',
};

export const API_ENDPOINTS = {
  chat: '/chat',
  messages: '/messages',
  therapists: '/therapists',
  // Add all your endpoints
};

export default APP_CONFIG;