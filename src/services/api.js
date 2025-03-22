import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8082/api',  // Vérifie que ce port est correct
  headers: { 'Content-Type': 'application/json' },
});

const DestinationService = {
  getAll: () => api.get('/destinations'),
};

export { DestinationService };
export default api;
