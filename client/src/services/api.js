import axios from 'axios';

// Backend ka URL yahan set karein
const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// Ye middleware har request ke sath token bhejega (agar user login hai)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// YAHAN HAI FIX: Default export lazmi hona chahiye
export default API;