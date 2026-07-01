// Environment configuration
export const ENV = {
  production: !__DEV__,
  apiUrl: !__DEV__ 
    ? 'https://psychologistai.mi-emaehf.workers.dev'
    : 'http://localhost:8081',
  // Add other environment variables
  appName: 'Psychologist AI',
  version: '1.0.0',
};

export default ENV;