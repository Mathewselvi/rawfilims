// Use environment variable for API URL in production (Vercel), fallback to localhost for dev
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

