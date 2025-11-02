import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
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

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User API calls
export const userAPI = {
  register: (userData) => api.post('/users/register', userData),
  getAllUsers: () => api.get('/users'),
  getUsersByRole: (role) => api.get(`/users/role/${role}`),
  getUserByWallet: (walletAddress) => api.get(`/users/wallet/${walletAddress}`),
};

// Product API calls
export const productAPI = {
  register: (productData) => {
    const formData = new FormData();
    
    // Append all product fields
    Object.keys(productData).forEach(key => {
      if (key === 'images' && productData.images) {
        // Append each image file
        Array.from(productData.images).forEach((file) => {
          formData.append('images', file);
        });
      } else {
        formData.append(key, productData[key]);
      }
    });
    
    return api.post('/products/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateStatus: (productId, statusData) => api.put(`/products/${productId}/status`, statusData),
  getAllProducts: () => api.get('/products'),
  getAvailableProducts: (role) => api.get(`/products/available?role=${role}`),
  getProductById: (productId) => api.get(`/products/${productId}`),
  getProductsByOwner: (ownerId) => api.get(`/products/owner/${ownerId}`),
};

// Transfer Request API calls
export const transferRequestAPI = {
  create: (requestData) => api.post('/requests', requestData),
  getAll: (userId, type) => api.get(`/requests?userId=${userId}&type=${type}`),
  accept: (requestId, data) => api.put(`/requests/${requestId}/accept`, data),
  reject: (requestId, data) => api.put(`/requests/${requestId}/reject`, data),
};

// Blockchain API calls
export const blockchainAPI = {
  getOverview: () => api.get('/blockchain/overview'),
  getBlocks: () => api.get('/blockchain/blocks'),
  getBlockByNumber: (blockNumber) => api.get(`/blockchain/blocks/${blockNumber}`),
};

// Contract info
export const getContractInfo = () => axios.get('http://localhost:5000/api/contract-info');

export default api;
