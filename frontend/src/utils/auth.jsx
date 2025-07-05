// src/utils/auth.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protected Route Component
export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth(); // Custom hook to get auth state
    console.log('ProtectedRoute:', user, loading);
    if (loading) {
        return null; // return null while checking auth state
    }

    if (!user) {
        return <Navigate to="/login" />; // redirect to login if user is not authenticated
    }

    return children;
};

// Auth Helper Functions
export const authUtils = {

    // Check if user is authenticated
    isAuthenticated: () => { // Check if user is authenticated
        return !!localStorage.getItem('token'); // !! converts to boolean
    },

    // Get auth token
    getToken: () => {
        return localStorage.getItem('token'); // Get token from local storage
    },

    // Get current user
    getUser: () => {
        const userStr = localStorage.getItem('user'); // Get user from local storage
        return userStr ? JSON.parse(userStr) : null; // Parse user if exists
    },

    // Set auth data
    setAuthData: (token, user) => {
        localStorage.setItem('token', token); // Set token in local storage
        localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage
    },

    // Clear auth data
    clearAuthData: () => {
        localStorage.removeItem('token'); // Remove token from local storage
        localStorage.removeItem('user'); // Remove user from local storage
    },

    // Update user data
    updateUser: (userData) => {
        const currentUser = authUtils.getUser(); // Get current user
        const updatedUser = { ...currentUser, ...userData }; // Merge user data
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Update user in local storage
    }
};

// Custom hook for protected API calls
export const useProtectedFetch = () => {
    const { logout } = useAuth();

    const fetchWithAuth = async (url, options = {}) => {
        console.log('fetchWithAuth:', url, options);
        try {
            const token = authUtils.getToken();
            if (!token) {
                throw new Error('No auth token');
            }

            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 401) {
                logout();
                throw new Error('Session expired');
            }

            return response;
        } catch (error) {
            throw error;
        }
    };

    return fetchWithAuth;
};