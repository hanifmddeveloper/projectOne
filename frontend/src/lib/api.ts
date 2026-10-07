import axios from 'axios';

// Determine API Base URL dynamically:
// - In production / on Vercel: always use the co-located Next.js serverless API ('/api')
// - In development: use NEXT_PUBLIC_API_URL if specified, otherwise '/api'
const getBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    // If running in browser and hostname is not localhost (e.g. deployed on Vercel),
    // always use relative '/api' unless an explicit production URL is set
    if (window.location.hostname !== 'localhost' && (!envUrl || envUrl.includes('localhost'))) {
      return '/api';
    }
  }
  return envUrl || '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('doctor_portal_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for clear errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please verify backend connection.';
    return Promise.reject(new Error(message));
  }
);

export default api;
