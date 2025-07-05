// src/utils/api.js
import axios from 'axios';
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// adding the base url before every api call
///////////////////////////////////////////////////////////////////////////
const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});
axios.defaults.withCredentials = true;

///////////////////////////////////////////////////////////////////////////
// Add a request interceptor so before each request we add the token to the headers
///////////////////////////////////////////////////////////////////////////
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log("Api token:", token);  // Print token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// ///////////////////////////////////////////////////////////////////////////
// Add a response interceptor to handle auth errors and redirect to login
// ///////////////////////////////////////////////////////////////////////////
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export default api;