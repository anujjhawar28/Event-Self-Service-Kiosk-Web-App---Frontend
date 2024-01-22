import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // Your API base URL
  timeout: 5000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
}); 
  
export default axiosInstance;
