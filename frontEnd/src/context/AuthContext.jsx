import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token'),
        userId: localStorage.getItem('userId')
    });

    const login = (token, userId) => {
        setAuth({ token, userId });
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
    };

    const logout = () => {
        setAuth({ token: null, userId: null });
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    };

    useEffect(() => {
        // Load initial user data from localStorage or other methods
    }, []);

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
