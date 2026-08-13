import axios from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8000/api';

const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default apiClient;
