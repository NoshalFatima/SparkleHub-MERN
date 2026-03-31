import axios from 'axios';

// Backend ka base URL — development mein localhost:5000
const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Har request mein JWT token automatically attach ho jaye
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('sparkle_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;