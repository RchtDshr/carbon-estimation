// API configuration for communicating with the backend
// When accessed via browser, use localhost:8000
// When running server-side in Docker, use backend:8000
const getApiBaseUrl = () => {
  // Check if we're running in a browser environment
  if (typeof window !== 'undefined') {
    // Browser environment - use localhost
    return import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }
  // Server environment (Docker) - use service name
  return 'http://backend:8000';
};

const API_BASE_URL = getApiBaseUrl();

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async get(endpoint: string) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  }

  async post(endpoint: string, data: any) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  }
}

export const api = new ApiClient();

// Example API calls
export const healthCheck = () => api.get('/health');
export const testBackend = () => api.get('/api/test');