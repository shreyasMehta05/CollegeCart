import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import Cookies from 'js-cookie';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const storedUser = localStorage.getItem('user'); // Fetch stored user immediately
    const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('token');  // Retrieve token from cookies

        if (token && storedUser) {
            setUser(JSON.parse(storedUser)); // Restore user
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Persist user data
        Cookies.set('token', token, { expires: 7 });  // Persist token for 7 days
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        Cookies.remove('token');
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
