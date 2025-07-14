import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Define your backend API URL here
const API_URL = 'http://localhost:8080'; // Update this with your actual backend URL

export const createApiClient = (token?: string): AxiosInstance => {
  const config: AxiosRequestConfig = {
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const client = axios.create(config);

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle global error responses
      if (error.response?.status === 401) {
        // Unauthorized, clear any stored auth and redirect to login
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

export const getAuthenticatedApiClient = (): AxiosInstance => {
  const token = localStorage.getItem('token');
  if (!token) {
    return apiClient;
  }
  
  return createApiClient(token);
};