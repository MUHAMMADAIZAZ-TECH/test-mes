import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    'ngrok-skip-browser-warning': true,
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // You can modify the request configuration here, e.g., add headers
    // config.headers.Authorization = `Bearer ${yourAccessToken}`;
    return config;
  },
  (error) => {
    // Handle any request errors here
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // You can modify the response data or perform other actions here
    return response;
  },
  (error) => {
    // Handle any response errors here
    return Promise.reject(error);
  }
);

export default api;
