import axios from 'axios';

// import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------
const baseURL = `http://localhost:3000`;

const apiService = axios.create({
  baseURL, // Adjust this base URL based on your API
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // กำหนด ngrok header
  },
});

export { apiService };
