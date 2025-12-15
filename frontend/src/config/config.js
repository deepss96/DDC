// Frontend Configuration
const config = {
  // API Configuration - Dynamic for production
  api: {
    baseUrl: (() => {
      // Production: Use environment variable or construct from current domain
      if (import.meta.env.PROD) {
        // If explicitly set, use it
        if (import.meta.env.VITE_API_BASE_URL) {
          return import.meta.env.VITE_API_BASE_URL;
        }
        // Otherwise, assume backend is on the same domain with /api prefix
        // or on a subdomain (api.domain.com)
        if (typeof window !== 'undefined') {
          const currentHost = window.location.host;
          const protocol = window.location.protocol;

          // Try api subdomain first (api.example.com)
          if (currentHost.includes('.')) {
            const domainParts = currentHost.split('.');
            if (domainParts.length >= 2) {
              const apiHost = `api.${domainParts.slice(-2).join('.')}`;
              return `${protocol}//${apiHost}`;
            }
          }

          // Fallback: assume backend is on same domain at /api
          return `${protocol}//${currentHost}`;
        }
      }

      // Development: Use localhost or environment variable
      return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    })(),
    timeout: 10000
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'DDC Developer',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
    port: import.meta.env.VITE_FRONTEND_PORT || '5173'
  }
};

export default config;
