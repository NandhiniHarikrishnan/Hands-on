import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token is invalid or expired, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Customer API
export const customerAPI = {
  getAll: () => api.get('/customers'),
  getById: (id: number) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: number, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: number) => api.delete(`/customers/${id}`),
};

// Contact History API
export const contactHistoryAPI = {
  getAll: () => api.get('/contact-history'),
  getByCustomer: (customerId: number) => api.get(`/contact-history/customer/${customerId}`),
  create: (data: any) => api.post('/contact-history', data),
  update: (id: number, data: any) => api.put(`/contact-history/${id}`, data),
  delete: (id: number) => api.delete(`/contact-history/${id}`),
};

// Sales Lead API
export const salesLeadAPI = {
  getAll: () => api.get('/sales-leads'),
  getById: (id: number) => api.get(`/sales-leads/${id}`),
  getByStage: (stage: string) => api.get(`/sales-leads/stage/${stage}`),
  create: (data: any) => api.post('/sales-leads', data),
  update: (id: number, data: any) => api.put(`/sales-leads/${id}`, data),
  updateStage: (id: number, stage: string) => api.put(`/sales-leads/${id}/stage`, { stage }),
  delete: (id: number) => api.delete(`/sales-leads/${id}`),
};

// Task API
export const taskAPI = {
  getAll: () => api.get('/tasks'),
  getById: (id: number) => api.get(`/tasks/${id}`),
  getByStatus: (status: string) => api.get(`/tasks/status/${status}`),
  getOverdue: () => api.get('/tasks/overdue'),
  create: (data: any) => api.post('/tasks', data),
  update: (id: number, data: any) => api.put(`/tasks/${id}`, data),
  updateStatus: (id: number, status: string) => api.put(`/tasks/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/tasks/${id}`),
};

// Auth API
export const authAPI = {
  login: (username: string, password: string) => 
    api.post('/auth/login', { username, password }),
  register: (username: string, email: string, password: string) => 
    api.post('/auth/register', { username, email, password }),
  getProfile: () => api.get('/auth/profile'),
  setupAdmin: (username: string, email: string, password: string) => 
    api.post('/auth/setup-admin', { username, email, password }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api; 