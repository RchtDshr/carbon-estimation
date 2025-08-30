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
        // Try to extract error message from response
        try {
          const errorData = await response.json();
          const errorMessage = errorData.detail || errorData.message || `HTTP error! status: ${response.status}`;
          throw new Error(errorMessage);
        } catch (parseError) {
          // If JSON parsing fails, use status text
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
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
        // Try to extract error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorText = await response.text();
          if (errorText) {
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.detail || errorData.message || errorMessage;
            } catch (jsonError) {
              // If it's not JSON, use the text as is if it looks like an error message
              if (errorText.length < 200 && !errorText.includes('<html>')) {
                errorMessage = errorText;
              }
            }
          }
        } catch (parseError) {
          // Keep the default error message
        }
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  }

  async postFile(endpoint: string, file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        // Try to extract error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorText = await response.text();
          if (errorText) {
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.detail || errorData.message || errorMessage;
            } catch (jsonError) {
              // If it's not JSON, use the text as is if it looks like an error message
              if (errorText.length < 200 && !errorText.includes('<html>')) {
                errorMessage = errorText;
              }
            }
          }
        } catch (parseError) {
          // Keep the default error message
        }
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error('API POST FILE error:', error);
      throw error;
    }
  }
}

export const api = new ApiClient();

// API calls
export const healthCheck = () => api.get('/health');
export const testBackend = () => api.get('/api/test');
export const estimateCarbonFootprint = (dishName: string) => 
  api.post('/estimate', { dish: dishName });
export const estimateCarbonFootprintFromImage = (file: File) => 
  api.postFile('/estimate/image', file);