// Use environment variable for API URL in production (Vercel), fallback to localhost for dev
export const API_BASE_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5001');
export const API_URL = `${API_BASE_URL}/api`;

