import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = (userData) => API.post('/users/register', userData);
export const login = (userData) => API.post('/users/login', userData);
export const createPayment = (paymentData) => API.post('/payments/create', paymentData);
export const pay = (paymentData) => API.post('/payments/pay', paymentData);
export const myPayments = () => API.get('/payments/mypayments');
export const getCreatedPayments = () => API.get('/payments/created');
export const getPaymentDetails = (paymentCode) => API.get(`/payments/details/${paymentCode}`);

export default API;

