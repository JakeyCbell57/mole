import Axios from 'axios';

const axios = Axios.create({
  baseURL: window.location.hostname === 'localhost' ? 'http://localhost:8000/api' : '/api',
  withCredentials: true
})

axios.interceptors.response.use(
  response => response.data, 
  error => Promise.reject(error.data)
);

export default axios;
