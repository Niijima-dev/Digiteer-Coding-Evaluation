import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if(token){
      config.headers.Authorization = `Bearer ${token}`
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {

    const isAuthEndpoint = error.config?.url.includes('/User');

    if(error.response?.status == 401 &&
      !isAuthEndpoint && localStorage.getItem('token'))
    {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/Login';
    }
    return Promise.reject(error);
  }
)

export default api;
